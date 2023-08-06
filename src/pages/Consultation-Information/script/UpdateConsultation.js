import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import {
  validateFields,
  compareInformation,
  showNotification,
  useSelectedRecord,
  rules,
} from "src/composables/Utils.js";
import {
  searchDoctorContents,
  specificConsultationInformation,
  trigger,
  updateData,
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
      { key: "status", label: "Status" },
      { key: "consultation_date", label: "Consultation Date" },
    ];

    // An array of strings representing different statuses for consultations in the application.
    const statuses = [
      "In Progress",
      "Completed",
      "Cancelled",
      "Rescheduled",
      "No Show",
      "Follow-up",
    ];

    // Object to store consultation form data.
    const consultationForm = ref({
      consultation_id: null,
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
     * Watch specificConsultationInformation and update the consultationForm fields accordingly.
     */
    watch(specificConsultationInformation, (value) => {
      const fieldsToUpdate = [
        "consultation_id",
        "patient_id",
        "doctor_id",
        "patient_name",
        "doctor_name",
        "patient_age",
        "patient_home_address",
        "patient_contact_number",
        "complaints",
        "diagnosis",
        "treatment",
        "status",
        "consultation_date",
      ];

      fieldsToUpdate.forEach((field) => {
        consultationForm.value[field] = value[0][field];
      });
    });

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
          return value !== null && value !== undefined && value !== "";
        }
      });
    };

    /**
     * Handles the process of updating consultation information.
     */
    const updateConsultationInformation = () => {
      // Check if the consultation form has been updated.
      const isConsultationFormUpdated = compareInformation(
        consultationForm,
        consultationFields,
        specificConsultationInformation
      );
      // Check if all required fields have values.
      const isConsultationFormValid = validateConsultationFormInputs();

      if (isConsultationFormUpdated) {
        if (isConsultationFormValid) {
          // Set the action for the consultation form update.
          consultationForm.value.action = "updateConsultation";

          // Check if a patient or doctor is selected, and update the consultation form accordingly.
          if (selectedPatient.value) {
            consultationForm.value.patient_id =
              selectedPatient.value.patient_id;
          }

          if (selectedDoctor.value) {
            consultationForm.value.doctor_id = selectedDoctor.value.doctor_id;
          }

          // Call the updateData function to update consultation data.
          updateData(
            "Consultation.php",
            consultationForm.value,
            consultation,
            "consultation_id"
          ).then((data) => {
            if (data.status === "failed") {
              // Show error notification for failed attempt.
              showNotification($quasar, "negative", data.message, 200);
            } else {
              // Show success notification for successful update.
              showNotification(
                $quasar,
                "positive",
                "Consultation updated successfully.",
                200
              );
              // Close the dialog and reset the form.
              trigger.value.showUpdateConsultationModelDialog = false;
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
      consultationFields,
      consultationForm,
      searchDoctorContents,
      statuses,
      trigger,
      searchContents,
      rules,
      updateConsultationInformation,
      validateFields,
      filterData,
    };
  },
};
