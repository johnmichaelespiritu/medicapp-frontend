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
    const $quasar = useQuasar();
    const loading = ref(false);
    const deleteMultipleDoctor = ref([]);
    const searchDoctor = ref(null);

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

    const addDoctor = () => {
      deleteMultipleDoctor.value = [];
      trigger.value.showAddDoctorModelDialog = true;
    };

    const updateDoctor = (id) => {
      deleteMultipleDoctor.value = [];
      trigger.value.showUpdateDoctorModelDialog = true;
      getSpecificInformation(doctor, id, "doctor_id", doctorInformation);
    };

    const deleteDoctorInformation = (id) => {
      $quasar.notify({
        message: "Are you sure you want to delete?",
        timeout: 0,
        color: "orange-8",
        actions: [
          {
            label: "DELETE",
            color: "white",
            handler: function () {
              let doctor_ids = id.map((ids) => ids.doctor_id);

              const doctorIDs = {
                doctor_ids: doctor_ids,
                action: "deleteDoctor",
              };

              loading.value = true;

              setTimeout(() => {
                deleteData("Doctor.php", doctorIDs, doctor, "doctor_id").then(
                  (data) => {
                    if (data.status === "failed") {
                      showNotification($quasar, "negative", data.message, 200);
                    } else {
                      showNotification($quasar, "positive", data.message, 200);
                      searchDoctor.value = null;
                    }
                  }
                );

                loading.value = false;
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

    const clearSearch = () => {
      searchDoctor.value = null;
    };

    const checkInput = (e) => {
      if (e.target.value === "") {
        searchDoctor.value = null;
      }
    };

    const selectedDoctor = (value) => {
      getSpecificInformation(
        doctor,
        value.doctor_id,
        "doctor_id",
        doctorInformation
      );
    };

    const { getSelectedRecords: getSelectedDoctor } = useSelectedRecords(
      deleteMultipleDoctor,
      doctorLists
    );

    const { listPage: doctorListPage } = useListPage(
      specificDoctorInformation,
      searchDoctor,
      doctorLists
    );

    onMounted(() => {
      getAllDataList("Doctor.php", doctor);
    });

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
