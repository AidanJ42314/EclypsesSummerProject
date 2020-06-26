//elements
var pass = document.getElementById("pass");
var pass_conf = document.getElementById("pass_conf");
var pass_match = document.getElementById("pass_match");
var submit_button = document.getElementById("submit_button");
var tosbox = document.getElementById("tosbox");
var toscheck = document.getElementById("toscheck");

//disable the submit button initially
submit_button.disabled = true;

//function that updates the submit button
var update_sub_button = function () {
    submit_button.disabled = !(pass_match.innerHTML == "OK" && tosbox.checked);
};

//any time there is a keypress, see if we need to update the password match thing and the submit button
document.addEventListener("keyup", function (e) {
    if (pass.value.length < 6) {
        pass_match.innerHTML = "Password is not long enough";
        pass_match.style.color = "red";
        return;
    }

    if (pass_conf.value) {
        if (pass.value != pass_conf.value) {
            pass_match.innerHTML = "Passwords do not match";
            pass_match.style.color = "red";
        } else {
            pass_match.innerHTML = "OK";
            pass_match.style.color = "green";
        }
    } else {
        pass_match.innerHTML = "";
    }
    update_sub_button();
});

//any time the mouse clicks, update the submit button
document.addEventListener("click", function (e) {
    update_sub_button();
})