$(document).ready(function () {

    // Validate First Name
    $("#firstNameCheck").hide();
	var firstNameError = true;
	$("#first-name").keyup(function () {
		validateFirstName();
	});
    
	function validateFirstName() {
		const firstName = document.getElementById('first-name')
		let firstNameValue = $("#first-name").val();
		if (firstNameValue.length == "") {
			$("#firstNameCheck").show();
			firstName.classList.add('is-invalid')
			firstNameError = false;
			return false;
		} else {
			$("#firstNameCheck").hide();
			firstName.classList.remove('is-invalid')
            firstNameError = true;
		}
	}

    // Validate Last Name
    $("#lastNameCheck").hide();
	var lastNameError = true;
	$("#last-name").keyup(function () {
		validateLastName();
	});
    
	function validateLastName() {
		const lastName = document.getElementById('last-name')
		let lastNameValue = $("#last-name").val();
		if (lastNameValue.length == "") {
			$("#lastNameCheck").show();
			lastName.classList.add('is-invalid')
			lastNameError = false;
			return false;
		} else {
			$("#lastNameCheck").hide();
			lastName.classList.remove('is-invalid')
            lastNameError = true;
		}
	}

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
			let regex = /^[^$#@!%^&*()\[\]{}:"'<>\?]*$/;
			let s = username.value;
			if (regex.test(s)) {
				username.classList.remove("is-invalid");
				$("#usercheck").hide();
				username.classList.remove('is-invalid')
				usernameError = true;
				return true;
			} else {
				username.classList.add("is-invalid");
				usernameError = false;
				return false;
			}
		}
	}

	// Validate Email
    $("#emailCheck").hide();
    var emailError = true;
    $("#email").keyup(function () {
        validateEmail();
    });
    
    function validateEmail() {
        let emailValue = $("#email").val();
        if (emailValue.length == "") {
            $("#emailCheck").show();
            emailError = false;
            return false;
        } else {
			$("#emailCheck").hide();
			let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
			let s = email.value;
			if (regex.test(s)) {
				email.classList.remove("is-invalid");
				emailError = true;
				return true;
			} else {
				email.classList.add("is-invalid");
				emailError = false;
				return true;
			}
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

		// Validate address
	$("#addressCheck").hide();
	var addressError = true;
	$("#address").keyup(function () {
		validateAddress();
	});
	
	function validateAddress() {
		const address = document.getElementById('address')
		let addressValue = $("#phone-nb").val();
		if (addressValue.length == "") {
			$("#addressCheck").show();
			address.classList.add('is-invalid')
			addressError = false;
			return false;
		} else {
			$("#addressCheck").hide();
			address.classList.remove('is-invalid')
			addressError = true;
		}
	}

        // Validate Phone
        $("#phoneNumberCheck").hide();
        var ageError = true;
        $("#phone-nb").keyup(function () {
            validatePhoneNumber();
        });
        
        function validatePhoneNumber() {
			const phoneNumber = document.getElementById('phone-nb')
            let phoneNumberValue = $("#phone-nb").val();
            if (phoneNumberValue.length == "") {
                $("#phoneNumberCheck").show();
				phoneNumber.classList.add('is-invalid')
                phoneNumberError = false;
                return false;
            } else {
                $("#phoneNumberCheck").hide();
				phoneNumber.classList.remove('is-invalid')
                phoneNumberError = true;
            }
        }

	// Submit button
	$("#submitbtn").click(function () {
        validateFirstName();
        validateLastName();
		validateUsername();
		validatePassword();
        validateEmail();
        validateAddress();
        validatePhoneNumber();
        let form = document.getElementById('signup-form')
		if (
            firstNameError == true &&
            lastNameError == true &&
			usernameError == true &&
			passwordError == true &&
			emailError == true &&
            addressError == true &&
            phoneNumberError == true
		) {
            form.submit();
		} else {
        }
	});
});
