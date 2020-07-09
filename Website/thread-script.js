
//adds any threads in the input to the webpage
var pushToPage = function () {
    //add code here
}

//update the messages every so often
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