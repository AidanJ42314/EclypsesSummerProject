//elements
var messages = document.getElementById("messages");
var sub_btn = document.getElementById("sub_btn");
var msg = document.getElementById("msg");

//adds any messages in the input to the webpage
var pushToPage = function (messages) {
    messages.innerHTML = "";
    //add code here
    for (var i = 0; i < messages.length; i++) {
        let mhtml = "<div class=\"sample-message\">\n<div class=\"msg-header\" role=\"document\">\n<h2 class=\"username\">\n<span class=\"username\" role=\"button\">" + messages[i].senderid + "</span>\n</h2>\n</div>\n<div class=\"msg-content\">\n" + messages[i].contents + "\n</div>\n</div>";

        messages.innerHTML += mhtml;
    }
}

//update the messages every so often
var update = function () {
    //fetch any new messages
    fetch("http://10.101.110.181:3001/messages")
        .then(response => response.json())
        .then(data => {
            if (data.messages) {
                pushToPage(data.messages.reverse());
            }
        })
}

//send a message
sub_btn.addEventListener("click", function () {
    fetch(location.href, JSON.stringify({
        method: "post",
        body: {"contents": msg.value}
    }))
    msg.value = "";
})

setInterval(update, 3000);