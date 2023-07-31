import { ref, onMounted } from "vue";
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
        label: "Name",
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
        name: "complaints",
        align: "center",
        label: "Complaints",
        field: "complaints",
        classes: "ellipsis",
        style: "max-width: 50px",
      },
      {
        name: "diagnosis",
        align: "center",
        label: "Diagnosis",
        field: "diagnosis",
        classes: "ellipsis",
        style: "max-width: 50px",
      },
      {
        name: "treatment",
        align: "center",
        label: "Treatment",
        field: "treatment",
        classes: "ellipsis",
        style: "max-width: 50px",
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
    };

    /**
     * Checks if the search input is empty and sets searchConsultation to null if it is.
     * @param {Event} e - The blur event.
     */
    const checkInput = (e) => {
      if (e.target.value === "") {
        searchConsultation.value = null;
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
     * In this case, it calls the `getAllDataList` function with the parameters "Consultation.php" and `consultation`.
     * This is used to fetch all the consultation lists when the component is first rendered.
     */
    onMounted(() => {
      getAllDataList("Consultation.php", consultation);
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
      addConsultation,
      clearSearch,
      checkInput,
      deleteConsultationInformation,
      getSelectedConsultation,
      selectedConsultation,
      updateConsultation,
      filterData,
    };
  },
};
