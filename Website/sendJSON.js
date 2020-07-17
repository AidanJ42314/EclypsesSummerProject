function sendJSON(json, url) {

    // Creating a XHR object 
    let xhr = new XMLHttpRequest();

    // open a connection 
    xhr.open("POST", url, true);

    // Set the request header i.e. which type of content you are sending 
    xhr.setRequestHeader("Content-Type", "application/json");

    // Create a state change callback 
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("success");
        }
    };

    // Converting JSON data to string 
    var data = JSON.stringify(json);

    // Sending data with the request 
    xhr.send(data);
} 