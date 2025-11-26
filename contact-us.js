document.addEventListener("DOMContentLoaded", function () {
  // Contact-form
  const forms = document.querySelectorAll(".contact-form");

  if (!forms.length) return;

  // Loop through each form separately
  forms.forEach((form) => {
    const phoneInputField = form.querySelector('input[name="phone"]');
    let iti;

    // Initialize intl-tel-input 
    if (phoneInputField) {
      iti = window.intlTelInput(phoneInputField, {
        initialCountry: "us",
        preferredCountries: ["us", "gb", "ng"],
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.12/build/js/utils.js",
      });
    }

    // Submit handler 
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Form values
      const firstName = form.querySelector('input[name="firstName"]').value.trim();
      const lastName = form.querySelector('input[name="lastName"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const message = form.querySelector('textarea[name="message"]').value.trim();

      // Error spans 
      const firstNameError = form.querySelector(".firstName-error");
      const lastNameError = form.querySelector(".lastName-error");
      const emailError = form.querySelector(".email-error");
      const phoneError = form.querySelector(".phone-error");
      const messageError = form.querySelector(".message-error");

      // Clear previous errors
      firstNameError.textContent = "";
      lastNameError.textContent = "";
      emailError.textContent = "";
      phoneError.textContent = "";
      messageError.textContent = "";

      let hasError = false;

      // First Name
      if (!firstName) {
        firstNameError.textContent = "First name is required.";
        hasError = true;
      }

      // Last Name
      if (!lastName) {
        lastNameError.textContent = "Last name is required.";
        hasError = true;
      }

      // Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        hasError = true;
      }

      // Phone Validation (intl-tel-input)
      if (!iti || !phoneInputField.value.trim()) {
        phoneError.textContent = "Phone number is required.";
        hasError = true;
      } else if (!iti.isValidNumber()) {
        const errorCode = iti.getValidationError();
        let errorMessage = "Please enter a valid phone number.";

        switch (errorCode) {
          case intlTelInputUtils.validationError.TOO_SHORT:
            errorMessage =
              "The phone number is too short for the selected country.";
            break;
          case intlTelInputUtils.validationError.TOO_LONG:
            errorMessage =
              "The phone number is too long for the selected country.";
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

      // Message
      if (!message) {
        messageError.textContent = "Message is required.";
        hasError = true;
      }

      if (hasError) return;

      // Final international number format
      const phoneNumber = iti.getNumber();

      // Send to EmailJS
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
});
