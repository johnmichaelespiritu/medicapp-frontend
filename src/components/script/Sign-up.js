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
    const $quasar = useQuasar();
    const isCreatePassword = ref(true);
    const isConfirmPassword = ref(true);

    const userNameRef = ref(false);
    const userEmailRef = ref(false);
    const userPasswordRef = ref(false);
    const userConfirmPasswordRef = ref(false);

    const user_confirm_password = ref(null);

    const registerForm = ref({
      action: "signup",
      user_name: null,
      user_email: null,
      user_password: null,
    });

    const showCreatePassword = () => {
      isCreatePassword.value = !isCreatePassword.value;
    };

    const showConfirmPassword = () => {
      isConfirmPassword.value = !isConfirmPassword.value;
    };

    const validateRegistrationForm = () => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (
        !userNameRef.value.validate() &&
        !userEmailRef.value.validate() &&
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
      } else if (!userNameRef.value.validate()) {
        showNotification($quasar, "negative", "Please enter your name.", 200);
        return false;
      } else if (!userEmailRef.value.validate()) {
        showNotification(
          $quasar,
          "negative",
          "Please enter your email address.",
          200
        );
        return false;
      } else if (!emailRegex.test(registerForm.value.user_email)) {
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
      } else if (registerForm.value.user_password.length < 8) {
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
        registerForm.value.user_password !== user_confirm_password.value
      ) {
        userPasswordRef.value.$el.classList.add("error");
        userConfirmPasswordRef.value.$el.classList.add("error");
        showNotification($quasar, "negative", "Passwords do not match.", 200);
        return false;
      } else {
        return true;
      }
    };

    const addAccount = () => {
      const isRegistrationFormValid = validateRegistrationForm();

      if (isRegistrationFormValid) {
        userEmailRef.value.$el.classList.remove("error");
        userPasswordRef.value.$el.classList.remove("error");
        userConfirmPasswordRef.value.$el.classList.remove("error");

        loginFunction(registerForm.value).then((data) => {
          if (data.status === "failed") {
            showNotification($quasar, "negative", data.message, 200);
          } else {
            showNotification($quasar, "info", data.message, 200);
            resetAddAccountForm();
            userID.value = data.data;
            userEmailVerificationPurpose.value = "sign_up";
            trigger.value.showLoginForm = false;
            window.location.href = "http://localhost:9000/#/emailverification";
          }
        });
      }
    };

    const resetAddAccountForm = () => {
      isCreatePassword.value = true;
      isConfirmPassword.value = true;

      resetForm(registerForm.value);
      user_confirm_password.value = null;

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

    const exitSignUpForm = () => {
      resetAddAccountForm();
      trigger.value.showLoginForm = true;
      window.location.href = "http://localhost:9000/#/";
    };

    onMounted(() => {
      if (performance.navigation.type === 1) {
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
