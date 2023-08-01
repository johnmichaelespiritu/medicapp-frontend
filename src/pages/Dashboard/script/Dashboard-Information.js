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
    // The dashboardFields array contains objects representing different dashboard fields.
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

    /**
     * The moreInformation function is triggered when the "More Information" chip is clicked for a specific dashboard field.
     * It sets the active menu and navigates to the corresponding page with a slight delay for a better user experience.
     * @param {string} key - The key of the selected dashboard field.
     * @param {string} title - The title of the selected dashboard field.
     */
    const moreInformation = (key, title) => {
      setTimeout(() => {
        setActiveMenu(title);
        window.location.href = `https://medicapp-system.netlify.app/#/home/${key}-information`;
        // window.location.href = `http://localhost:9000/#/home/${key}-information`;
      }, 1000);
    };

    /**
     * Executes the specified function when the component is mounted to the DOM.
     * It retrieves and populates the lists for doctors, patients, and consultations.
     */
    onMounted(() => {
      getAllDataList("Doctor.php", doctor);
      getAllDataList("Patient.php", patient);
      getAllDataList("Consultation.php", consultation);
    });

    // Return the reactive references and functions.
    return { dashboardFields, moreInformation };
  },
};
