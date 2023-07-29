import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { showNotification, rules } from "src/composables/Utils.js";
import {
  trigger,
  userEmail,
  userID,
  userEmailVerificationPurpose,
  updateFunction,
} from "src/composables/Medicapp.js";

export default {
  setup() {
    // Quasar instance for accessing Quasar plugins.
    const $quasar = useQuasar();

    // Refs for managing form fields and password visibility.
    const isCreatePassword = ref(true);
    const isConfirmPassword = ref(true);
    const user_confirm_password = ref(null);
    const userEmailRef = ref(null);
    const userPasswordRef = ref(null);
    const userConfirmPasswordRef = ref(null);

    // Form data for resending verification code.
    const resendVerificationCodeForm = ref({
      action: "resend_verification_code",
      user_email: null,
    });

    // Form data for updating password
    const userUpdatePasswordForm = ref({
      action: "change_password",
      user_id: userID.value,
      user_password: null,
    });

    /**
     * Methods for showing/hiding password and validating email form.
     */
    const showCreatePassword = () => {
      isCreatePassword.value = !isCreatePassword.value;
    };

    const showConfirmPassword = () => {
      isConfirmPassword.value = !isConfirmPassword.value;
    };

    /**
     * Function that validates the form data in sending the email address.
     */
    const validateForgotPasswordEmailForm = () => {
      // Regular expression for validating email format.
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      // Check if the user's email is not empty.
      if (!userEmailRef.value.validate()) {
        // Show error notification for empty email.
        showNotification(
          $quasar,
          "negative",
          "Please enter your email address.",
          200
        );
        return false;
      } else if (
        !emailRegex.test(resendVerificationCodeForm.value.user_email)
      ) {
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
      } else {
        // Return true if the email address is valid.
        return true;
      }
    };

    /**
     * Function that validates the form data in updating the password.
     */
    const validateForgotPasswordPasswordForm = () => {
      // Check if both password fields are not empty.
      if (
        !userPasswordRef.value.validate() &&
        !userConfirmPasswordRef.value.validate()
      ) {
        // Show error notification for empty password fields.
        showNotification(
          $quasar,
          "negative",
          "Please fill out the fields.",
          200
        );
        return false;
      } else if (userUpdatePasswordForm.value.user_password.length < 8) {
        // Check if password is at least 8 characters long.
        userPasswordRef.value.$el.classList.add("error");
        // Show error notification for short passwords.
        showNotification(
          $quasar,
          "negative",
          "Password must be at least 8 characters long.",
          200
        );
        return false;
      } else if (!userConfirmPasswordRef.value.validate()) {
        // Check if the confirm password field is not empty.
        userConfirmPasswordRef.value.$el.classList.add("error");
        // Show error notification for empty confirm password field.
        showNotification(
          $quasar,
          "negative",
          "Please confirm your password.",
          200
        );
        return false;
      } else if (
        userUpdatePasswordForm.value.user_password !==
        user_confirm_password.value
      ) {
        // Check if the password and confirm password fields match.
        userPasswordRef.value.$el.classList.add("error");
        userConfirmPasswordRef.value.$el.classList.add("error");
        // Show error notification for password mismatch.
        showNotification($quasar, "negative", "Passwords do not match.", 200);
        return false;
      } else {
        // Return true if password is valid.
        return true;
      }
    };

    /**
     * Function to send the email address to the backend API.
     */
    const sendForgotPasswordEmailForm = () => {
      // Validate the email form before sending.
      const isForgotPasswordEmailFormValid = validateForgotPasswordEmailForm();

      if (isForgotPasswordEmailFormValid) {
        // Send the request to update the password with the verification code.
        updateFunction(resendVerificationCodeForm.value).then((data) => {
          if (data.status === "failed") {
            // Show error notification for failed request.
            showNotification($quasar, "negative", data.message, 200);
          } else {
            // Show success notification and update user information for password reset.
            showNotification($quasar, "positive", data.message, 200);
            userID.value = data.user_id;
            userEmail.value = data.user_email;
            userEmailVerificationPurpose.value = "forgot_password";
            // Redirect to email verification page.
            window.location.href = "http://localhost:9000/#/emailverification";
          }
        });
      }
    };

    /**
     * Function to send the updated password to the backend API.
     */
    const sendForgotPasswordPasswordForm = () => {
      // Validate the password form before submitting.
      const isForgotPasswordPasswordFormValid =
        validateForgotPasswordPasswordForm();

      if (isForgotPasswordPasswordFormValid) {
        // Send the request to update the password with the new one.
        updateFunction(userUpdatePasswordForm.value).then((data) => {
          if (data.status === "failed") {
            // Show error notification for failed request.
            showNotification($quasar, "negative", data.message, 200);
          } else {
            // Show success notification for password update.
            showNotification($quasar, "positive", data.message, 200);
            // Show login form after successful password update.
            trigger.value.showLoginForm = true;
            // Redirect to the login page.
            window.location.href = "http://localhost:9000/#/";
          }
        });
      }
    };

    /**
     * Function to reset the forgot password form.
     */
    const resetForgotPasswordForm = () => {
      // Reset the form fields and visibility states.
      resendVerificationCodeForm.value.user_email = null;
      userUpdatePasswordForm.value.user_password = null;
      user_confirm_password.value = null;

      isCreatePassword.value = true;
      isConfirmPassword.value = true;

      // Reset validation for each form field
      const fieldsToResetValidation = [
        userEmailRef.value,
        userPasswordRef.value,
        userConfirmPasswordRef.value,
      ];

      fieldsToResetValidation.forEach((field) => {
        field.resetValidation();
      });
    };

    /**
     * Function to exit the email verification form and return to login page.
     */
    const exitForgotPasswordForm = () => {
      resetForgotPasswordForm();
      trigger.value.showLoginForm = true;
      window.location.href = "http://localhost:9000/#/";
    };

    /**
     *  Execute when the component is mounted.
     */
    onMounted(() => {
      // Check if the page was reloaded.
      if (performance.navigation.type === 1) {
        // Reset form and show the forgot password email form.
        trigger.value.showLoginForm = false;
        trigger.value.showForgotPasswordEmailForm = true;
      }
    });

    // Return the reactive references and functions.
    return {
      isCreatePassword,
      isConfirmPassword,
      trigger,
      userUpdatePasswordForm,
      resendVerificationCodeForm,
      user_confirm_password,
      userEmailRef,
      userPasswordRef,
      userConfirmPasswordRef,
      rules,
      showCreatePassword,
      showConfirmPassword,
      sendForgotPasswordEmailForm,
      sendForgotPasswordPasswordForm,
      exitForgotPasswordForm,
    };
  },
};
