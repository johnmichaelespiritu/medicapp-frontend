import { ref, onMounted } from "vue";
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

    // A boolean ref indicating whether the password visibility is enabled for creating and confirming a new password.
    const isCreatePassword = ref(true);
    const isConfirmPassword = ref(true);

    // Refs for form validation, set to `false` initially.
    const userNameRef = ref(false);
    const userEmailRef = ref(false);
    const userPasswordRef = ref(false);
    const userConfirmPasswordRef = ref(false);

    // A ref to hold the user's confirmed password.
    const user_confirm_password = ref(null);

    // The registration form object containing the action type and user input data.
    const registerForm = ref({
      action: "signup",
      user_name: null,
      user_email: null,
      user_password: null,
    });

    /**
     * Methods for showing/hiding password.
     */
    const showCreatePassword = () => {
      isCreatePassword.value = !isCreatePassword.value;
    };

    const showConfirmPassword = () => {
      isConfirmPassword.value = !isConfirmPassword.value;
    };

    /**
     * Validates the registration form data and checks if all required fields are filled correctly.
     * @returns {boolean} True if the form is valid, false otherwise.
     */
    const validateRegistrationForm = () => {
      // Regular expression to validate the email format.
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      // Check if all form fields are not filled.
      if (
        !userNameRef.value.validate() &&
        !userEmailRef.value.validate() &&
        !userPasswordRef.value.validate() &&
        !userConfirmPasswordRef.value.validate()
      ) {
        // Show a error notification if all fields are empty.
        showNotification(
          $quasar,
          "negative",
          "Please fill out the fields.",
          200
        );
        return false;
      } else if (!userNameRef.value.validate()) {
        // Check if the user name field is empty.
        // Show a error notification if the user name field is empty.
        showNotification($quasar, "negative", "Please enter your name.", 200);
        return false;
      } else if (!userEmailRef.value.validate()) {
        // Check if the email field is empty.
        // Show a error notification if the email field is empty.
        showNotification(
          $quasar,
          "negative",
          "Please enter your email address.",
          200
        );
        return false;
      } else if (!emailRegex.test(registerForm.value.user_email)) {
        // Check if the email matches the regular expression pattern.
        userEmailRef.value.$el.classList.add("error");
        // Show a error notification if the email format is invalid.
        showNotification(
          $quasar,
          "negative",
          "Please enter a valid email address.",
          200
        );
        return false;
      } else if (!userPasswordRef.value.validate()) {
        // Check if the password field is empty.
        // Show a error notification if the password field is empty.
        showNotification(
          $quasar,
          "negative",
          "Please enter your password.",
          200
        );
        return false;
      } else if (registerForm.value.user_password.length < 8) {
        // Check if the password is less than 8 characters..
        userPasswordRef.value.$el.classList.add("error");
        // Show a error notification if the password is too short (less than 8 characters).
        showNotification(
          $quasar,
          "negative",
          "Password must be at least 8 characters long.",
          200
        );
        return false;
      } else if (!userConfirmPasswordRef.value.validate()) {
        // Check if the confirm password field is empty.
        userConfirmPasswordRef.value.$el.classList.add("error");
        // Show a error notification if the confirm password field is empty.
        showNotification(
          $quasar,
          "negative",
          "Please confirm your password.",
          200
        );
        return false;
      } else if (
        registerForm.value.user_password !== user_confirm_password.value
      ) {
        // Check if the password and confirm password fields match.
        userPasswordRef.value.$el.classList.add("error");
        userConfirmPasswordRef.value.$el.classList.add("error");
        // Show error notification for password mismatch.
        showNotification($quasar, "negative", "Passwords do not match.", 200);
        return false;
      } else {
        return true;
      }
    };

    /**
     * Adds a new user account when the "Sign Up" button is clicked and the registration form is valid.
     * It performs a login function and handles the response accordingly.
     */
    const addAccount = () => {
      // Validate the registration form.
      const isRegistrationFormValid = validateRegistrationForm();

      if (isRegistrationFormValid) {
        // Remove error classes from email and password fields.
        userEmailRef.value.$el.classList.remove("error");
        userPasswordRef.value.$el.classList.remove("error");
        userConfirmPasswordRef.value.$el.classList.remove("error");

        // Perform login function and handle the response.
        loginFunction(registerForm.value).then((data) => {
          if (data.status === "failed") {
            // Show a error notification if the login function fails.
            showNotification($quasar, "negative", data.message, 200);
          } else {
            // Show an warning notification if the login function succeeds.
            showNotification($quasar, "info", data.message, 200);
            // Reset the registration form and set user data.
            resetAddAccountForm();
            userID.value = data.data;
            userEmailVerificationPurpose.value = "sign_up";
            // Hide login form after the warning message.
            trigger.value.showLoginForm = false;
            // Redirect to the email verification page.
            window.location.href =
              "https://medicapp-system.netlify.app/#/emailverification";
          }
        });
      }
    };

    /**
     * Resets the "Add Account" form, clearing the input fields and resetting validation.
     */
    const resetAddAccountForm = () => {
      isCreatePassword.value = true;
      isConfirmPassword.value = true;

      // Reset the registration form fields and confirm password
      resetForm(registerForm.value);
      user_confirm_password.value = null;

      // Reset validation for each field
      const fieldsToResetValidation = [
        userNameRef.value,
        userEmailRef.value,
        userPasswordRef.value,
        userConfirmPasswordRef.value,
      ];

      fieldsToResetValidation.forEach((field) => {
        field.resetValidation();
      });
    };

    /**
     * Exits the "Sign Up" form and navigates back to the login form.
     * It resets the "Add Account" form before navigating.
     */
    const exitSignUpForm = () => {
      // Reset the "Add Account" form and show the login form
      resetAddAccountForm();
      // Show login form after exit.
      trigger.value.showLoginForm = true;
      // Redirect to the login page.
      window.location.href = "https://medicapp-system.netlify.app/#/";
    };

    /**
     *  Execute when the component is mounted.
     */
    onMounted(() => {
      // Check if the page was reloaded.
      if (performance.navigation.type === 1) {
        // Reset form.
        trigger.value.showLoginForm = false;
      }
    });

    return {
      isCreatePassword,
      isConfirmPassword,
      trigger,
      registerForm,
      userNameRef,
      userEmailRef,
      userPasswordRef,
      userConfirmPasswordRef,
      user_confirm_password,
      showCreatePassword,
      showConfirmPassword,
      addAccount,
      exitSignUpForm,
      rules,
    };
  },
};
