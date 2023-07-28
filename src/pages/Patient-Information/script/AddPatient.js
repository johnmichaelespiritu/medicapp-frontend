import { ref } from "vue";
import { useQuasar } from "quasar";
import {
  validateFields,
  validateFormInputs,
  validateAge,
  showNotification,
  resetForm,
  genderOptions,
  rules,
} from "src/composables/Utils.js";
import { trigger, addData, patient } from "src/composables/Medicapp.js";

export default {
  setup() {
    const $quasar = useQuasar();

    const patientFields = [
      { key: "patient_name", label: "Name" },
      { key: "patient_age", label: "Age" },
      { key: "patient_home_address", label: "Home Address" },
      { key: "patient_contact_number", label: "Contact Number" },
      { key: "patient_gender", label: "Gender" },
      { key: "patient_birthdate", label: "Birthdate" },
    ];

    const patientForm = ref(
      Object.fromEntries(patientFields.map((field) => [field.key, null]))
    );

    const addPatientInformation = () => {
      const isPatientFormValid = validateFormInputs(patientForm, patientFields);

      if (isPatientFormValid) {
        patientForm.value.action = "addPatient";
        addData("Patient.php", patientForm.value, patient).then((data) => {
          if (data.status === "failed") {
            showNotification($quasar, "negative", data.message, 200);
          } else {
            showNotification($quasar, "positive", data.message, 200);
            trigger.value.showAddPatientModelDialog = false;
            resetForm(patientForm.value);
          }
        });
      } else {
        showNotification($quasar, "negative", "Required field.", 200);
      }
    };

    return {
      genderOptions,
      patientFields,
      patientForm,
      trigger,
      rules,
      addPatientInformation,
      validateFields,
      resetForm,
      validateAge,
    };
  },
};
