//elements
var login = getElementById("login");

login.onClick = function () {
    fetch("http://10.101.110.181:300/login")
        .then(response => response.json())
        .then(data => )
};