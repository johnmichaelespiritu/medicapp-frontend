import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import {
  genderOptions,
  showNotification,
  compareInformation,
  validateFields,
  validateAge,
  validateFormInputs,
  rules,
} from "src/composables/Utils.js";
import {
  specificPatientInformation,
  trigger,
  updateData,
  patient,
} from "src/composables/Medicapp.js";

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
    const patientForm = ref({
      patient_id: null,
      ...Object.fromEntries(patientFields.map((field) => [field.key, null])),
    });

    /**
     * Watch specificPatientInformation and update the patientForm fields accordingly.
     */
    watch(specificPatientInformation, (value) => {
      const fieldsToUpdate = [
        "patient_id",
        "patient_name",
        "patient_age",
        "patient_home_address",
        "patient_contact_number",
        "patient_gender",
        "patient_birthdate",
      ];

      fieldsToUpdate.forEach((field) => {
        patientForm.value[field] = value[0][field];
      });
    });

    /**
     * Handles the process of updating patient information.
     */
    const updatePatientInformation = () => {
      // Check if the patient form has been updated.
      const isPatientFormUpdated = compareInformation(
        patientForm,
        patientFields,
        specificPatientInformation
      );
      // Validates the form inputs and adds the patient information if valid.
      const isPatientFormValid = validateFormInputs(patientForm, patientFields);

      if (isPatientFormUpdated) {
        if (isPatientFormValid) {
          // Set the action for the update patient form.
          patientForm.value.action = "updatePatient";
          // Call the updateData function to update patient data.
          updateData(
            "Patient.php",
            patientForm.value,
            patient,
            "patient_id"
          ).then((data) => {
            if (data.status === "failed") {
              // Show error notification for failed attempt.
              showNotification($quasar, "negative", data.message, 200);
            } else {
              // Show success notification for successful update.
              showNotification($quasar, "positive", data.message, 200);
              // Close the dialog.
              trigger.value.showUpdatePatientModelDialog = false;
            }
          });
        } else {
          // Show error notification if required fields are empty.
          showNotification($quasar, "negative", "Required field.", 200);
        }
      } else {
        // Show info notification if no update has been made.
        showNotification($quasar, "info", "No update has been made.", 200);
      }
    };

    // Return the reactive references and functions.
    return {
      genderOptions,
      patientFields,
      patientForm,
      trigger,
      rules,
      updatePatientInformation,
      validateAge,
      validateFields,
    };
  },
};
