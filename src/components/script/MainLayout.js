import EssentialLink from "src/components/main/EssentialLink.vue";
import { defineComponent, onMounted } from "vue";
import { useQuasar } from "quasar";
import {
  showNotification,
  setActiveMenu,
  activeMenu,
} from "src/composables/Utils.js";
import {
  trigger,
  getAllDataList,
  searchUserName,
  logoutFunction,
} from "src/composables/Medicapp.js";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    // Quasar instance for accessing Quasar plugins.
    const $quasar = useQuasar();

    // Object for the menu list.
    const linksList = [
      {
        title: "Dashboard",
        icon: "grid_view",
        //link: "http://localhost:9000/#/home/dashboard-information",
        link: "https://medicapp-system.netlify.app/#/home/dashboard-information",
      },
      {
        title: "Doctor Information",
        icon: "person",
        //link: "http://localhost:9000/#/home/doctor-information",
        link: "https://medicapp-system.netlify.app/#/home/doctor-information",
      },
      {
        title: "Patient Information",
        icon: "personal_injury",
        //link: "http://localhost:9000/#/home/patient-information",
        link: "https://medicapp-system.netlify.app/#/home/patient-information",
      },
      {
        title: "Consultation Information",
        icon: "description",
        //link: "http://localhost:9000/#/home/consultation-information",
        link: "https://medicapp-system.netlify.app/#/home/consultation-information",
      },
    ];

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
            window.location.href = "https://medicapp-system.netlify.app/#/";
            // window.location.href = "http://localhost:9000/#/";
            localStorage.removeItem("activeMenu");
          }, 1000);
        }
      });
    };

    /**
     * It highlights the menu that is currently clicked by the user.
     */
    if (activeMenu) {
      trigger.value.activeMenu = activeMenu;
    }

    /**
     * Executes the specified function when the component is mounted to the DOM.
     * In this case, it calls the `getAllDataList` function with the parameters "Login.php" and `searchUserName`.
     * This is used to fetch the user's username when the component is first rendered.
     *
     * If there is a previously stored active menu title in the local storage, it will be set as the active menu title using the 'trigger.value.activeMenu' variable.
     */
    onMounted(() => {
      // Fetch the list of user names from the server using 'getAllDataList' and store them in the 'searchUserName' variable.
      getAllDataList("Login.php", searchUserName);

      // Check if there is a previously stored active menu title in the local storage.
      if (activeMenu) {
        // If a previous active menu title is found, set it as the active menu title using 'trigger.value.activeMenu'.
        trigger.value.activeMenu = activeMenu;
      }
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
