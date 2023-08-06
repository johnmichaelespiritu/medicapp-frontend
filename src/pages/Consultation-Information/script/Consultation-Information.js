import { ref, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import AddConsultation from "src/pages/Consultation-Information/components/AddConsultation.vue";
import UpdateConsultation from "src/pages/Consultation-Information/components/UpdateConsultation.vue";
import {
  showNotification,
  useSelectedRecords,
  useListPage,
} from "src/composables/Utils.js";
import {
  consultationLists,
  trigger,
  getAllDataList,
  getSpecificInformation,
  deleteData,
  consultation,
  consultationInformation,
  specificConsultationInformation,
  filterData,
  searchContents,
} from "src/composables/Medicapp.js";

export default {
  components: {
    AddConsultation,
    UpdateConsultation,
  },

  setup() {
    // Quasar instance for accessing Quasar plugins.
    const $quasar = useQuasar();

    // Variables to manage state and data.
    const loading = ref(false);
    const deleteMultipleConsultation = ref([]);
    const searchConsultation = ref(null);
    const filterStatus = ref(null);
    const showSelect = ref(false);
    const screenWidth = ref(window.innerWidth);

    // Array of consultation statuses.
    const statuses = ref([
      "Scheduled",
      "In Progress",
      "Completed",
      "Cancelled",
      "Rescheduled",
      "No Show",
      "Follow-up",
    ]);

    // Configuration for the columns in the consultation table.
    const columns = [
      {
        name: "patient_name",
        required: true,
        label: "Patient Name",
        align: "center",
        field: (row) => row.name,
        format: (val) => `${val}`,
        field: "patient_name",
        sortable: true,
      },
      {
        name: "doctor_name",
        align: "center",
        label: "Doctor Name",
        field: "doctor_name",
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
        name: "patient_contact_number",
        align: "center",
        label: "Contact Number",
        field: "patient_contact_number",
      },
      {
        name: "status",
        align: "center",
        label: "Status",
        field: "status",
      },
      {
        name: "consultation_date",
        align: "center",
        label: "Consultation Date",
        field: "consultation_date",
      },
      { name: "action", align: "center", label: "Action", field: "action" },
    ];

    // visibleColumns is a reactive reference to the columns that are currently visible in the table.
    const visibleColumns = ref(
      screenWidth.value < 768
        ? columns.filter((col) =>
            ["patient_name", "status", "consultation_date", "action"].includes(
              col.name
            )
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
          ["patient_name", "status", "consultation_date", "action"].includes(
            col.name
          )
        );
      } else {
        // If the window width is 768 pixels or more, display all columns.
        visibleColumns.value = columns;
      }
    };

    /**
     * Adds a new consultation.
     * Sets the trigger value into true to open the "Add Consultation" dialog.
     */
    const addConsultation = () => {
      deleteMultipleConsultation.value = [];
      trigger.value.showAddConsultationModelDialog = true;
    };

    /**
     * Updates an existing consultation.
     * Sets the trigger value into true to open the "Update Consultation" dialog and fetches the consultation details.
     * @param {number} id - The ID of the consultation to update.
     */
    const updateConsultation = (id) => {
      deleteMultipleConsultation.value = [];
      trigger.value.showUpdateConsultationModelDialog = true;
      getSpecificInformation(
        consultation,
        id,
        "consultation_id",
        consultationInformation
      );
    };

    /**
     * Deletes a list of consultations.
     * Shows a confirmation dialog and then performs the delete operation.
     * @param {Array} id - An array of consultation IDs to delete.
     */
    const deleteConsultationInformation = (id) => {
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
              // Extract an array of consultation IDs from the input 'id' array.
              let consultation_ids = id.map((ids) => ids.consultation_id);

              // Create an object containing the consultation IDs and the action to be performed.
              const consultationIDs = {
                ids: consultation_ids,
                action: "deleteConsultation",
              };

              // Set the 'loading' value to true to indicate that the deletion is in progress.
              loading.value = true;

              setTimeout(() => {
                // Handles the process of deleting selected consultations.
                deleteData(
                  "Consultation.php",
                  consultationIDs,
                  consultation,
                  "consultation_id"
                ).then((data) => {
                  if (data.status === "failed") {
                    // Show error notification for failed attempt.
                    showNotification($quasar, "negative", data.message, 200);
                  } else {
                    // Show success notification for successful deletion.
                    showNotification($quasar, "positive", data.message, 200);
                    // Clear the searchConsultation value to refresh the data.
                    searchConsultation.value = null;
                  }
                });

                // Set the 'loading' value to false after the deletion operation is completed.
                loading.value = false;
                // Clear the deleteMultipleConsultation array.
                deleteMultipleConsultation.value = [];
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
     * Resets the searchConsultation variable to null.
     */
    const clearSearch = () => {
      searchConsultation.value = null;
      searchContents.value = [];
    };

    /**
     * Checks if the search input is empty and sets searchConsultation to null if it is.
     * @param {Event} e - The blur event.
     */
    const checkInput = (e) => {
      if (e.target.value === "") {
        searchConsultation.value = null;
        searchContents.value = [];
      }
    };

    /**
     * Function called when a consultation is selected in the search input.
     * Fetches the specific information of the selected consultation.
     * @param {Object} value - The selected consultation object.
     */
    const selectedConsultation = (value) => {
      getSpecificInformation(
        consultation,
        value.consultation_id,
        "consultation_id",
        consultationInformation
      );
    };

    /**
     * Gets the message for the number of selected records and the total number of records in a list.
     */
    const { getSelectedRecords: getSelectedConsultation } = useSelectedRecords(
      deleteMultipleConsultation,
      consultationLists
    );

    /**
     * Filters and returns the list of records based on specific information and search value.
     */
    const { listPage: consultationListPage } = useListPage(
      specificConsultationInformation,
      searchConsultation,
      consultationLists
    );

    /**
     * Executes the specified function when the component is mounted to the DOM.
     */
    onMounted(() => {
      // Get all the data list from the server for consultations and store it in the 'consultation' variable.
      getAllDataList("Consultation.php", consultation);

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
      showSelect,
      columns,
      consultationLists,
      consultationListPage,
      deleteMultipleConsultation,
      loading,
      searchConsultation,
      filterStatus,
      statuses,
      trigger,
      searchContents,
      visibleColumns,
      getSelectedConsultation,
      addConsultation,
      clearSearch,
      checkInput,
      deleteConsultationInformation,
      selectedConsultation,
      updateConsultation,
      filterData,
    };
  },
};
