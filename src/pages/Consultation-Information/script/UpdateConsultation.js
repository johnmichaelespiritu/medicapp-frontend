import { ref, watch, computed } from "vue";
import { useQuasar } from "quasar";
import {
  validateFields,
  compareInformation,
  showNotification,
  statuses,
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
    const $quasar = useQuasar();

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

    const consultationForm = ref({
      consultation_id: null,
      patient_id: null,
      doctor_id: null,
      ...Object.fromEntries(
        consultationFields.map((field) => [field.key, null])
      ),
    });

    const { selectedRecord: selectedPatient } = useSelectedRecord(
      searchContents,
      consultationForm,
      "patient_name"
    );

    const { selectedRecord: selectedDoctor } = useSelectedRecord(
      searchDoctorContents,
      consultationForm,
      "doctor_name"
    );

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

    const validateConsultationFormInputs = () => {
      return consultationFields.every((field) => {
        const value = consultationForm.value[field.key];

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

    const updateConsultationInformation = () => {
      const isConsultationFormUpdated = compareInformation(
        consultationForm,
        consultationFields,
        specificConsultationInformation
      );
      const isConsultationFormValid = validateConsultationFormInputs();

      if (isConsultationFormUpdated) {
        if (isConsultationFormValid) {
          if (selectedPatient.value) {
            consultationForm.value.patient_id =
              selectedPatient.value.patient_id;

            updateData(
              "Consultation.php",
              consultationForm.value,
              consultation,
              "consultation_id"
            ).then((response) => {
              if (response.status === "failed") {
                showNotification($quasar, "negative", response.data, 200);
              } else {
                showNotification(
                  $quasar,
                  "positive",
                  "Consultation updated successfully.",
                  200
                );
                trigger.value.showUpdateConsultationModelDialog = false;
              }
            });
          } else if (selectedDoctor.value) {
            consultationForm.value.doctor_id = selectedDoctor.value.doctor_id;

            updateData(
              "Consultation.php",
              consultationForm.value,
              consultation,
              "consultation_id"
            ).then((response) => {
              if (response.status === "failed") {
                showNotification($quasar, "negative", response.data, 200);
              } else {
                showNotification(
                  $quasar,
                  "positive",
                  "Consultation updated successfully.",
                  200
                );
                trigger.value.showUpdateConsultationModelDialog = false;
              }
            });
          } else {
            updateData(
              "Consultation.php",
              consultationForm.value,
              consultation,
              "consultation_id"
            ).then((response) => {
              if (response.status === "failed") {
                showNotification($quasar, "negative", response.data, 200);
              } else {
                showNotification(
                  $quasar,
                  "positive",
                  "Consultation updated successfully.",
                  200
                );
                trigger.value.showUpdateConsultationModelDialog = false;
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
