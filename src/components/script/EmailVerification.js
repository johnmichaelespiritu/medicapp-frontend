import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { showNotification } from "src/composables/Utils.js";
import {
  userID,
  userEmailVerificationPurpose,
  updateFunction,
  trigger,
} from "src/composables/Medicapp.js";
export default {
  setup() {
    // Quasar instance for accessing Quasar plugins.
    const $quasar = useQuasar();

    // Reactive reference for the email verification code data.
    const emailVerificationCode = ref({
      action: "verify_code",
      user_email_purpose: userEmailVerificationPurpose.value,
      user_id: userID.value,
      verification_code: null,
    });

    // Reference to the verification code input element.
    const verificationCodeRef = ref(null);

    /**
     *  Function to confirm the email verification code.
     */
    const confirmVerificationCode = () => {
      // Validate the verification code input.
      verificationCodeRef.value.validate();

      if (verificationCodeRef.value.hasError) {
        // Show notification for required field error.
        showNotification($quasar, "negative", "Required field.", 200);
      } else {
        // Perform the updateFunction to verify the code.
        updateFunction(emailVerificationCode.value).then((data) => {
          if (data.status === "failed") {
            // Show negative notification for verification failure.
            showNotification($quasar, "negative", data.message, 200);
          } else {
            if (data.data === "forgot_password") {
              // Show positive notification for successful verification and change purpose to 'change_password'.
              showNotification($quasar, "positive", data.message, 200);
              trigger.value.showForgotPasswordEmailForm = false;
              trigger.value.showForgotPasswordPasswordForm = true;
              userEmailVerificationPurpose.value = "change_password";
              window.location.href =
                "https://medicapp-system.netlify.app/#/forgotpassword";
            } else {
              // Show positive notification for successful verification and change purpose to 'login'.
              showNotification($quasar, "positive", data.message, 200);
              trigger.value.showLoginForm = true;
              window.location.href = "https://medicapp-system.netlify.app/#/";
            }
          }
        });
      }
    };

    /**
     *  Function to exit the email verification form and return to login page.
     */
    const exitEmailVerificationForm = () => {
      trigger.value.showLoginForm = true;
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
        trigger.value.showForgotPasswordEmailForm = false;
        trigger.value.showForgotPasswordPasswordForm = false;
      }
    });

    // Return the reactive references and functions.
    return {
      emailVerificationCode,
      verificationCodeRef,
      trigger,
      confirmVerificationCode,
      exitEmailVerificationForm,
    };
  },
};
