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
        updateFunction(emailVerificationCode.value).then((response) => {
          if (response.status === "failed") {
            showNotification($quasar, "negative", response.data, 200);
          } else {
            if (response.data === "sign_up" || response.data === "log_in") {
              showNotification(
                $quasar,
                "positive",
                "You have successfully verified account.",
                200
              );
              trigger.value.showLoginForm = true;
              window.location.href = "http://localhost:9000/#/";
            } else {
              showNotification(
                $quasar,
                "positive",
                "You have successfully verified account. You may now change your password.",
                200
              );
              trigger.value.showForgotPasswordEmailForm = false;
              trigger.value.showForgotPasswordPasswordForm = true;
              userEmailVerificationPurpose.value = "change_password";
              window.location.href = "http://localhost:9000/#/forgotpassword";
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
