import { computed, onMounted } from "vue";
import {
  consultationLists,
  doctorLists,
  patientLists,
  getAllDataList,
  doctor,
  patient,
  consultation,
} from "src/composables/Medicapp";
import { setActiveMenu } from "src/components/script/MainLayout";

export default {
  setup() {
    let dashboardFields = [
      {
        key: "doctor",
        title: "Doctor Information",
        label: "Number of Doctors",
        total: computed(() => doctorLists.value.length),
      },
      {
        key: "patient",
        title: "Patient Information",
        label: "Number of Patients",
        total: computed(() => patientLists.value.length),
      },
      {
        key: "consultation",
        title: "Consultation Information",
        label: "Number of Consultations",
        total: computed(() => consultationLists.value.length),
      },
    ];

    const moreInformation = (key, title) => {
      setTimeout(() => {
        setActiveMenu(title);
        window.location.href = `http://localhost:9000/#/home/${key}-information`;
      }, 1000);
    };

    onMounted(() => {
      getAllDataList("Doctor.php", doctor);
      getAllDataList("Patient.php", patient);
      getAllDataList("Consultation.php", consultation);
    });

    return { dashboardFields, moreInformation };
  },
};
