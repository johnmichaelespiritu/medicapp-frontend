import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import AddDoctor from "src/pages/Doctor-Information/components/AddDoctor.vue";
import UpdateDoctor from "src/pages/Doctor-Information/components/UpdateDoctor.vue";
import {
  showNotification,
  useSelectedRecords,
  useListPage,
} from "src/composables/Utils.js";
import {
  doctorLists,
  trigger,
  getAllDataList,
  getSpecificInformation,
  deleteData,
  doctor,
  doctorInformation,
  specificDoctorInformation,
  filterData,
  searchDoctorContents,
} from "src/composables/Medicapp.js";

export default {
  components: {
    AddDoctor,
    UpdateDoctor,
  },

  setup() {
    // Quasar instance for accessing Quasar plugins.
    const $quasar = useQuasar();

    // Variables to manage state and data.
    const loading = ref(false);
    const deleteMultipleDoctor = ref([]);
    const searchDoctor = ref(null);

    // Configuration for the columns in the doctor table.
    const columns = [
      {
        name: "doctor_name",
        required: true,
        label: "Name",
        align: "center",
        field: (row) => row.name,
        format: (val) => `${val}`,
        field: "doctor_name",
        sortable: true,
      },
      {
        name: "specialization",
        align: "center",
        label: "Specialization",
        field: "specialization",
        sortable: true,
      },
      {
        name: "contact_number",
        align: "center",
        label: "Contact Number",
        field: "contact_number",
      },
      {
        name: "email_address",
        align: "center",
        label: "Email Address",
        field: "email_address",
      },
      {
        name: "home_address",
        align: "center",
        label: "Home Address",
        field: "home_address",
      },
      { name: "action", align: "center", label: "Action", field: "action" },
    ];

    /**
     * Adds a new doctor.
     * Sets the trigger value into true to open the "Add Doctor" dialog.
     */
    const addDoctor = () => {
      deleteMultipleDoctor.value = [];
      trigger.value.showAddDoctorModelDialog = true;
    };

    /**
     * Updates an existing doctor.
     * Sets the trigger value into true to open the "Update Doctor" dialog and fetches the doctor details.
     * @param {number} id - The ID of the doctor to update.
     */
    const updateDoctor = (id) => {
      deleteMultipleDoctor.value = [];
      trigger.value.showUpdateDoctorModelDialog = true;
      getSpecificInformation(doctor, id, "doctor_id", doctorInformation);
    };

    /**
     * Deletes a list of doctors.
     * Shows a confirmation dialog and then performs the delete operation.
     * @param {Array} id - An array of doctor IDs to delete.
     */
    const deleteDoctorInformation = (id) => {
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
              // Extract an array of doctor IDs from the input 'id' array.
              let doctor_ids = id.map((ids) => ids.doctor_id);

              // Create an object containing the doctor IDs and the action to be performed.
              const doctorIDs = {
                ids: doctor_ids,
                action: "deleteDoctor",
              };

              // Set the 'loading' value to true to indicate that the deletion is in progress.
              loading.value = true;

              setTimeout(() => {
                // Handles the process of deleting selected doctors.
                deleteData("Doctor.php", doctorIDs, doctor, "doctor_id").then(
                  (data) => {
                    if (data.status === "failed") {
                      // Show error notification for failed attempt.
                      showNotification($quasar, "negative", data.message, 200);
                    } else {
                      // Show success notification for successful deletion.
                      showNotification($quasar, "positive", data.message, 200);
                      // Clear the searchConsultation value to refresh the data.
                      searchDoctor.value = null;
                    }
                  }
                );

                // Set the 'loading' value to false after the deletion operation is completed.
                loading.value = false;
                // Clear the deleteMultipleDoctor array.
                deleteMultipleDoctor.value = [];
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
     * Resets the searchDoctor variable to null.
     */
    const clearSearch = () => {
      searchDoctor.value = null;
    };

    /**
     * Checks if the search input is empty and sets searchDoctor to null if it is.
     * @param {Event} e - The blur event.
     */
    const checkInput = (e) => {
      if (e.target.value === "") {
        searchDoctor.value = null;
      }
    };

    /**
     * Function called when a doctor is selected in the search input.
     * Fetches the specific information of the selected doctor.
     * @param {Object} value - The selected doctor object.
     */
    const selectedDoctor = (value) => {
      getSpecificInformation(
        doctor,
        value.doctor_id,
        "doctor_id",
        doctorInformation
      );
    };

    /**
     * Gets the message for the number of selected records and the total number of records in a list.
     */
    const { getSelectedRecords: getSelectedDoctor } = useSelectedRecords(
      deleteMultipleDoctor,
      doctorLists
    );

    /**
     * Filters and returns the list of records based on specific information and search value.
     */
    const { listPage: doctorListPage } = useListPage(
      specificDoctorInformation,
      searchDoctor,
      doctorLists
    );

    /**
     * Executes the specified function when the component is mounted to the DOM.
     * In this case, it calls the `getAllDataList` function with the parameters "Consultation.php" and `doctor`.
     * This is used to fetch all the doctor lists when the component is first rendered.
     */
    onMounted(() => {
      getAllDataList("Doctor.php", doctor);
    });

    // Return the reactive references and functions.
    return {
      trigger,
      columns,
      doctorLists,
      deleteMultipleDoctor,
      loading,
      searchDoctor,
      doctorListPage,
      searchDoctorContents,
      addDoctor,
      deleteDoctorInformation,
      updateDoctor,
      getSelectedDoctor,
      clearSearch,
      checkInput,
      selectedDoctor,
      filterData,
    };
  },
};
