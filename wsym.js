//////////////////////////////////////////////////////////////
// Full screen Browser API

function element_request_fullscreen_old(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
}

function register_on_screen_change_event(element, callback) {
    element.addEventListener("fullscreenchange", callback);
    element.addEventListener("mozfullscreenchange", callback);
    element.addEventListener("webkitfullscreenchange", callback);
    element.addEventListener("msfullscreenchange", callback);
}

function element_fullscreen_change(event) {
    const element = event.target;

    if(document.fullscreenElement ||
       document.webkitFullscreenElement ||
       document.mozFullScreenElement ||
       document.msFullscreenElement) {

        // NOTE: element enters full screen
        element.style.objectFit = "contain"
    } else {
        // NOTE: element leave full screen
        element.style.objectFit = "cover"
    }

}

//////////////////////////////////////////////////////////////
// Full screen using modal

const fullscreen_element = document.querySelector(".wsym-fullscreen-container");
const fullscreen_image = fullscreen_element.querySelector("img");
const fullscreen_video = fullscreen_element.querySelector("video");
const fullscreen_content = fullscreen_element.querySelector(".wsym-fullscreen-container-footer");
const fullscreen_name = fullscreen_element.querySelector(".wsym-fullscreen-name");
const fullscreen_time = fullscreen_element.querySelector(".wsym-fullscreen-time");;

function element_request_fullscreen(element, message) {
    
    // NOTE: display fullscreen modal
    fullscreen_element.style.display = "block";
    
    let content = null;
    let multimidia_element = null;

    // NOTE: display image or video
    if(element.nodeName === "IMG") {
        content = message.getAttribute("image-content");
        fullscreen_image.style.display = "block";
        fullscreen_video.style.display = "none";
        multimidia_element = fullscreen_image;
    } else if(element.nodeName === "VIDEO") {
        fullscreen_image.style.display = "none";
        fullscreen_video.style.display = "block";
        content = message.getAttribute("video-content");
        multimidia_element = fullscreen_video;
    } else {
        console.log("Cannot fullscreen element: " + element.nodeName);
        return;
    }
    multimidia_element.setAttribute("src", content);

    // NOTE: update message content
    const text_content = message.getAttribute("text-content");
    if(text_content !== null) {
        fullscreen_content.innerHTML = "<p>"+text_content+"</p>";
    } else {
        fullscreen_content.innerHTML = null;
    }

    // NOTE: update message time
    const time = message.getAttribute("time");
    fullscreen_time.innerHTML = time;

    // NOTE: update message name
    const name = document.querySelector(".wsym-app-container").getAttribute("name");
    fullscreen_name.innerHTML = "Tú";
}

function update_element_display(element, content, display) {
    if(element === null) return;

    if(content === null || content === "") {
        element.style.display = "none";
        return false;
    } else {
        element.style.display = display;
        return true;
    }
}


//////////////////////////////////////////////////////////////
// Audio functions

function audio_duration_to_html(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return minutes+":"+returnedSeconds;
}

let play_state = "pause";

//////////////////////////////////////////////////////////////
// Generate messages

let color_index = 0;
const sender_name_map = {};

function register_new_color(name) {


    const app_container_element = document.querySelector(".wsym-app-container");
    const theme = app_container_element.getAttribute("theme");
    
    let colors = null;

    if(theme === "light") {
        colors = ["#D6C52F", "#20990E", "#DB1105", "#CE1761", "#0B390B", "#AB37C3", "#9F99A3", "#504857", "#3E8A7E"];
    } else {
        colors = ["#EEE938", "#FC87C0", "#49CB26", "#B3E5A6", "#FB7874", "#F183FD", "#FDBFD8", "#CAC4D2", "#84DACB"];
    }

    color = colors[color_index];
    sender_name_map[name] = color;
    color_index = (color_index + 1) % colors.length;

    return color;
}

function update_quote_name_color(quote_name_element, quote_color, quote_name) {

    if(quote_name === null) return
    let color = sender_name_map[quote_name];


    if(color === undefined) {
        color = register_new_color(quote_name)
    }

    quote_name_element.style.color = color;
    quote_color.style.backgroundColor = color
}


function arrow_was_click() {
    if(fullscreen_video.style.display === "block") {
        fullscreen_video.pause();
    }

    // NOTE: only close the modal if we have a full screen element
    if(fullscreen_element.style.display === "block") {
        fullscreen_element.style.display = "none"
    }
}

function generate_header(app_container_element) {
    // NOTE: Update time or company
    const time_or_company_element = document.querySelector(".wsym-header-time");
    time_or_company_element.innerHTML = "<p>"+app_container_element.getAttribute("time-or-company")+"</p>";

    // NOTE: Update image profile
    const header_image_element = document.querySelector(".wsym-header-img");
    const header_image = app_container_element.getAttribute("image");
    header_image_element.setAttribute("src", header_image);

        // NOTE: Update chat or group name
    const header_name_element = document.querySelector(".wsym-header-name");
    header_name_element.innerHTML = "<p>"+app_container_element.getAttribute("name")+"</p>";

    // NOTE: Update chat status
    const header_status_element = document.querySelector(".wsym-header-status");
    header_status_element.innerHTML = "<p>"+app_container_element.getAttribute("status")+"</p>";
}

function set_video_poster(poster_element, video) {
    video.addEventListener('loadedmetadata', function(event) {
        video.currentTime = 0.1;
        video.addEventListener('seeked', function() {
            if(video.generate_thumbnail == true) {
                var canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                var context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                var dataURL = canvas.toDataURL();
                poster_element.setAttribute('src', dataURL);
                video.currentTime = 0;
                video.generate_thumbnail = false;
            }

        });
    });
    
}

function update_element_top_and_bottom_margin(element, message) {
    // NOTE: Update element top margin
    const forwarded = message.getAttribute("forwarded");
    const sender_name = message.getAttribute("sender-name");
    if(sender_name !== null || (forwarded === null || forwarded === false)) {
        element.style.marginTop = 0;
    }

    const text_content = message.getAttribute("text-content");
    console.log(text_content);
    if(text_content !== null) {
       element.style.marginBottom = 0;
    }
    
}

function update_element_display(element, content, display) {
    if(element === null) return;

    if(content === null || content === "") {
        element.style.display = "none";
        return false;
    } else {
        element.style.display = display;
        return true;
    }
}

function update_quote(message) {
    const quote_content = message.getAttribute("quote-content");
    const quote_element = message.querySelector(".wsym-message-quote");

    if(update_element_display(quote_element, quote_content, "flex")) {
        const quote_content_element = message.querySelector(".wsym-message-quote-content");
        quote_content_element.innerHTML = quote_content;
    
        const quote_name = message.getAttribute("quote-name");
        const quote_name_element = message.querySelector(".wsym-message-quote-name");
        quote_name_element.innerHTML = quote_name;
        const quote_color = message.querySelector(".wsym-message-quote-color")
        update_quote_name_color(quote_name_element, quote_color, quote_name);
        
        const quote_image = message.getAttribute("quote-image");
        const quote_image_element = message.querySelector(".wsym-message-quote-image");
        if(quote_image !== null) {
            quote_image_element.setAttribute("src", quote_image);
        }
    
    
        update_element_top_and_bottom_margin(quote_element, message);
    }

}

function update_sender_image(message) {
    const sender_image_content = message.getAttribute("sender-image");
    const sender_image_element = message.querySelector(".wsym-message-sender-image");
    if(update_element_display(sender_image_element, sender_image_content, "block")) {
        sender_image_element.setAttribute("src", sender_image_content);

        // NOTE: Check if the message has tail, if not hide the image
        const tail = message.getAttribute("tail");
        if(tail === "false") {
            sender_image_element.style.visibility = "hidden";
        }
    }
}

function update_text_content(message) {
    const text_content = message.getAttribute("text-content");
    const text_element = message.querySelector(".wsym-message-content");
    if(update_element_display(text_element, text_content, "block")) {
        text_element.innerHTML = "<p>"+text_content+"</p>";
    }
}

function update_sender_name_color(name_element, name) {
    let color = sender_name_map[name]
    if(color === undefined) {
        color = register_new_color(name)
    }
    name_element.style.color = color;
}

function update_message_sender_name(message) {
    // NOTE: Update message name
    const sender_name_content = message.getAttribute("sender-name");
    const sender_name_element = message.querySelector(".wsym-message-name");
    if(update_element_display(sender_name_element, sender_name_content, "block")) {
        sender_name_element.innerHTML = sender_name_content;
        update_sender_name_color(sender_name_element, sender_name_content);
    }
}

function update_time_when_message_is_image_or_video_only(message) {
    // NOTE: Update time when message have an image and not text
    const message_image = message.getAttribute("image-content");
    const message_video = message.getAttribute("video-content");
   
    let container = null;
    if(message_image !== null) {
        container = message.querySelector(".wsym-message-image-container");
    } else if(message_video !== null) {
        container = message.querySelector(".wsym-message-video-container");
    } else {
        return;
    }
    // NOTE: Modify position of the message time and check if the image has no message content
    const text_content = message.getAttribute("text-content");
    if(text_content !== null) {
        const message_info = container.querySelector(".wsym-message-info-image");
        message_info.style.display = "none";
    } else {
        const message_info = message.querySelector(".wsym-message-info");
        message_info.style.display = "none";

        // NOTE: Update Image info content
        const time = message.getAttribute("time");
        const time_element = container.querySelector(".wsym-message-info-image").querySelector(".wsym-message-time");
        time_element.innerHTML = time;
    }
}

function update_time(message) {
    const time = message.getAttribute("time");
    const time_element = message.querySelector(".wsym-message-info").querySelector(".wsym-message-time");
    time_element.innerHTML = time;
    update_time_when_message_is_image_or_video_only(message);

}

function update_image(message) {

    const image_content = message.getAttribute("image-content");
    const image_container_element = message.querySelector(".wsym-message-image-container");
    const image_element = message.querySelector(".wsym-message-image");
    if(update_element_display(image_container_element, image_content, "block")) {
        image_element.setAttribute("src", image_content);
        image_element.onclick = function() {
            element_request_fullscreen(image_element, message);
        }
        update_element_top_and_bottom_margin(image_container_element, message);
    }

    
}

function update_video(message) {

    const video_content = message.getAttribute("video-content");
    const video_container_element = message.querySelector(".wsym-message-video-container");
    const poster_element = message.querySelector(".wsym-message-video");
    if(update_element_display(video_container_element, video_content, "block")) {
        
        const video_element = document.createElement("video");
        video_element.generate_thumbnail = true;
        video_element.setAttribute("preload", "metadata");
        video_element.setAttribute("playsinline", "playsinline");
        video_element.setAttribute("webkit-playsinline", "webkit-playsinline");
        video_element.setAttribute("src", video_content);
        
        set_video_poster(poster_element, video_element);
        
        poster_element.onclick = function() {
            element_request_fullscreen(video_element, message);
            fullscreen_video.play()
        }
        
        // NOTE: Update Video button
        const button = video_container_element.querySelector("button");
        if(button !== null) {
            button.onclick = function() {
                element_request_fullscreen(video_element, message);
                fullscreen_video.play()
            }
        }
        
        update_element_top_and_bottom_margin(video_container_element, message);
    }
}

function update_audio(message) {

    const audio_content = message.getAttribute("audio-content");
    const audio_container_element = message.querySelector(".wsym-message-audio-container");
    const audio_element = message.querySelector(".wsym-message-audio");
    if(update_element_display(audio_container_element, audio_content, "flex")) {
        audio_element.setAttribute("src", audio_content);
        
        // NOTE: Update audio metadata
        const duration = audio_container_element.querySelector("p");
        const slider = audio_container_element.querySelector("input");
        const button = audio_container_element.querySelector("button");

        audio_element.addEventListener("loadedmetadata", function() {
            duration.innerHTML = audio_duration_to_html(audio_element.duration);
            slider.max = audio_element.duration*100;
        })

        // NOTE: Manage audio events
        slider.addEventListener("change", function() {
            audio_element.currentTime = slider.value / 100;
        });

        audio_element.addEventListener("timeupdate", function() {
            slider.value = audio_element.currentTime*100;
        });

        button.addEventListener("click", function() {
            const play_button = button.querySelector(".wsym-message-audio-play");
            const pause_button = button.querySelector(".wsym-message-audio-pause");

            if(play_state === "pause") {
                audio_element.play();
                play_state = "play";
                pause_button.style.display = "block";
                play_button.style.display = "none";
            } else {
                audio_element.pause();
                play_state = "pause";
                pause_button.style.display = "none";
                play_button.style.display = "block";
            }
        });

        audio_element.addEventListener('ended', function() {
            const play_button = button.querySelector(".wsym-message-audio-play");
            const pause_button = button.querySelector(".wsym-message-audio-pause");

            play_state = "pause"
            pause_button.style.display = "none";
            play_button.style.display = "block";
            slider.value = 0;
        });

    }
}

function update_sticker(message) {
    const sticker_content = message.getAttribute("sticker-content");
    const sticker_element = message.querySelector(".wsym-message-sticker");
    if(update_element_display(sticker_element, sticker_content)) {
        sticker_element.setAttribute("src", sticker_content);
    }
}

function generate_mesage(template, message) {
    // NOTE: Add template to message 
    message.appendChild(template.content.cloneNode(true));

    update_sender_image(message);
    update_text_content(message);
    update_message_sender_name(message);
    update_quote(message);
    update_image(message);
    update_video(message);
    update_audio(message);
    update_sticker(message);
    update_time(message);
}

// NOTE App container element
const app_container_element = document.querySelector(".wsym-app-container");
generate_header(app_container_element);

// NOTE: Update messagebox wallpaper
const background_content = app_container_element.getAttribute("background");
if(background_content !== null) {
    const message_box = app_container_element.querySelector(".wsym-message-box");
    message_box.style.backgroundImage = "url("+background_content+")";
}

// NOTE: Get message template
const message_template = document.querySelector("#wsym-message-template");

// NOTE: Iterato over each messag and update its content
const messages = document.getElementsByClassName("wsym-message");
for(const message of messages) {
    generate_mesage(message_template, message)
}
