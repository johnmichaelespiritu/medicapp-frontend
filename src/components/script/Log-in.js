import { ref } from "vue";
import { useQuasar } from "quasar";
import { showNotification, resetForm, rules } from "src/composables/Utils.js";
import {
  trigger,
  loginFunction,
  userID,
  userEmailVerificationPurpose,
} from "src/composables/Medicapp.js";

export default {
  setup() {
    // Quasar instance for accessing Quasar plugins.
    const $quasar = useQuasar();

    // Refs for managing form fields and password visibility.
    const isPwd = ref(true);
    const userEmailRef = ref(null);
    const userPasswordRef = ref(null);

    // Form data for user email and password.
    const loginForm = ref({
      action: "login",
      user_email: null,
      user_password: null,
    });

    /**
     * Methods for showing/hiding password.
     */
    const showPassword = () => {
      isPwd.value = !isPwd.value;
    };

    /**
     * Validates the login form before submission.
     * @returns {boolean} True if the form is valid, otherwise false.
     */
    const validateLoginForm = () => {
      // Regular expression for validating email format/
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      // Check if both email and password fields are empty.
      if (!userEmailRef.value.validate() && !userPasswordRef.value.validate()) {
        // Show error notification for empty fields.
        showNotification(
          $quasar,
          "negative",
          "Please fill out the fields.",
          200
        );
        return false;
      } else if (!userEmailRef.value.validate()) {
        // Check if the email field is empty.
        // Show error notification for empty email field.
        showNotification(
          $quasar,
          "negative",
          "Please enter your email address.",
          200
        );
        return false;
      } else if (!emailRegex.test(loginForm.value.user_email)) {
        // Check if the email matches the regular expression pattern.
        userEmailRef.value.$el.classList.add("error");
        // Show error notification for invalid email format.
        showNotification(
          $quasar,
          "negative",
          "Please enter a valid email address.",
          200
        );
        return false;
      } else if (!userPasswordRef.value.validate()) {
        // Check if the password field is empty.
        // Show error notification for empty passsword field.
        showNotification(
          $quasar,
          "negative",
          "Please enter your password.",
          200
        );
        return false;
      } else {
        // Return true if the form is valid.
        return true;
      }
    };

    /**
     * Handles the sign-in process when the "Sign In" button is clicked.
     */
    const signin = () => {
      // Validate the login form.
      const isLoginFormValid = validateLoginForm();

      if (isLoginFormValid) {
        // Remove error classes from email and password fields.
        userEmailRef.value.$el.classList.remove("error");
        userPasswordRef.value.$el.classList.remove("error");

        // Perform login function and handle the response.
        loginFunction(loginForm.value).then((data) => {
          if (data.status === "warning") {
            // Handle warning status response.
            setTimeout(() => {
              // Show warning notification.
              showNotification($quasar, "info", data.message, 200);
              // Reset the login form.
              resetLoginForm();
              // Hide login form after the warning message.
              trigger.value.showLoginForm = false;
              userID.value = data.data;
              userEmailVerificationPurpose.value = "login";
              // Redirect to the email verification page.
              window.location.href =
                "https://medicapp-system.netlify.app/#/emailverification";
            }, 1000);
          } else if (data.status === "failed") {
            // Handle failed status response.
            // Add error classes for email and password fields.
            userEmailRef.value.$el.classList.add("error");
            userPasswordRef.value.$el.classList.add("error");
            // Show warning notification.
            showNotification($quasar, "negative", data.message, 200);
          } else {
            // Show success notification for success logging in.
            showNotification($quasar, "positive", data.message, 200);
            setTimeout(() => {
              // Redirect to the dashboard information page.
              window.location.href =
                "https://medicapp-system.netlify.app/#/home/dashboard-information";
              location.reload();
              trigger.value.activeMenu = "Dashboard";
            }, 1000);
          }
        });
      }
      trigger.value.activeMenu = null;
    };

    /**
     * Resets the login form and its validation.
     */
    const resetLoginForm = () => {
      // Reset the login form data.
      resetForm(loginForm.value);

      // Reset password visibility.
      isPwd.value = true;

      const fieldsToResetValidation = [
        userEmailRef.value,
        userPasswordRef.value,
      ];

      // Reset validation for email and password fields.
      fieldsToResetValidation.forEach((field) => {
        field.resetValidation();
      });
    };

    /**
     * Switches to the registration form.
     */
    const registerForm = () => {
      trigger.value.showLoginForm = false;
      window.location.href = "https://medicapp-system.netlify.app/#/signup";
      resetLoginForm();
    };

    /**
     * Switches to the forgot password form.
     */
    const forgotPasswordForm = () => {
      trigger.value.showLoginForm = false;
      trigger.value.showForgotPasswordEmailForm = true;
      window.location.href =
        "https://medicapp-system.netlify.app/#/forgotpassword";
      resetLoginForm();
    };

    // Return the reactive references and functions.
    return {
      isPwd,
      trigger,
      loginForm,
      userEmailRef,
      userPasswordRef,
      rules,
      showPassword,
      signin,
      resetLoginForm,
      registerForm,
      forgotPasswordForm,
    };
  },
};
