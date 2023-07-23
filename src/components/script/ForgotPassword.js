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
    const $quasar = useQuasar();
    const isCreatePassword = ref(true);
    const isConfirmPassword = ref(true);

    const user_confirm_password = ref(null);

    const userEmailRef = ref(null);
    const userPasswordRef = ref(null);
    const userConfirmPasswordRef = ref(null);

    const resendVerificationCodeForm = ref({
      action: "resend_verification_code",
      user_email: null,
    });

    const userUpdatePasswordForm = ref({
      action: "change_password",
      user_id: userID.value,
      user_password: null,
    });

    const showCreatePassword = () => {
      isCreatePassword.value = !isCreatePassword.value;
    };

    const showConfirmPassword = () => {
      isConfirmPassword.value = !isConfirmPassword.value;
    };

    const validateForgotPasswordEmailForm = () => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (!userEmailRef.value.validate()) {
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
        userEmailRef.value.$el.classList.add("error");
        showNotification(
          $quasar,
          "negative",
          "Please enter a valid email address.",
          200
        );
        return false;
      } else {
        return true;
      }
    };

    const validateForgotPasswordPasswordForm = () => {
      if (
        !userPasswordRef.value.validate() &&
        !userConfirmPasswordRef.value.validate()
      ) {
        showNotification(
          $quasar,
          "negative",
          "Please fill out the fields.",
          200
        );
        return false;
      } else if (userUpdatePasswordForm.value.user_password.length < 8) {
        userPasswordRef.value.$el.classList.add("error");
        showNotification(
          $quasar,
          "negative",
          "Password must be at least 8 characters long.",
          200
        );
        return false;
      } else if (!userConfirmPasswordRef.value.validate()) {
        userConfirmPasswordRef.value.$el.classList.add("error");
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
        userPasswordRef.value.$el.classList.add("error");
        userConfirmPasswordRef.value.$el.classList.add("error");
        showNotification($quasar, "negative", "Passwords do not match.", 200);
        return false;
      } else {
        return true;
      }
    };

    const sendForgotPasswordEmailForm = () => {
      const isForgotPasswordEmailFormValid = validateForgotPasswordEmailForm();

      if (isForgotPasswordEmailFormValid) {
        updateFunction(resendVerificationCodeForm.value).then((data) => {
          if (data.status === "failed") {
            showNotification($quasar, "negative", data.message, 200);
          } else {
            showNotification($quasar, "positive", data.message, 200);
            userID.value = data.user_id;
            userEmail.value = data.user_email;
            userEmailVerificationPurpose.value = "forgot_password";
            window.location.href = "http://localhost:9000/#/emailverification";
          }
        });
      }
    };

    const sendForgotPasswordPasswordForm = () => {
      const isForgotPasswordPasswordFormValid =
        validateForgotPasswordPasswordForm();

      if (isForgotPasswordPasswordFormValid) {
        updateFunction(userUpdatePasswordForm.value).then((data) => {
          if (data.status === "failed") {
            showNotification($quasar, "negative", data.message, 200);
          } else {
            showNotification($quasar, "positive", data.message, 200);
            trigger.value.showLoginForm = true;
            window.location.href = "http://localhost:9000/#/";
          }
        });
      }
    };

    const resetForgotPasswordForm = () => {
      resendVerificationCodeForm.value.user_email = null;
      userUpdatePasswordForm.value.user_password = null;
      user_confirm_password.value = null;

      isCreatePassword.value = true;
      isConfirmPassword.value = true;

      const fieldsToResetValidation = [
        userEmailRef.value,
        userPasswordRef.value,
        userConfirmPasswordRef.value,
      ];

      fieldsToResetValidation.forEach((field) => {
        field.resetValidation();
      });
    };

    const exitForgotPasswordForm = () => {
      resetForgotPasswordForm();
      trigger.value.showLoginForm = true;
      window.location.href = "http://localhost:9000/#/";
    };

    onMounted(() => {
      if (performance.navigation.type === 1) {
        trigger.value.showLoginForm = false;
        trigger.value.showForgotPasswordEmailForm = true;
      }
    });

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
