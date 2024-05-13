function update_element_display(element, content) {
    if(content === null || content === "") {
        element.style.display = "none";
        return false;
    } else {
        element.style.display = "block";
        return true;
    }
}

// NOTE App container element
const app_container_element = document.querySelector(".wsym-app-container");

// NOTE: Update image profile
const header_image_element = document.querySelector(".wsym-header-img");
const header_image = app_container_element.getAttribute("image");
header_image_element.setAttribute("src", header_image);

    // NOTE: Update chat or group name
const header_name_element = document.querySelector(".wsym-header-name");
header_name_element.innerHTML = "<p>"+app_container_element.getAttribute("name")+"<p/>";

// NOTE: Update chat status
const header_status_element = document.querySelector(".wsym-header-status");
header_status_element.innerHTML = "<p>"+app_container_element.getAttribute("status")+"<p/>";
const messages = document.getElementsByClassName("wsym-message");

// NOTE: Get message template
const message_template = document.querySelector("#wsym-message-template");

// NOTE: Iterato over each messag and update its content
for(const message of messages) {
    // NOTE: Add template to message 
    message.appendChild(message_template.content.cloneNode(true));

    // NOTE: Update message content
    const text_content = message.getAttribute("text-content");
    const text_element = message.querySelector(".wsym-message-content");
    if(update_element_display(text_element, text_content)) {
        text_element.innerHTML = text_content;
    }

    // NOTE: Update message name
    const sender_name_content = message.getAttribute("sender-name");
    const sender_name_element = message.querySelector(".wsym-message-name");
    if(update_element_display(sender_name_element, sender_name_content)) {
        sender_name_element.innerHTML = sender_name_content;
    }

    // NOTE: Update message quote
    const quote_content = message.getAttribute("quote-content");
    const quote_content_element = message.querySelector(".wsym-message-quote-content");
    quote_content_element.innerHTML = quote_content;
    
    const quote_name = message.getAttribute("quote-name");
    const quote_name_element = message.querySelector(".wsym-message-quote-name");
    quote_name_element.innerHTML = quote_name;

    const quote_image = message.getAttribute("quote-image");
    const quote_image_element = message.querySelector(".wsym-message-quote-image");
    if(quote_image !== null) {
        quote_image_element.setAttribute("src", quote_image);
    }

    // NOTE: Update message time
    const time = message.getAttribute("time");
    const time_element = message.querySelector(".wsym-message-info").querySelector(".wsym-message-time");
    time_element.innerHTML = time;

    // NOTE: Update Image content
    const image_content = message.getAttribute("image-content");
    const image_container_element = message.querySelector(".wsym-message-image-container");
    const image_element = message.querySelector(".wsym-message-image");
    if(update_element_display(image_container_element, image_content)) {
        image_element.setAttribute("src", image_content);
    }

    // NOTE: Update Video content
    const video_content = message.getAttribute("video-content");
    const video_container_element = message.querySelector(".wsym-message-video-container");
    const video_element = message.querySelector(".wsym-message-video");
    if(update_element_display(video_container_element, video_content)) {
        video_element.setAttribute("src", video_content);
    }

    // NOTE: Update time when message have an image and not text
    const message_image = message.getAttribute("image-content");
    // NOTE: Modify position of the message time and check if the image has no message content
    {
        if(text_content !== null) {
            // NOTE: Update Image info content
            const message_info = message.querySelector(".wsym-message-info-image");
            message_info.style.display = "none";
        } else {
            if(message_image) {
                const message_info = message.querySelector(".wsym-message-info");
                message_info.style.display = "none";
    
                // NOTE: Update Image info content
                const time = message.getAttribute("time");
                const time_element = message.querySelector(".wsym-message-info-image").querySelector(".wsym-message-time");
                time_element.innerHTML = time;
                
            }
        }
    }

}
