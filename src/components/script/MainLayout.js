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
    // Quasar instance for accessing Quasar plugins.
    const $quasar = useQuasar();

    /**
     * Toggles the left drawer open/close state.
     * This function is called when the "Menu" button is clicked.
     */
    const toggleLeftDrawer = () => {
      // Toggle the leftDrawerOpen value to open/close the left drawer.
      trigger.value.leftDrawerOpen = !trigger.value.leftDrawerOpen;
    };

    // Define the logout action object.
    const logout = {
      action: "logout",
    };

    /**
     * Handles the logout process when the "Sign Out" button is clicked.
     */
    const logOut = () => {
      // Call the logoutFunction and handle the response.
      logoutFunction(logout).then((data) => {
        // Handle failed logout status response.
        if (data.status === "failed") {
          setTimeout(() => {
            // Show error notification for unsuccessful logging out.
            showNotification($quasar, "failed", data.message, 200);
          }, 1000);
        } else {
          // Handle successful logout status response.
          setTimeout(() => {
            // Show success notification for successful logging out.
            showNotification($quasar, "positive", data.message, 200);
            // Redirect to the login page.
            window.location.href = "http://localhost:9000/#/";
          }, 1000);
        }
      });
    };

    /**
     * Executes the specified function when the component is mounted to the DOM.
     * In this case, it calls the `getAllDataList` function with the parameters "Login.php" and `searchUserName`.
     * This is used to fetch the user's username when the component is first rendered.
     */
    onMounted(() => {
      getAllDataList("Login.php", searchUserName);
    });

    // Return the reactive references and functions.
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
