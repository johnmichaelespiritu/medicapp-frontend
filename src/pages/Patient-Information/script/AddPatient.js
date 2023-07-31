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
    // Quasar instance for accessing Quasar plugins.
    const $quasar = useQuasar();

    // Array of patient fields and their labels.
    const patientFields = [
      { key: "patient_name", label: "Name" },
      { key: "patient_age", label: "Age" },
      { key: "patient_home_address", label: "Home Address" },
      { key: "patient_contact_number", label: "Contact Number" },
      { key: "patient_gender", label: "Gender" },
      { key: "patient_birthdate", label: "Birthdate" },
    ];

    // Object to store consultation form data.
    const patientForm = ref(
      Object.fromEntries(patientFields.map((field) => [field.key, null]))
    );

    /**
     * Handles the process of adding patient information.
     */
    const addPatientInformation = () => {
      // Validates the form inputs and adds the patient information if valid.
      const isPatientFormValid = validateFormInputs(patientForm, patientFields);

      if (isPatientFormValid) {
        // Set the action for the add patient form.
        patientForm.value.action = "addPatient";
        // Call the addData function to add patient data.
        addData("Patient.php", patientForm.value, patient).then((data) => {
          if (data.status === "failed") {
            // Show error notification for failed attempt.
            showNotification($quasar, "negative", data.message, 200);
          } else {
            // Show success notification for successful addition.
            showNotification($quasar, "positive", data.message, 200);
            // Close the dialog and reset the form.
            trigger.value.showAddPatientModelDialog = false;
            resetForm(patientForm.value);
          }
        });
      } else {
        // Show error notification if required fields are empty.
        showNotification($quasar, "negative", "Required field.", 200);
      }
    };

    // Return the reactive references and functions.
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
