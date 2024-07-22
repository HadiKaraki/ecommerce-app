$(document).ready(function () {

	// Validate Username
	$("#usercheck").hide();
	var usernameError = true;
	$("#username").keyup(function () {
		validateUsername();
	});
    
	function validateUsername() {
		const username = document.getElementById('username')
		let usernameValue = $("#username").val();
		if (usernameValue.length == "") {
			$("#usercheck").show();
			username.classList.add('is-invalid')
			usernameError = false;
			return false;
		} else if (usernameValue.length < 3 || usernameValue.length > 10) {
			$("#usercheck").show();
			$("#usercheck").html("**length of username must be between 3 and 10");
			usernameError = false;
			return false;
		} else {
			$("#usercheck").hide();
			username.classList.remove('is-invalid')
            usernameError = true;
		}
	}

	// Validate Password
	$("#passcheck").hide();
	var passwordError = true;
	$("#password").keyup(function () {
		validatePassword();
	});
	function validatePassword() {
		const password = document.getElementById('password')
		let passwordValue = $("#password").val();
		if (passwordValue.length == "") {
			$("#passcheck").show();
			password.classList.add('is-invalid')
			passwordError = false;
			return false;
		} else if (passwordValue.length < 3 || passwordValue.length > 10) {
            $("#passcheck").html(
				"**length of your password must be between 3 and 10"
			);
			$("#passcheck").show();
			$("#passcheck").css("color", "red");
			passwordError = false;
			return false;
		} else {
			$("#passcheck").hide();
			password.classList.remove('is-invalid')
            passwordError = true;
		}
	}

	// Submit button
	$("#submitButton").click(function () {
        validatePassword();
		validateUsername();
        let form = document.getElementById('login-form')
		if (
            usernameError == true &&
			passwordError == true
		) {
            form.submit();
		} else {
        }
	});
});