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
    const $quasar = useQuasar();

    const patientFields = [
      { key: "patient_name", label: "Name" },
      { key: "patient_age", label: "Age" },
      { key: "patient_home_address", label: "Home Address" },
      { key: "patient_contact_number", label: "Contact Number" },
      { key: "patient_gender", label: "Gender" },
      { key: "patient_birthdate", label: "Birthdate" },
    ];

    const patientForm = ref({
      patient_id: null,
      ...Object.fromEntries(patientFields.map((field) => [field.key, null])),
    });

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

    const updatePatientInformation = () => {
      const isPatientFormUpdated = compareInformation(
        patientForm,
        patientFields,
        specificPatientInformation
      );
      const isPatientFormValid = validateFormInputs(patientForm, patientFields);

      if (isPatientFormUpdated) {
        if (isPatientFormValid) {
          updateData(
            "Patient.php",
            patientForm.value,
            patient,
            "patient_id"
          ).then((response) => {
            if (response.status === "failed") {
              showNotification($quasar, "negative", response.data, 200);
            } else {
              showNotification($quasar, "positive", response.data, 200);
              trigger.value.showUpdatePatientModelDialog = false;
            }
          });
        } else {
          showNotification($quasar, "negative", "Required field.", 200);
        }
      } else {
        showNotification($quasar, "info", "No update has been made.", 200);
      }
    };

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
