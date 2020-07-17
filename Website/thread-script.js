//elements
var usersDOC = document.getElementById("users");
var userbox = document.getElementById("userbox");

//adds any threads in the input to the webpage
var pushToPage = function (threads) {
    //add code here
    for (var i = 0; i < threads.length; i++) {
        let thtml = "<a href=\"" + location.href + "/" + threads[i].threadid>"\">" + threads[i].name + "</a>\n";

        messages.innerHTML += thtml;
    }
}

//get the threads
var update = function () {
    //fetch any new messages
    fetch("http://10.101.110.181:3001/threads")
        .then(response => response.json())
        .then(data => {
            if (data.threads) {
                pushToPage(data.threads);
            }
        })
}

update();

//add a user to the new thread list
var users = [];
var addUser = function () {
    users.push(userbox.value);
    value = "";
    usersDOC.innerHTML = "Users:";
    for (var i = 0; i < users.length; i++) {
        usersDOC.innerHTML += users[i] + "\n";
    }
}

//create a thread with the selected users
var newThread = function () {
    fetch("http://10.101.110.181:3001/threads", {
        method: "post",
        body: {
            members: users
        }
    })
}