$(document).ready(function () {

    // Validate Name
    $("#NameCheck").hide();
	var NameError = true;
	$("#name").keyup(function () {
		validateName();
	});
    
	function validateName() {
		const Name = document.getElementById('name')
		let NameValue = $("#name").val();
        console.log(NameValue)
		if (NameValue.length == "") {
			$("#NameCheck").show();
			Name.classList.add('is-invalid')
			NameError = false;
			return false;
		} else {
			$("#NameCheck").hide();
			Name.classList.remove('is-invalid')
            NameError = true;
		}
	}

    // Validate brand
    $("#brandCheck").hide();
	var brandError = true;
	$("#brand").keyup(function () {
		validateBrand();
	});
    
	function validateBrand() {
		const brand = document.getElementById('brand')
		let brandValue = $("#brand").val();
        console.log(brand)
		if (brandValue.length == "") {
			$("#brandCheck").show();
			brand.classList.add('is-invalid')
			brandError = false;
			return false;
		} else {
			$("#brandCheck").hide();
			brand.classList.remove('is-invalid')
            brandError = true;
		}
	}

	// Validate price
    $("#priceCheck").hide();
	var priceError = true;
	$("#price").keyup(function () {
		validatePrice();
	});
    
	function validatePrice() {
		const price = document.getElementById('price')
		let priceValue = $("#price").val();
        console.log(priceValue)
		if (priceValue.length == "") {
			$("#priceCheck").show();
			price.classList.add('is-invalid')
			priceError = false;
			return false;
		} else {
			$("#priceCheck").hide();
			price.classList.remove('is-invalid')
            priceError = true;
		}
	}

    // Validate description
    $("#descriptionCheck").hide();
	var descriptionError = true;
	$("#description").keyup(function () {
		validateDescription();
	});
    
	function validateDescription() {
		const description = document.getElementById('description')
		let descriptionValue = $("#description").val();
        console.log(descriptionValue)
		if (descriptionValue.length == "") {
			$("#descriptionCheck").show();
			description.classList.add('is-invalid')
			descriptionError = false;
			return false;
		} else {
			$("#descriptionCheck").hide();
			description.classList.remove('is-invalid')
            descriptionError = true;
		}
	}

    // Validate code
    $("#codeCheck").hide();
	var codeError = true;
	$("#code").keyup(function () {
		validateCode();
	});
    
	function validateCode() {
		const code = document.getElementById('code')
		let codeValue = $("#code").val();
        console.log(codeValue)
		if (codeValue.length == "") {
			$("#codeCheck").show();
			code.classList.add('is-invalid')
			codeError = false;
			return false;
		} else {
			$("#codeCheck").hide();
			code.classList.remove('is-invalid')
            codeError = true;
		}
	}

        // Validate nb in stock
        $("#nbInStockCheck").hide();
        var nbInStockError = true;
        $("#nbInStock").keyup(function () {
            validateNbInStock();
        });
        
        function validateNbInStock() {
			const nbInStock = document.getElementById('nbInStock')
            let nbInStockValue = $("#nbInStock").val();
            console.log(nbInStockValue)
            var numberRegex = /^[0-9]+$/;
            var test = numberRegex.test(nbInStockValue);
            if (!test) {
                $("#nbInStockCheck").show();
				nbInStock.classList.add('is-invalid')
                nbInStockError = false;
                return false;
            } else {
                $("#nbInStockCheck").hide();
				nbInStock.classList.remove('is-invalid')
                nbInStockError = true;
            }
        }

	// Submit button
	$("#submitbtn").click(function () {
        validateName();
        validateBrand();
        validatePrice();
        validateDescription();
        validateCode();
        validateNbInStock();
        let form = document.getElementById('signup-form')
		if (
            NameError == true &&
            brandError == true &&
			priceError == true &&
			descriptionError == true
		) {
            form.submit();
		} else {
        }
	});
});
