const validateName = (name) => {
    if (!name) return false;
    const trimmedName = name.trim();

    const onlyLetters = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
    if (!onlyLetters.test(trimmedName)) return false;

    const parts = trimmedName.split(" ").filter(part => part.length>0) /* esto lo pongo por si llegara a ser el caso de que se el usuario pone dos espacios */

    if (parts.length === 0) return false;
    const enoughParts = parts.length >= 2; /* que se componga de Nombre y Apellido */
    
    const longEnough = parts.every(part => part.length >= 3); /* cada parte del nombre tiene minimo 3 letras */

    return enoughParts && longEnough;
};

const validateEmail = (email) => {
    if (!email) return false;
    const trimmedEmail = email.trim();

    const emailRegex = /^[^\s@]+@([a-zA-Z0-9-]+\.)*uchile\.cl$/;  /*Asumo que todos los correos institucionales terminan con uchile.cl*/

    const formatValid = emailRegex.test(trimmedEmail);

    return formatValid;
};

const validateType = (type) => {
    return type !== "";
};

const validatePhone = (phone) => {
    if (!phone) return false;
    const trimmedPhone = phone.trim();

    const phoneRegex = /^9[0-9]{8}$/;

    return phoneRegex.test(trimmedPhone);
};

const validateUsername = (username) => {
    if (!username) return false;
    const trimmedUser = username.trim();

    const longEnough = trimmedUser.length >= 3;

    const noSpaces = !trimmedUser.includes(" ");

    return longEnough && noSpaces;
};

const validatePassword = (password) => {
    if (!password) return false;

    const longEnough = password.length >= 8;

    const hasNumber = /[0-9]/.test(password);

    const hasUpper = /[A-Z]/.test(password);

    const hasLower = /[a-z]/.test(password);

    const hasSymbol = /[.#*@$%&]/.test(password);

    return longEnough && hasLower && hasUpper && hasNumber && hasSymbol;
};

const toggleError = (id, isValid) => {
    const error = document.getElementById(id);
    if (isValid) {
        error.classList.remove("visible");
    } else {
        error.classList.add("visible");
    }
};

const validateForm = () => {
    const name = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const type = document.getElementById("tipo-actividad").value;
    const phone = document.getElementById("phone").value;
    const user = document.getElementById("username").value;
    const pwd = document.getElementById("contrasena").value;

    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isTypeValid = validateType(type);
    const isPhoneValid = validatePhone(phone);
    const isUserValid = validateUsername(user);
    const isPasswordValid = validatePassword(pwd);

    toggleError("error-full-name", isNameValid);
    toggleError("error-email", isEmailValid);
    toggleError("error-tipo-miembro", isTypeValid);
    toggleError("error-phone", isPhoneValid);
    toggleError("error-nombre", isUserValid);
    toggleError("error-contrasena", isPasswordValid);

    return isNameValid && isEmailValid && isTypeValid && isPhoneValid && isUserValid && isPasswordValid;
};

const formulario = document.getElementById("login-form");
formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Validando datos...");
    
    if (validateForm()) {
        console.log("Formulario enviado exitosamente.");
        window.location.href = "main.html";
    } else {
        console.warn("Envio fallido: existen errores en el formulario.")
    }
});