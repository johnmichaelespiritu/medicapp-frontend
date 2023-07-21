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
        addData("Patient.php", patientForm.value, patient).then((response) => {
          if (response.status === "failed") {
            showNotification($quasar, "negative", response.data, 200);
          } else {
            showNotification(
              $quasar,
              "positive",
              "Patient added successfully.",
              200
            );
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
