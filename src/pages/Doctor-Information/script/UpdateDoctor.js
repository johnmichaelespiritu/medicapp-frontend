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

    const updateDoctorInformation = () => {
      const isDoctorFormUpdated = compareInformation(
        doctorForm,
        doctorFields,
        specificDoctorInformation
      );
      const isDoctorFormValid = validateFormInputs(doctorForm, doctorFields);

      if (isDoctorFormUpdated) {
        if (isDoctorFormValid) {
          updateData("Doctor.php", doctorForm.value, doctor, "doctor_id").then(
            (response) => {
              if (response.status === "failed") {
                showNotification($quasar, "negative", response.data, 200);
              } else {
                showNotification($quasar, "positive", response.data, 200);
                trigger.value.showUpdateDoctorModelDialog = false;
              }
            }
          );
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
