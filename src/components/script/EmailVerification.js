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
    const $quasar = useQuasar();

    const emailVerificationCode = ref({
      action: "verify_code",
      user_email_purpose: userEmailVerificationPurpose.value,
      user_id: userID.value,
      verification_code: null,
    });

    const verificationCodeRef = ref(null);

    const confirmVerificationCode = () => {
      verificationCodeRef.value.validate();

      if (verificationCodeRef.value.hasError) {
        showNotification($quasar, "negative", "Required field.", 200);
      } else {
        updateFunction(emailVerificationCode.value).then((data) => {
          if (data.status === "failed") {
            showNotification($quasar, "negative", data.message, 200);
          } else {
            if (data.data === "forgot_password") {
              showNotification($quasar, "positive", data.message, 200);
              trigger.value.showForgotPasswordEmailForm = false;
              trigger.value.showForgotPasswordPasswordForm = true;
              userEmailVerificationPurpose.value = "change_password";
              window.location.href = "http://localhost:9000/#/forgotpassword";
            } else {
              showNotification($quasar, "positive", data.message, 200);
              trigger.value.showLoginForm = true;
              window.location.href = "http://localhost:9000/#/";
            }
          }
        });
      }
    };

    const exitEmailVerificationForm = () => {
      trigger.value.showLoginForm = true;
      window.location.href = "http://localhost:9000/#/";
    };

    onMounted(() => {
      if (performance.navigation.type === 1) {
        trigger.value.showLoginForm = false;
        trigger.value.showForgotPasswordEmailForm = false;
        trigger.value.showForgotPasswordPasswordForm = false;
      }
    });

    return {
      emailVerificationCode,
      verificationCodeRef,
      trigger,
      confirmVerificationCode,
      exitEmailVerificationForm,
    };
  },
};
