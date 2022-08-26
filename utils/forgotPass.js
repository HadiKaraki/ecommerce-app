document.getElementById("submitButton").addEventListener("click", sendEmail);

function alert() {
    document.getElementById("alert").style.display = "block";
}

function sendEmail(e) {
    var emailInput = document.getElementById("emailInput");
    var submitButton = document.getElementById('submitButton');
    e.preventDefault();
    var params = "email=" + emailInput.value;
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/user/forgotpassword', true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onload = function() {
        console.log(this.responseText);
    }

    xhttp.send(params);
    document.getElementById("emailInput").value = "";
    alert()
}