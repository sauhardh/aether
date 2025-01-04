#[macro_use]
extern crate rocket;
mod conn;

use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::serde::json::Json;
use rocket::{Request, Response};
use rocket_dyn_templates::Template;
use serde::{Deserialize, Serialize};

fn default_server_addr() -> String {
    "ws://127.0.0.1:7878".into()
}

#[derive(Serialize, Deserialize)]
struct NegotiationOffer {
    token: String,

    #[serde(default = "default_server_addr")]
    server_addr: String,
}

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, GET, PATCH, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

#[post("/negotiate-server", format = "json", data = "<token>")]
async fn server_negotiation_request(token: Json<NegotiationOffer>) {
    tokio::spawn(conn::ws::start_server_connection(
        token.server_addr.clone(),
        token.token.clone(),
    ));
}

#[options("/<_..>")]
fn all_options() {}

#[launch]
fn rocket() -> _ {
    let app = rocket::build();

    app.mount("/", routes![all_options, server_negotiation_request])
        .attach(CORS)
        .attach(Template::fairing())
}
