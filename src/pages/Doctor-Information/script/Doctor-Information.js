import { ref, onMounted, onBeforeUnmount } from "vue";
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
    const screenWidth = ref(window.innerWidth);

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
        class: "hide-on-mobile",
      },
      {
        name: "email_address",
        align: "center",
        label: "Email Address",
        field: "email_address",
        class: "hide-on-mobile",
      },
      {
        name: "home_address",
        align: "center",
        label: "Home Address",
        field: "home_address",
        class: "hide-on-mobile",
      },
      { name: "action", align: "center", label: "Action", field: "action" },
    ];

    // visibleColumns is a reactive reference to the columns that are currently visible in the table.
    const visibleColumns = ref(
      screenWidth.value < 768
        ? columns.filter((col) =>
            ["doctor_name", "specialization", "action"].includes(col.name)
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
          ["doctor_name", "specialization", "action"].includes(col.name)
        );
      } else {
        // If the window width is 768 pixels or more, display all columns.
        visibleColumns.value = columns;
      }
    };

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
      searchDoctorContents.value = [];
    };

    /**
     * Checks if the search input is empty and sets searchDoctor to null if it is.
     * @param {Event} e - The blur event.
     */
    const checkInput = (e) => {
      if (e.target.value === "") {
        searchDoctor.value = null;
        searchDoctorContents.value = [];
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
     */
    onMounted(() => {
      // Get all the data list from the server for doctors and store it in the 'doctor' variable.
      getAllDataList("Doctor.php", doctor);

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
      doctorLists,
      deleteMultipleDoctor,
      loading,
      searchDoctor,
      doctorListPage,
      searchDoctorContents,
      visibleColumns,
      getSelectedDoctor,
      addDoctor,
      deleteDoctorInformation,
      updateDoctor,
      clearSearch,
      checkInput,
      selectedDoctor,
      filterData,
    };
  },
};
