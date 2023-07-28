import { ref, onMounted, computed } from "vue";
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
    const $quasar = useQuasar();
    const loading = ref(false);
    const deleteMultipleConsultation = ref([]);
    const searchConsultation = ref(null);
    const filterStatus = ref(null);
    const showSelect = ref(false);

    const statuses = ref([
      "Scheduled",
      "In Progress",
      "Completed",
      "Cancelled",
      "Rescheduled",
      "No Show",
      "Follow-up",
    ]);

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

    const addConsultation = () => {
      deleteMultipleConsultation.value = [];
      trigger.value.showAddConsultationModelDialog = true;
    };

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

    const deleteConsultationInformation = (id) => {
      $quasar.notify({
        message: "Are you sure you want to delete?",
        timeout: 0,
        color: "orange-8",
        actions: [
          {
            label: "DELETE",
            color: "white",
            handler: function () {
              let consultation_ids = id.map((ids) => ids.consultation_id);

              const consultationIDs = {
                ids: consultation_ids,
                action: "deleteConsultation",
              };

              loading.value = true;

              setTimeout(() => {
                deleteData(
                  "Consultation.php",
                  consultationIDs,
                  consultation,
                  "consultation_id"
                ).then((data) => {
                  if (data.status === "failed") {
                    showNotification($quasar, "negative", data.message, 200);
                  } else {
                    showNotification($quasar, "positive", data.message, 200);
                    searchConsultation.value = null;
                  }
                });

                loading.value = false;
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

    const clearSearch = () => {
      searchConsultation.value = null;
    };

    const checkInput = (e) => {
      if (e.target.value === "") {
        searchConsultation.value = null;
      }
    };

    const selectedConsultation = (value) => {
      getSpecificInformation(
        consultation,
        value.consultation_id,
        "consultation_id",
        consultationInformation
      );
    };

    const { getSelectedRecords: getSelectedConsultation } = useSelectedRecords(
      deleteMultipleConsultation,
      consultationLists
    );

    const { listPage: consultationListPage } = useListPage(
      specificConsultationInformation,
      searchConsultation,
      consultationLists
    );

    onMounted(() => {
      getAllDataList("Consultation.php", consultation);
    });

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
