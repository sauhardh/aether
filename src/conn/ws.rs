use crate::conn::{AetherWebRTCConnectionManager, ConnectionStatus};
use crate::rocket::futures::{SinkExt, StreamExt};

use tokio_tungstenite::connect_async;

use webrtc::api::interceptor_registry::register_default_interceptors;
use webrtc::api::media_engine::MediaEngine;
use webrtc::api::setting_engine::SettingEngine;
use webrtc::api::APIBuilder;
use webrtc::interceptor::registry::Registry;
use webrtc::peer_connection::sdp::session_description::RTCSessionDescription;

pub async fn start_server_connection(addr: String, token: String) -> anyhow::Result<()> {
    let mut engine = MediaEngine::default();

    engine
        .register_default_codecs()
        .expect("Unable to register default codecs.");

    let mut registry = Registry::new();

    registry = register_default_interceptors(registry, &mut engine)
        .expect("Unable to register default interceptors.");

    let mut settings = SettingEngine::default();

    settings.set_include_loopback_candidate(true);

    let api = APIBuilder::new()
        .with_media_engine(engine)
        .with_interceptor_registry(registry)
        .with_setting_engine(settings)
        .build();

    let (ws_stream, _) = connect_async(&format!("{addr}/v1/landlord/ws?token={token}")).await?;

    let (mut sink, mut stream) = ws_stream.split();

    sink.send(
        serde_json::json!({
            "type": "SPECIFICATION",
                "message": {
                    "display": {
                        "width": 1920,
                        "height": 1080,
                        "frame_rate": 24,
                    },
                    "ip_addr": "0.0.0.0",
                    "device": {
                        "cpu": [
                            {
                                "name": "<>",
                                "size": 0,
                            }],
                        "gpu": [
                            {
                                "name": "<>",
                                "size": 0,
                        }]
                    }
            }
        })
        .to_string()
        .into(),
    )
    .await?;

    let (tx, mut rx) = tokio::sync::mpsc::unbounded_channel();

    tokio::spawn(async move {
        while let Some(state) = rx.recv().await {
            match state {
                ConnectionStatus::Connected(uuid, answer) => {
                    let _ = sink
                        .send(
                            serde_json::json!({
                                "type": "CONNECTION_MADE",
                                "uuid": uuid,
                                "sdp_answer": answer
                            })
                            .to_string()
                            .into(),
                        )
                        .await;
                }
                ConnectionStatus::Disconnected(uuid) => {
                    let _ = sink
                        .send(
                            serde_json::json!({
                                "type": "DISCONNECTION_MADE",
                                "uuid": uuid

                            })
                            .to_string()
                            .into(),
                        )
                        .await;
                }
                ConnectionStatus::ControlRelease(uuid) => {
                    let _ = sink
                        .send(
                            serde_json::json!({
                                "type": "CONTROL_RELEASED",
                                "uuid": uuid
                            })
                            .to_string()
                            .into(),
                        )
                        .await;
                }
                ConnectionStatus::ControlTake(uuid) => {
                    let _ = sink
                        .send(
                            serde_json::json!({
                                "type": "CONTROL_TAKEN",
                                "uuid": uuid
                            })
                            .to_string()
                            .into(),
                        )
                        .await;
                }
            }
        }
    });

    let mut conn_manager = AetherWebRTCConnectionManager::new(api, tx);

    while let Some(Ok(msg)) = stream.next().await {
        let data: serde_json::Value = serde_json::from_str(msg.to_text()?)?;
        let request_type = data["type"].as_str();
        let uuid = data["uuid"].as_str();

        if request_type.is_none() || uuid.is_none() {
            continue;
        }

        let uuid = uuid.unwrap();

        match request_type.unwrap() {
            "CONNECTION" => {
                let offer =
                    serde_json::from_str::<RTCSessionDescription>(&data["offer"].to_string());

                if offer.is_err() {
                    error!("Could not parse sdp offer from the given payload.");
                    continue;
                }

                info!("Parsed and obtained sdp offer. Now ready to start communications.");

                let _ = conn_manager.connect(offer.unwrap(), uuid.into()).await;
            }
            "CONTROL" => {
                let _ = conn_manager.change_control_to(uuid.into()).await;
            }
            "DISCONNECT" => {
                let _ = conn_manager.disconnect_peer(uuid.into()).await;
            }
            _ => {}
        }
    }

    Ok(())
}
