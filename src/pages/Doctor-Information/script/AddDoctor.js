import { ref } from "vue";
import { useQuasar } from "quasar";
import {
  validateFields,
  validateFormInputs,
  resetForm,
  showNotification,
  rules,
} from "src/composables/Utils.js";
import { trigger, addData, doctor } from "src/composables/Medicapp.js";

export default {
  setup() {
    // Quasar instance for accessing Quasar plugins.
    const $quasar = useQuasar();

    // Array of doctor fields and their labels.
    const doctorFields = [
      { key: "doctor_name", label: "Name" },
      { key: "specialization", label: "Specialization" },
      { key: "contact_number", label: "Contact Number" },
      { key: "email_address", label: "Email Address" },
      { key: "home_address", label: "Home Address" },
    ];

    // Object to store consultation form data.
    const doctorForm = ref(
      Object.fromEntries(doctorFields.map((field) => [field.key, null]))
    );

    /**
     * Function to validate the email address format.
     * @return {boolean} - True if the email is valid, otherwise False.
     */
    const validateEmail = () => {
      // Regular expression to validate the email format.
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (!emailRegex.test(doctorForm.value.email_address)) {
        // Check if the email matches the regular expression pattern.
        // Show a error notification if the email format is invalid.
        showNotification(
          $quasar,
          "negative",
          "Please enter a valid email address.",
          200
        );
        return false;
      } else {
        //Return true if the email address is valid.
        return true;
      }
    };

    /**
     * Handles the process of adding doctor information.
     */
    const addDoctorInformation = async () => {
      // Validates the form inputs and adds the doctor information if valid.
      const isDoctorFormValid = validateFormInputs(doctorForm, doctorFields);

      if (isDoctorFormValid) {
        // Validates the email address of the doctor if valid.
        const isEmailValid = validateEmail();

        if (isEmailValid) {
          // Set the action for the add doctor form.
          doctorForm.value.action = "addDoctor";
          // Call the addData function to add doctor data.
          addData("Doctor.php", doctorForm.value, doctor).then((data) => {
            if (data.status === "failed") {
              // Show error notification for failed attempt.
              showNotification($quasar, "negative", data.message, 200);
            } else {
              // Show success notification for successful addition.
              showNotification($quasar, "positive", data.message, 200);
              // Close the dialog and reset the form.
              trigger.value.showAddDoctorModelDialog = false;
              resetForm(doctorForm.value);
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
      doctorFields,
      doctorForm,
      trigger,
      rules,
      addDoctorInformation,
      validateFields,
      resetForm,
    };
  },
};
