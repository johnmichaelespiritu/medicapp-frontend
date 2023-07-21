import { ref } from "vue";
import { useQuasar } from "quasar";
import {
  validateFields,
  validateFormInputs,
  resetForm,
  showNotification,
  rules,
} from "src/composables/Utils.js";
import { trigger, addData, doctor } from "src/composables/Medicapp.js";

export default {
  setup() {
    const $quasar = useQuasar();

    const doctorFields = [
      { key: "doctor_name", label: "Name" },
      { key: "specialization", label: "Specialization" },
      { key: "contact_number", label: "Contact Number" },
      { key: "email_address", label: "Email Address" },
      { key: "home_address", label: "Home Address" },
    ];

    const doctorForm = ref(
      Object.fromEntries(doctorFields.map((field) => [field.key, null]))
    );

    const validateEmail = () => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (!emailRegex.test(doctorForm.value.email_address)) {
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

    const addDoctorInformation = async () => {
      const isDoctorFormValid = validateFormInputs(doctorForm, doctorFields);

      if (isDoctorFormValid) {
        const isEmailValid = validateEmail();
        if (isEmailValid) {
          addData("Doctor.php", doctorForm.value, doctor).then((response) => {
            if (response.status === "failed") {
              showNotification($quasar, "negative", response.data, 200);
            } else {
              showNotification(
                $quasar,
                "positive",
                "Doctor added successfully.",
                200
              );
              trigger.value.showAddDoctorModelDialog = false;
              resetForm(doctorForm.value);
            }
          });
        }
      } else {
        showNotification($quasar, "negative", "Required field.", 200);
      }
    };

    return {
      doctorFields,
      doctorForm,
      trigger,
      rules,
      addDoctorInformation,
      validateFields,
      resetForm,
    };
  },
};
