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
    const $quasar = useQuasar();
    const isPwd = ref(true);
    const userEmailRef = ref(null);
    const userPasswordRef = ref(null);

    const loginForm = ref({
      action: "login",
      user_email: null,
      user_password: null,
    });

    const showPassword = () => {
      isPwd.value = !isPwd.value;
    };

    const validateLoginForm = () => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (!userEmailRef.value.validate() && !userPasswordRef.value.validate()) {
        showNotification(
          $quasar,
          "negative",
          "Please fill out the fields.",
          200
        );
        return false;
      } else if (!userEmailRef.value.validate()) {
        showNotification(
          $quasar,
          "negative",
          "Please enter your email address.",
          200
        );
        return false;
      } else if (!emailRegex.test(loginForm.value.user_email)) {
        userEmailRef.value.$el.classList.add("error");
        showNotification(
          $quasar,
          "negative",
          "Please enter a valid email address.",
          200
        );
        return false;
      } else if (!userPasswordRef.value.validate()) {
        showNotification(
          $quasar,
          "negative",
          "Please enter your password.",
          200
        );
        return false;
      } else {
        return true;
      }
    };

    const signin = () => {
      const isLoginFormValid = validateLoginForm();

      if (isLoginFormValid) {
        userEmailRef.value.$el.classList.remove("error");
        userPasswordRef.value.$el.classList.remove("error");

        loginFunction(loginForm.value).then((data) => {
          if (data.status === "warning") {
            setTimeout(() => {
              showNotification($quasar, "info", data.message, 200);
              resetLoginForm();
              trigger.value.showLoginForm = false;
              userID.value = data.data;
              userEmailVerificationPurpose.value = "login";
              window.location.href =
                "http://localhost:9000/#/emailverification";
            }, 1000);
          } else if (data.status === "failed") {
            userEmailRef.value.$el.classList.add("error");
            userPasswordRef.value.$el.classList.add("error");
            showNotification($quasar, "negative", data.message, 200);
          } else {
            showNotification($quasar, "positive", data.message, 200);
            setTimeout(() => {
              window.location.href =
                "http://localhost:9000/#/home/dashboard-information";
              localStorage.clear();
              trigger.value.activeMenu = "Dashboard";
            }, 1000);
          }
        });
      }
      trigger.value.activeMenu = null;
    };

    const resetLoginForm = () => {
      resetForm(loginForm.value);

      isPwd.value = true;

      const fieldsToResetValidation = [
        userEmailRef.value,
        userPasswordRef.value,
      ];

      fieldsToResetValidation.forEach((field) => {
        field.resetValidation();
      });
    };

    const registerForm = () => {
      trigger.value.showLoginForm = false;
      window.location.href = "http://localhost:9000/#/signup";
      resetLoginForm();
    };

    const forgotPasswordForm = () => {
      trigger.value.showLoginForm = false;
      trigger.value.showForgotPasswordEmailForm = true;
      window.location.href = "http://localhost:9000/#/forgotpassword";
      resetLoginForm();
    };

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
