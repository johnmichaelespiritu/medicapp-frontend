import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import {
  showNotification,
  compareInformation,
  validateFields,
  validateFormInputs,
  rules,
} from "src/composables/Utils.js";
import {
  specificDoctorInformation,
  trigger,
  updateData,
  doctor,
} from "src/composables/Medicapp.js";

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

    const doctorForm = ref({
      doctor_id: null,
      ...Object.fromEntries(doctorFields.map((field) => [field.key, null])),
    });

    watch(specificDoctorInformation, (value) => {
      const fieldsToUpdate = [
        "doctor_id",
        "doctor_name",
        "specialization",
        "contact_number",
        "email_address",
        "home_address",
      ];

      fieldsToUpdate.forEach((field) => {
        doctorForm.value[field] = value[0][field];
      });
    });

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

    const updateDoctorInformation = async () => {
      const isDoctorFormUpdated = compareInformation(
        doctorForm,
        doctorFields,
        specificDoctorInformation
      );
      const isDoctorFormValid = validateFormInputs(doctorForm, doctorFields);

      if (isDoctorFormUpdated) {
        if (isDoctorFormValid) {
          const isEmailValid = validateEmail();
          if (isEmailValid) {
            doctorForm.value.action = "updateDoctor";
            updateData(
              "Doctor.php",
              doctorForm.value,
              doctor,
              "doctor_id"
            ).then((data) => {
              if (data.status === "failed") {
                showNotification($quasar, "negative", data.message, 200);
              } else {
                showNotification($quasar, "positive", data.message, 200);
                trigger.value.showUpdateDoctorModelDialog = false;
              }
            });
          }
        } else {
          showNotification($quasar, "negative", "Required field.", 200);
        }
      } else {
        showNotification($quasar, "info", "No update has been made.", 200);
      }
    };

    return {
      doctorFields,
      doctorForm,
      trigger,
      rules,
      validateFields,
      updateDoctorInformation,
    };
  },
};
