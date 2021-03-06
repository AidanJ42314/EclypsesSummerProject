//elements
var usersDOC = document.getElementById("users");
var userbox = document.getElementById("userbox");
var threadsDOC = document.getElementById("threads")

//adds any threads in the input to the webpage
var pushToPage = function (threads) {
    //add code here
    var end = ""
    for (var i = 0; i < threads.length; i++) {
        let thtml = "<a href=\"" + location.href + "/" + threads[i].threadid>"\">" + threads[i].name + "</a>\n";
        end += thtml;
    }
    threadsDOC.innerHTML = end;
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

var updateList = function () {
    usersDOC.innerHTML = "Users:";
    for (var i = 0; i < users.length; i++) {
        usersDOC.innerHTML += "\n" + users[i];
    }
}

//add a user to the new thread list
var users = [];
var addUser = function () {
    users.push(userbox.value);
    userbox.value = "";
    updateList();
}

//create a thread with the selected users
var newThread = function () {
    sendJSON({ members: users }, "http://10.101.110.181:3001/threads");
}