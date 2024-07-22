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

	// Validate Address
    $("#addressCheck").hide();
	var addressError = true;
	$("#address").keyup(function () {
		validateAddress();
	});
    
	function validateAddress() {
		const address = document.getElementById('address')
		let addressValue = $("#address").val();
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

        // Validate phone
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
        validatePhoneNumber();
        let form = document.getElementById('signup-form')
		if (
            firstNameError == true &&
            lastNameError == true &&
			usernameError == true &&
			passwordError == true &&
			emailError == true &&
            ageError == true &&
            phoneNumberError == true
		) {
            form.submit();
		} else {
        }
	});
});
