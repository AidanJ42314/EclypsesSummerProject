//actually, I don't think we even need a script here

//elements
//var login = getElementById("login");
//var error = getElementById("error");


/*


//This function doesn't work
login.onClick = function () {
    //when the button is clicked, try to login
    fetch("http://10.101.110.181:3001/login")
        //convert the response to a json
        .then(response => response.json())
        .then(data => {
            //add the proper cookies
            document.cookie = "userid=" + data.userid;
            document.cookie = "token=" + data.token;
            //redirect the user to a the proper page
            window.location.href = "https://10.101.110.181:3001/chat/" + data.userid
        })
        .catch(function () { error.innerHTML = "Error logging in"})
};*/