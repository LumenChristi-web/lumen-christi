document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  // Initialize intl-tel-input on the phone field
  const phoneInputField = document.querySelector("#phone");
  let iti;

  if (phoneInputField) {
    iti = window.intlTelInput(phoneInputField, {
      initialCountry: "us", // Default country
      preferredCountries: ["us", "gb", "ng"], // Example favorites
      utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.12/build/js/utils.js",
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values
    const firstName = form.querySelector('input[name="firstName"]').value.trim();
    const lastName = form.querySelector('input[name="lastName"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const message = form.querySelector('textarea[name="message"]').value.trim();

    // Error spans
    const firstNameError = document.getElementById("firstName-error");
    const lastNameError = document.getElementById("lastName-error");
    const emailError = document.getElementById("email-error");
    const phoneError = document.getElementById("phone-error");
    const messageError = document.getElementById("message-error");

    // Clear errors
    firstNameError.textContent = "";
    lastNameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    messageError.textContent = "";

    let hasError = false;

    // Name validation
    if (!firstName) {
      firstNameError.textContent = "First name is required.";
      hasError = true;
    }

    if (!lastName) {
      lastNameError.textContent = "Last name is required.";
      hasError = true;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      emailError.textContent = "Please enter a valid email address.";
      hasError = true;
    }

    // ✅ Global phone validation (dynamic)
    if (!iti || !phoneInputField.value.trim()) {
      phoneError.textContent = "Phone number is required.";
      hasError = true;
    } else if (!iti.isValidNumber()) {
      // If intl-tel-input says it's invalid
      const errorCode = iti.getValidationError();
      let errorMessage = "Please enter a valid phone number.";

      // Optional: more descriptive error messages
      switch (errorCode) {
        case intlTelInputUtils.validationError.TOO_SHORT:
          errorMessage = "The phone number is too short for the selected country.";
          break;
        case intlTelInputUtils.validationError.TOO_LONG:
          errorMessage = "The phone number is too long for the selected country.";
          break;
        case intlTelInputUtils.validationError.INVALID_COUNTRY_CODE:
          errorMessage = "Invalid country code.";
          break;
        case intlTelInputUtils.validationError.NOT_A_NUMBER:
          errorMessage = "Please enter numbers only.";
          break;
      }

      phoneError.textContent = errorMessage;
      hasError = true;
    }

    // Message validation
    if (!message) {
      messageError.textContent = "Message is required.";
      hasError = true;
    }

    if (hasError) return; // Stop submission if errors

    // ✅ Get the full international phone number
    const phoneNumber = iti.getNumber();

    // Send with EmailJS if no errors
    emailjs
      .send("service_llyjjei", "template_0dhkdl2", {
        firstName,
        lastName,
        email,
        phone: phoneNumber,
        message,
      })
      .then(
        function () {
          alert("Message sent successfully!");
          form.reset();
        },
        function (error) {
          alert("Something went wrong. Try again!");
          console.error("EmailJS error:", error);
        }
      );
  });
});
