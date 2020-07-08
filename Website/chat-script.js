//elements
var messages = document.getElementById("messages");

//adds any messages in the input to the webpage
var pushToPage = function () {
    //add code here
}

//update the messages every so often
var update = function () {
    //get the current userid from cookies and put it here
    var userid = 0;

    //get the current threadid from cookies and put it here
    var threadid = 0;

    //fetch any new messages
    fetch("http://10.101.110.181:3001/chat/" + userid + "/" + threadid + "/messages")
        .then(response => response.json())
        .then(data => {
            if (data.messages) {
                pushToPage(data.messages);
            }
        })

    //wait 3 seconds and do it again
    setTimeout(update(), 3000);
}
update();