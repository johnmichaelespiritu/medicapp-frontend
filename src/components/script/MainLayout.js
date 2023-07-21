import EssentialLink from "src/components/main/EssentialLink.vue";
import { defineComponent, onMounted } from "vue";
import { useQuasar } from "quasar";
import { showNotification } from "src/composables/Utils.js";
import {
  trigger,
  getAllDataList,
  searchUserName,
  logoutFunction,
} from "src/composables/Medicapp.js";

const linksList = [
  {
    title: "Dashboard",
    icon: "grid_view",
    link: "http://localhost:9000/#/home/dashboard-information",
  },
  {
    title: "Doctor Information",
    icon: "person",
    link: "http://localhost:9000/#/home/doctor-information",
  },
  {
    title: "Patient Information",
    icon: "personal_injury",
    link: "http://localhost:9000/#/home/patient-information",
  },
  {
    title: "Consultation Information",
    icon: "description",
    link: "http://localhost:9000/#/home/consultation-information",
  },
];

export const setActiveMenu = (title) => {
  trigger.value.activeMenu = title;
  localStorage.setItem("activeMenu", title);
};

// Retrieve active menu item from local storage
const activeMenu = localStorage.getItem("activeMenu");
if (activeMenu) {
  trigger.value.activeMenu = activeMenu;
}

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const $quasar = useQuasar();

    const toggleLeftDrawer = () => {
      trigger.value.leftDrawerOpen = !trigger.value.leftDrawerOpen;
    };

    // let setActiveMenu = (title) => {
    //   trigger.value.activeMenu = title;
    //   localStorage.setItem("activeMenu", title);
    // };

    // // Retrieve active menu item from local storage
    // let activeMenu = localStorage.getItem("activeMenu");
    // if (activeMenu) {
    //   trigger.value.activeMenu = activeMenu;
    // }

    const logOut = () => {
      logoutFunction("logout");
      setTimeout(() => {
        showNotification($quasar, "positive", "Sign out successfully.", 200);
        window.location.href = "http://localhost:9000/#/";
        // window.history.replaceState(null, "", window.location.href);
      }, 1000);
    };

    onMounted(() => {
      getAllDataList("Login.php", searchUserName);
    });

    return {
      userName: searchUserName,
      essentialLinks: linksList,
      trigger,
      toggleLeftDrawer,
      setActiveMenu,
      logOut,
    };
  },
});
