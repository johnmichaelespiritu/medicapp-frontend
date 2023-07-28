import { ref, onMounted } from "vue";
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
    const $quasar = useQuasar();
    const loading = ref(false);
    const deleteMultiplePatient = ref([]);
    const searchPatient = ref(null);

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

    const addPatient = () => {
      deleteMultiplePatient.value = [];
      trigger.value.showAddPatientModelDialog = true;
    };

    const updatePatient = (id) => {
      deleteMultiplePatient.value = [];
      trigger.value.showUpdatePatientModelDialog = true;
      getSpecificInformation(patient, id, "patient_id", patientInformation);
    };

    const deletePatientInformation = (id) => {
      $quasar.notify({
        message: "Are you sure you want to delete?",
        timeout: 0,
        color: "orange-8",
        actions: [
          {
            label: "DELETE",
            color: "white",
            handler: function () {
              let patient_ids = id.map((ids) => ids.patient_id);

              const patientIDs = {
                ids: patient_ids,
                action: "deletePatient",
              };

              loading.value = true;

              setTimeout(() => {
                deleteData(
                  "Patient.php",
                  patientIDs,
                  patient,
                  "patient_id"
                ).then((data) => {
                  if (data.status === "failed") {
                    showNotification($quasar, "negative", data.message, 200);
                  } else {
                    showNotification($quasar, "positive", data.message, 200);
                    searchPatient.value = null;
                  }
                });

                loading.value = false;
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

    const clearSearch = () => {
      searchPatient.value = null;
    };

    const checkInput = (e) => {
      if (e.target.value === "") {
        searchPatient.value = null;
      }
    };

    const selectedPatient = (value) => {
      getSpecificInformation(
        patient,
        value.patient_id,
        "patient_id",
        patientInformation
      );
    };

    const { getSelectedRecords: getSelectedPatient } = useSelectedRecords(
      deleteMultiplePatient,
      patientLists
    );

    const { listPage: patientListPage } = useListPage(
      specificPatientInformation,
      searchPatient,
      patientLists
    );

    onMounted(() => {
      getAllDataList("Patient.php", patient);
    });

    return {
      trigger,
      columns,
      patientLists,
      deleteMultiplePatient,
      loading,
      searchPatient,
      patientListPage,
      searchContents,
      addPatient,
      deletePatientInformation,
      updatePatient,
      getSelectedPatient,
      clearSearch,
      checkInput,
      selectedPatient,
      filterData,
    };
  },
};
