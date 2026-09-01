use webrtc::api::media_engine::MIME_TYPE_H264;

#[cfg(target_os = "windows")]
pub(crate) fn is_wayland() -> bool {
    false
}

#[cfg(target_os = "linux")]
pub(crate) fn is_wayland() -> bool {
    std::env::var("WAYLAND_DISPLAY").is_ok()
        || std::env::var("XDG_SESSION_TYPE").map(|s| s == "wayland").unwrap_or(false)
}

#[cfg(target_os = "windows")]
pub(crate) fn get_ffmpeg_command(codec: &str) -> Vec<String> {
    let mut args = vec![
        "-re".to_string(),
        "-f".to_string(),
        "gdigrab".to_string(),
        "-framerate".to_string(),
        "20".to_string(),
        "-draw_mouse".to_string(),
        "1".to_string(),
        "-i".to_string(),
        "desktop".to_string(),
        "-vf".to_string(),
        "scale=1280:720".to_string(),
    ];

    if codec == MIME_TYPE_H264 {
        args.extend(vec![
            "-c:v".to_string(),
            "libx264".to_string(),
            "-profile:v".to_string(),
            "baseline".to_string(),
            "-level".to_string(),
            "3.1".to_string(),
            "-preset".to_string(),
            "ultrafast".to_string(),
            "-tune".to_string(),
            "zerolatency".to_string(),
            "-pix_fmt".to_string(),
            "yuv420p".to_string(),
            "-r".to_string(),
            "20".to_string(),
            "-b:v".to_string(),
            "1500k".to_string(),
            "-g".to_string(),
            "20".to_string(),
            "-keyint_min".to_string(),
            "20".to_string(),
            "-bsf:v".to_string(),
            "h264_mp4toannexb".to_string(),
            "-f".to_string(),
            "h264".to_string(),
            "-".to_string(),
        ]);
    } else {
        args.extend(vec![
            "-c:v".to_string(),
            "vp8".to_string(),
            "-deadline".to_string(),
            "realtime".to_string(),
            "-quality".to_string(),
            "realtime".to_string(),
            "-speed".to_string(),
            "16".to_string(),
            "-cpu-used".to_string(),
            "8".to_string(),
            "-pix_fmt".to_string(),
            "yuv420p".to_string(),
            "-r".to_string(),
            "20".to_string(),
            "-b:v".to_string(),
            "1500k".to_string(),
            "-g".to_string(),
            "20".to_string(),
            "-keyint_min".to_string(),
            "20".to_string(),
            "-f".to_string(),
            "ivf".to_string(),
            "-".to_string(),
        ]);
    }

    args
}

#[cfg(target_os = "linux")]
pub(crate) fn get_ffmpeg_command(codec: &str) -> Vec<String> {
    let display = std::env::var("DISPLAY").unwrap_or_else(|_| String::from(":0"));

    let mut args = vec![
        "-re".to_string(),
        "-framerate".to_string(),
        "20".to_string(),
        "-f".to_string(),
        "x11grab".to_string(),
        "-draw_mouse".to_string(),
        "1".to_string(),
        "-i".to_string(),
        display,
        "-vf".to_string(),
        "scale=1280:720".to_string(),
    ];

    if codec == MIME_TYPE_H264 {
        args.extend(vec![
            "-c:v".to_string(),
            "libx264".to_string(),
            "-profile:v".to_string(),
            "baseline".to_string(),
            "-level".to_string(),
            "3.1".to_string(),
            "-preset".to_string(),
            "ultrafast".to_string(),
            "-tune".to_string(),
            "zerolatency".to_string(),
            "-pix_fmt".to_string(),
            "yuv420p".to_string(),
            "-r".to_string(),
            "20".to_string(),
            "-b:v".to_string(),
            "1500k".to_string(),
            "-g".to_string(),
            "20".to_string(),
            "-keyint_min".to_string(),
            "20".to_string(),
            "-bsf:v".to_string(),
            "h264_mp4toannexb".to_string(),
            "-f".to_string(),
            "h264".to_string(),
            "-".to_string(),
        ]);
    } else {
        args.extend(vec![
            "-c:v".to_string(),
            "vp8".to_string(),
            "-deadline".to_string(),
            "realtime".to_string(),
            "-quality".to_string(),
            "realtime".to_string(),
            "-speed".to_string(),
            "16".to_string(),
            "-cpu-used".to_string(),
            "8".to_string(),
            "-pix_fmt".to_string(),
            "yuv420p".to_string(),
            "-r".to_string(),
            "20".to_string(),
            "-b:v".to_string(),
            "1500k".to_string(),
            "-g".to_string(),
            "20".to_string(),
            "-keyint_min".to_string(),
            "20".to_string(),
            "-f".to_string(),
            "ivf".to_string(),
            "-".to_string(),
        ]);
    }

    args
}

#[cfg(target_os = "linux")]
pub(crate) fn get_wayland_ffmpeg_command(codec: &str) -> Vec<String> {
    let mut args = vec![
        "-re".to_string(),
        "-f".to_string(),
        "image2pipe".to_string(),
        "-vcodec".to_string(),
        "ppm".to_string(),
        "-r".to_string(),
        "20".to_string(),
        "-i".to_string(),
        "-".to_string(),
        "-vf".to_string(),
        "scale=1280:720".to_string(),
    ];

    if codec == MIME_TYPE_H264 {
        args.extend(vec![
            "-c:v".to_string(),
            "libx264".to_string(),
            "-profile:v".to_string(),
            "baseline".to_string(),
            "-level".to_string(),
            "3.1".to_string(),
            "-preset".to_string(),
            "ultrafast".to_string(),
            "-tune".to_string(),
            "zerolatency".to_string(),
            "-pix_fmt".to_string(),
            "yuv420p".to_string(),
            "-r".to_string(),
            "20".to_string(),
            "-b:v".to_string(),
            "1500k".to_string(),
            "-g".to_string(),
            "20".to_string(),
            "-keyint_min".to_string(),
            "20".to_string(),
            "-bsf:v".to_string(),
            "h264_mp4toannexb".to_string(),
            "-f".to_string(),
            "h264".to_string(),
            "-".to_string(),
        ]);
    } else {
        args.extend(vec![
            "-c:v".to_string(),
            "vp8".to_string(),
            "-deadline".to_string(),
            "realtime".to_string(),
            "-quality".to_string(),
            "realtime".to_string(),
            "-speed".to_string(),
            "16".to_string(),
            "-cpu-used".to_string(),
            "8".to_string(),
            "-pix_fmt".to_string(),
            "yuv420p".to_string(),
            "-r".to_string(),
            "20".to_string(),
            "-b:v".to_string(),
            "1500k".to_string(),
            "-g".to_string(),
            "20".to_string(),
            "-keyint_min".to_string(),
            "20".to_string(),
            "-f".to_string(),
            "ivf".to_string(),
            "-".to_string(),
        ]);
    }

    args
}
