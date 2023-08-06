import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import {
  validateFields,
  resetForm,
  showNotification,
  useSelectedRecord,
  rules,
} from "src/composables/Utils.js";
import {
  searchDoctorContents,
  trigger,
  addData,
  consultation,
  filterData,
  searchContents,
} from "src/composables/Medicapp.js";

export default {
  setup() {
    // Quasar instance for accessing Quasar plugins.
    const $quasar = useQuasar();

    // Array of consultation fields and their labels.
    const consultationFields = [
      { key: "patient_name", label: "Patient Name" },
      { key: "doctor_name", label: "Doctor Name" },
      { key: "patient_age", label: "Age" },
      { key: "patient_home_address", label: "Home Address" },
      { key: "patient_contact_number", label: "Contact Number" },
      { key: "complaints", label: "Complaints" },
      { key: "diagnosis", label: "Diagnosis" },
      { key: "treatment", label: "Treatment" },
      { key: "consultation_date", label: "Consultation Date" },
    ];

    // Object to store consultation form data.
    const consultationForm = ref({
      patient_id: null,
      doctor_id: null,
      ...Object.fromEntries(
        consultationFields.map((field) => [field.key, null])
      ),
    });

    /**
     * Function to watch for changes in selectedPatient and update related fields in consultationForm.
     */
    const { selectedRecord: selectedPatient } = useSelectedRecord(
      searchContents,
      consultationForm,
      "patient_name"
    );

    /**
     * Function to watch for changes in selectedDoctor and update related fields in consultationForm.
     */
    const { selectedRecord: selectedDoctor } = useSelectedRecord(
      searchDoctorContents,
      consultationForm,
      "doctor_name"
    );

    /**
     * Watcher for selectedPatient to update patient-related fields in consultationForm
     */
    watch(selectedPatient, (patient) => {
      const fieldsToUpdate = [
        "patient_age",
        "patient_home_address",
        "patient_contact_number",
      ];
      if (patient) {
        fieldsToUpdate.forEach((field) => {
          consultationForm.value[field] = patient[field];
        });
      } else {
        fieldsToUpdate.forEach((field) => {
          consultationForm.value[field] = null;
        });
      }
    });

    /**
     * Validates the inputs of the consultation form.
     * @returns {boolean} True if all required fields have valid values; false otherwise.
     */
    const validateConsultationFormInputs = () => {
      return consultationFields.every((field) => {
        const value = consultationForm.value[field.key];

        // Skip validation for patient related fields.
        if (
          field.key === "patient_age" ||
          field.key === "patient_home_address" ||
          field.key === "patient_contact_number"
        ) {
          return true;
        } else {
          return value && value.length > 0;
        }
      });
    };

    /**
     * Handles the process of adding consultation information.
     */
    const addConsultationInformation = () => {
      // Validates the form inputs and adds the consultation if valid.
      const isConsultationFormValid = validateConsultationFormInputs();

      if (isConsultationFormValid) {
        // Check if a patient or doctor is selected.
        if (selectedPatient.value || selectedDoctor.value) {
          consultationForm.value.patient_id = selectedPatient.value.patient_id;
          consultationForm.value.doctor_id = selectedDoctor.value.doctor_id;

          // Set the action for the add consultation form.
          consultationForm.value.action = "addConsultation";

          // Call the addData function to add consultation data.
          addData(
            "Consultation.php",
            consultationForm.value,
            consultation
          ).then((data) => {
            if (data.status === "failed") {
              // Show error notification for failed attempt.
              showNotification($quasar, "negative", data.message, 200);
            } else {
              // Show success notification for successful addition.
              showNotification($quasar, "positive", data.message, 200);
              // Close the dialog and reset the form.
              trigger.value.showAddConsultationModelDialog = false;
              resetForm(consultationForm.value);
            }
          });
        }
      } else {
        // Show error notification if required fields are empty.
        showNotification($quasar, "negative", "Required field.", 200);
      }
    };

    // Return the reactive references and functions.
    return {
      consultationFields,
      consultationForm,
      searchDoctorContents,
      trigger,
      searchContents,
      rules,
      addConsultationInformation,
      validateFields,
      resetForm,
      filterData,
    };
  },
};
