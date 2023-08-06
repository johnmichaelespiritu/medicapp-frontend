import { ref, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import AddPatient from "src/pages/Patient-Information/components/AddPatient.vue";
import UpdatePatient from "src/pages/Patient-Information/components/UpdatePatient.vue";
import {
  showNotification,
  useSelectedRecords,
  useListPage,
} from "src/composables/Utils.js";
import {
  patientLists,
  trigger,
  getAllDataList,
  getSpecificInformation,
  deleteData,
  patient,
  patientInformation,
  specificPatientInformation,
  filterData,
  searchContents,
} from "src/composables/Medicapp.js";

export default {
  components: {
    AddPatient,
    UpdatePatient,
  },

  setup() {
    // Quasar instance for accessing Quasar plugins.
    const $quasar = useQuasar();

    // Variables to manage state and data.
    const loading = ref(false);
    const deleteMultiplePatient = ref([]);
    const searchPatient = ref(null);
    const screenWidth = ref(window.innerWidth);

    // Configuration for the columns in the patient table.
    const columns = [
      {
        name: "patient_name",
        required: true,
        label: "Name",
        align: "center",
        field: (row) => row.name,
        format: (val) => `${val}`,
        field: "patient_name",
        sortable: true,
      },
      {
        name: "patient_age",
        align: "center",
        label: "Age",
        field: "patient_age",
        sortable: true,
      },
      {
        name: "patient_home_address",
        align: "center",
        label: "Home Address",
        field: "patient_home_address",
      },
      {
        name: "patient_contact_number",
        align: "center",
        label: "Contact Number",
        field: "patient_contact_number",
      },
      {
        name: "patient_gender",
        align: "center",
        label: "Gender",
        field: "patient_gender",
      },
      {
        name: "patient_birthdate",
        align: "center",
        label: "Birthdate",
        field: "patient_birthdate",
      },
      { name: "action", align: "center", label: "Action", field: "action" },
    ];

    // visibleColumns is a reactive reference to the columns that are currently visible in the table.
    const visibleColumns = ref(
      screenWidth.value < 768
        ? columns.filter((col) =>
            ["patient_name", "patient_age", "action"].includes(col.name)
          )
        : columns
    );

    /**
     * handleResize is a function that is called when the window is resized.
     * It updates the visibleColumns based on the current window width.
     * If the window width is less than 768 pixels, it filters the columns to only display specific ones.
     */
    const handleResize = () => {
      // Update the screenWidth value with the current window width.
      screenWidth.value = window.innerWidth;

      // Check if the window width is less than 768 pixels.
      if (screenWidth.value < 768) {
        // If the window width is less than 768 pixels, only display specific columns (doctor_name, specialization, and action).
        visibleColumns.value = columns.filter((col) =>
          ["patient_name", "patient_age", "action"].includes(col.name)
        );
      } else {
        // If the window width is 768 pixels or more, display all columns.
        visibleColumns.value = columns;
      }
    };

    /**
     * Adds a new patient.
     * Sets the trigger value into true to open the "Add Patient" dialog.
     */
    const addPatient = () => {
      deleteMultiplePatient.value = [];
      trigger.value.showAddPatientModelDialog = true;
    };

    /**
     * Updates an existing patient.
     * Sets the trigger value into true to open the "Update Patient" dialog and fetches the patient details.
     * @param {number} id - The ID of the patient to update.
     */
    const updatePatient = (id) => {
      deleteMultiplePatient.value = [];
      trigger.value.showUpdatePatientModelDialog = true;
      getSpecificInformation(patient, id, "patient_id", patientInformation);
    };

    /**
     * Deletes a list of patients.
     * Shows a confirmation dialog and then performs the delete operation.
     * @param {Array} id - An array of patient IDs to delete.
     */
    const deletePatientInformation = (id) => {
      // Show a notification dialog to confirm the deletion.
      $quasar.notify({
        message: "Are you sure you want to delete?",
        timeout: 0,
        color: "orange-8",
        actions: [
          {
            label: "DELETE",
            color: "white",
            handler: function () {
              // Extract an array of patient IDs from the input 'id' array.
              let patient_ids = id.map((ids) => ids.patient_id);

              // Create an object containing the patient IDs and the action to be performed.
              const patientIDs = {
                ids: patient_ids,
                action: "deletePatient",
              };

              // Set the 'loading' value to true to indicate that the deletion is in progress.
              loading.value = true;

              setTimeout(() => {
                // Handles the process of deleting selected patients.
                deleteData(
                  "Patient.php",
                  patientIDs,
                  patient,
                  "patient_id"
                ).then((data) => {
                  if (data.status === "failed") {
                    // Show error notification for failed attempt.
                    showNotification($quasar, "negative", data.message, 200);
                  } else {
                    // Show success notification for successful deletion.
                    showNotification($quasar, "positive", data.message, 200);
                    // Clear the searchConsultation value to refresh the data.
                    searchPatient.value = null;
                  }
                });

                // Set the 'loading' value to false after the deletion operation is completed.
                loading.value = false;
                // Clear the deleteMultipleDoctor array.
                deleteMultiplePatient.value = [];
              }, 500);
            },
          },
          {
            label: "CANCEL",
            color: "white",
          },
        ],
      });
    };

    /**
     * Clears the search input value.
     * Resets the searchPatient variable to null.
     */
    const clearSearch = () => {
      searchPatient.value = null;
      searchContents.value = [];
    };

    /**
     * Checks if the search input is empty and sets searchPatient to null if it is.
     * @param {Event} e - The blur event.
     */
    const checkInput = (e) => {
      if (e.target.value === "") {
        searchPatient.value = null;
        searchContents.value = [];
      }
    };

    /**
     * Function called when a patient is selected in the search input.
     * Fetches the specific information of the selected patient.
     * @param {Object} value - The selected patient object.
     */
    const selectedPatient = (value) => {
      getSpecificInformation(
        patient,
        value.patient_id,
        "patient_id",
        patientInformation
      );
    };

    /**
     * Gets the message for the number of selected records and the total number of records in a list.
     */
    const { getSelectedRecords: getSelectedPatient } = useSelectedRecords(
      deleteMultiplePatient,
      patientLists
    );

    /**
     * Filters and returns the list of records based on specific information and search value.
     */
    const { listPage: patientListPage } = useListPage(
      specificPatientInformation,
      searchPatient,
      patientLists
    );

    /**
     * Executes the specified function when the component is mounted to the DOM.
     */
    onMounted(() => {
      // Get all the data list from the server for patients and store it in the 'patient' variable.
      getAllDataList("Patient.php", patient);

      // Add an event listener to the window object to detect resize events and call the handleResize function.
      window.addEventListener("resize", handleResize);
    });

    /**
     * Executes the specified function before the component is unnmounted from the DOM.
     */
    onBeforeUnmount(() => {
      // Remove the event listener for resize events when the component is about to be unmounted.
      window.removeEventListener("resize", handleResize);
    });

    // Return the reactive references and functions.
    return {
      trigger,
      columns,
      patientLists,
      deleteMultiplePatient,
      loading,
      searchPatient,
      patientListPage,
      searchContents,
      visibleColumns,
      getSelectedPatient,
      addPatient,
      deletePatientInformation,
      updatePatient,
      clearSearch,
      checkInput,
      selectedPatient,
      filterData,
    };
  },
};
