var editButton = document.getElementById("edit-button")
var closeEditButton = document.getElementById("close-edit")
var inputsDiv = document.querySelectorAll('#checkbox-input');
var inputs = document.querySelectorAll("input.check-product");
var removeButton = document.getElementById("remove-button");

document.getElementById("edit-button").addEventListener("click", showButton);
document.getElementById("close-edit").addEventListener("click", disableButton);
for (let inputDiv of inputsDiv) {
    inputDiv.addEventListener("change", enableButton);
}

function showButton() {
    removeButton.style.display = "block";
    for (let inputDiv of inputsDiv) {
        inputDiv.style.display = "block";
    }
    editButton.style.display = "none";
    closeEditButton.style.display = "block";
}

function enableButton() {
    for (let input of inputs) {
        if (input.checked) {
            removeButton.disabled = false;
            removeButton.style.backgroundColor = "red"
            break;
        } else {
            removeButton.disabled = true;
            removeButton.style.backgroundColor = "lightgrey"
        }
    }
}

function disableButton() {
    removeButton.style.display = "none";
    editButton.style.display = "block";
    closeEditButton.style.display = "none";
    for (let inputDiv of inputsDiv) {
        inputDiv.style.display = "none";
    }
}