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

    const logout = {
      action: "logout",
    };

    const logOut = () => {
      logoutFunction(logout).then((data) => {
        if (data.status === "failed") {
          setTimeout(() => {
            showNotification($quasar, "failed", data.message, 200);
          }, 1000);
        } else {
          setTimeout(() => {
            showNotification($quasar, "positive", data.message, 200);
            window.location.href = "http://localhost:9000/#/";
          }, 1000);
        }
      });
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
