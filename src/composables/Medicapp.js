import { ref, readonly } from "vue";

// Base URL for the backend API.
const baseBackendURL =
  "https://medicappsystem.000webhostapp.com/medicapp-backend/";

// Debounce variable for search query.
let debounceTimer;

// An array container holding the results of the searched data.
export const searchContents = ref([]);

// Authentication token retrieved from localStorage.
const token = JSON.parse(localStorage.getItem("token"));

// User Account State
export const userAccount = ref([]);
export const searchUserName = ref([]);
export const userAccountList = readonly(userAccount);
export const userID = ref(0);
export const userEmail = ref(null);
export const userEmailVerificationPurpose = ref(null);

// Doctor State
export const doctor = ref([]);
export const doctorLists = readonly(doctor);
export const doctorInformation = ref([]);
export const specificDoctorInformation = readonly(doctorInformation);
export const searchDoctorContents = ref([]);

// Patient State
export const patient = ref([]);
export const patientLists = readonly(patient);
export const patientInformation = ref([]);
export const specificPatientInformation = readonly(patientInformation);

// Consultation State
export const consultation = ref([]);
export const consultationLists = readonly(consultation);
export const consultationInformation = ref([]);
export const specificConsultationInformation = readonly(
  consultationInformation
);

// Triggers State
export const trigger = ref({
  activeMenu: "",
  leftDrawerOpen: false,
  showLoginForm: true,
  showRegisterForm: false,
  showForgotPasswordEmailForm: false,
  showForgotPasswordPasswordForm: false,
  showAddDoctorModelDialog: false,
  showAddPatientModelDialog: false,
  showAddConsultationModelDialog: false,
  showUpdateDoctorModelDialog: false,
  showUpdatePatientModelDialog: false,
  showUpdateConsultationModelDialog: false,
  showEmailVerificationForm: false,
});

/**
 * loginFunction
 *
 * Performs a login request to the backend API.
 *
 * @param {Object} payload - The payload containing login credentials.
 * @returns {Promise} A Promise that resolves with the response data if the login is successful, otherwise rejects with an error.
 */
export const loginFunction = (payload) => {
  // Create a Promise that will perform the API request.
  return new Promise((resolve, reject) => {
    // Send a POST request to the backend API with login credentials in the payload.
    fetch(`${baseBackendURL}Login.php`, {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    })
      // Parse the response data as JSON.
      .then((response) => response.json())
      .then((data) => {
        // If login is successful, store the user token in the localStorage.
        if (data.status === "success") {
          localStorage.setItem("token", JSON.stringify(data.data));
        }
        // Resolve the Promise with the response data.
        resolve(data);
      })
      .catch((error) => {
        // Reject the Promise with an error if there's an issue with the request.
        reject(error);
      });
  });
};

/**
 * logoutFunction
 *
 * Performs a logout request to the backend API.
 *
 * @param {Object} payload - The payload for logout.
 * @returns {Promise} A Promise that resolves with the response data if the logout is successful, otherwise rejects with an error.
 */
export const logoutFunction = (payload) => {
  // Create a Promise that will perform the API request.
  return new Promise((resolve, reject) => {
    // Send a POST request to the backend API with the payload for logout.
    fetch(`${baseBackendURL}Login.php`, {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    })
      // Parse the response data as JSON.
      .then((response) => response.json())
      .then((data) => {
        // Resolve the Promise with the response data.
        resolve(data);
      })
      .catch((error) => {
        // Reject the Promise with an error if there's an issue with the request.
        reject(error);
      });
  });
};

/**
 * updateFunction
 *
 * Performs an update request to the backend API.
 *
 * @param {Object} payload - The payload containing data to be updated.
 * @returns {Promise} A Promise that resolves with the response data if the update is successful, otherwise rejects with an error.
 */
export const updateFunction = (payload) => {
  // Create a Promise that will perform the API request.
  return new Promise((resolve, reject) => {
    // Send a POST request to the backend API with the payload for update.
    fetch(`${baseBackendURL}Login.php`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      // Parse the response data as JSON.
      .then((response) => response.json())
      .then((data) => {
        // Resolve the Promise with the response data.
        resolve(data);
      })
      .catch((error) => {
        // Reject the Promise with an error if there's an issue with the request.
        reject(error);
      });
  });
};

/**
 * getAllDataList
 *
 * Retrieves all data from the backend API based on the specified path and stores it in the 'information' variable.
 *
 * @param {string} path - The path to the backend API endpoint.
 * @param {object} information - The object where the retrieved data will be stored.
 * @returns {Promise} A Promise that resolves with the response data if the request is successful, otherwise rejects with an error.
 */
export const getAllDataList = (path, information) => {
  // Create a Promise that will perform the API request.
  return new Promise((resolve, reject) => {
    // Send a GET request to the backend API with the provided path and token.
    fetch(`${baseBackendURL}${path}?token=${encodeURIComponent(token.token)}`, {
      method: "GET",
    })
      // Parse the response data as JSON.
      .then((response) => response.json())
      .then((data) => {
        // Check if the response status is 'success'.
        if (data.status === "success") {
          // If successful, store the retrieved data in the 'information' variable.
          information.value = data.data;
        }
        // Resolve the Promise with the response data.
        resolve(data);
      })
      .catch((error) => {
        // Reject the Promise with an error if there's an issue with the request.
        reject(error);
      });
  });
};

/**
 * getSpecificInformation
 *
 * Retrieves specific information from the 'data' object based on the provided payload and stores it in the 'result' variable.
 *
 * @param {object} data - The object containing the data to search in.
 * @param {string} payload - The value to be searched for in the 'data' object.
 * @param {string} id - The key to use for comparison with the 'payload'.
 * @param {object} result - The object where the matched information will be stored.
 */
export const getSpecificInformation = (data, payload, id, result) => {
  // Initialize the 'result' variable as an empty array to store the matched information
  result.value = [];

  // Find the index of the object in 'data.value' that matches the 'payload' using the 'id' key.
  let objectIndex = data.value.findIndex((e) => e[id] === payload);

  // Check if the object is found in 'data.value' based on the 'id' comparison.
  if (objectIndex !== -1) {
    // If a matching object is found, push it to the 'result' array
    result.value.push(data.value[objectIndex]);
  }
};

/**
 * getSearchResult
 *
 * Performs a search request to the backend API based on the provided payload and returns the search results.
 *
 * @param {object} payload - The payload containing the search parameters and path.
 * @returns {Promise} A Promise that resolves with the response data if the search is successful, otherwise rejects with an error.
 */
const getSearchResult = (payload) => {
  // Convert the search parameters in 'payload.params' to a URL-encoded string.
  const queryParams = new URLSearchParams(payload.params).toString();

  // Combine the base URL path and the URL-encoded search parameters to form the complete URL.
  const url = `${payload.path}&${queryParams}`;

  // Create a Promise that will perform the API request.
  return new Promise((resolve, reject) => {
    // Send a GET request to the backend API with the generated URL.
    fetch(url, {
      method: "GET",
    })
      // Parse the response data as JSON.
      .then((response) => response.json())
      .then((data) => {
        // Resolve the Promise with the response data.
        resolve(data);
      })
      .catch((error) => {
        // Reject the Promise with an error if there's an issue with the request.
        reject(error);
      });
  });
};

/**
 * filterData
 *
 * Filters data from the backend API based on the search 'val' and updates the 'searchDoctorContents' or 'searchContents' variables.
 *
 * @param {string} path - The path to the backend API endpoint.
 * @param {string} val - The value to be used for filtering the data.
 * @param {function} update - The function used for updating the 'searchDoctorContents' or 'searchContents' variable.
 * @param {function} abort - The function used for aborting the update.
 */
export const filterData = (path, val, update, abort) => {
  // Check if the search value 'val' is not empty.
  if (val.length > 0) {
    // Create a payload object with the search path and parameters.
    const payload = {
      path: `${baseBackendURL}${path}?token=${encodeURIComponent(token.token)}`,
      params: {
        searchKeyword: val,
      },
    };

    // Clear any existing debounce timer.
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new debounce timer.
    debounceTimer = setTimeout(() => {
      update(() => {
        // Perform the search using 'getSearchResult' function with the generated payload.
        getSearchResult(payload).then((data) => {
          // Check if the status is success.
          if (data.status === "success") {
            // Check if the search result is for "doctor".
            if (data.search === "doctor") {
              // If the search is for "doctor", update 'searchDoctorContents' variable with the search data.
              searchDoctorContents.value = data.data;
            } else {
              // Otherwise, update 'searchContents' variable with the search data.
              searchContents.value = data.data;
            }
          } else {
            // Otherwise, reset the array for doctor contents and other contents.
            searchDoctorContents.value = [];
            searchContents.value = [];
          }
        });
      });
    }, 500); // Adjust the debounce duration as needed (in milliseconds).
  } else {
    // If the search value 'val' is empty, call the 'abort' function to abort the update.
    abort();
  }
};

/**
 * addData
 *
 * Performs an add request to the backend API and adds the new data to the 'information' variable.
 *
 * @param {string} path - The path to the backend API endpoint.
 * @param {object} payload - The payload containing the data to be added.
 * @param {object} information - The object where the new data will be added.
 * @returns {Promise} A Promise that resolves with the response data if the addition is successful, otherwise rejects with an error.
 */
export const addData = (path, payload, information) => {
  // Create a Promise that will perform the API request.
  return new Promise((resolve, reject) => {
    // Perform a POST request to the backend API with the provided payload.
    fetch(`${baseBackendURL}${path}?token=${encodeURIComponent(token.token)}`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      // Parse the response as JSON.
      .then((response) => response.json())
      .then((data) => {
        // Check if the API response indicates a successful addition.
        if (data.status === "success") {
          // Add the new data to the 'information' variable.
          information.value.push(data.data);
        }
        // Resolve the Promise with the response data.
        resolve(data);
      })
      .catch((error) => {
        // Reject the Promise with an error if there's an issue with the request.
        reject(error);
      });
  });
};

/**
 * updateData
 *
 * Performs an update request to the backend API and updates the 'information' variable with the modified data.
 *
 * @param {string} path - The path to the backend API endpoint.
 * @param {object} payload - The payload containing the updated data.
 * @param {object} information - The object where the updated data will be stored.
 * @param {string} id - The key used for finding the object to update in the 'information' variable.
 * @returns {Promise} A Promise that resolves with the response data if the update is successful, otherwise rejects with an error.
 */
export const updateData = (path, payload, information, id) => {
  // Create a Promise that will perform the API request.
  return new Promise((resolve, reject) => {
    // Perform a POST request to the backend API with the provided payload.
    fetch(`${baseBackendURL}${path}?token=${encodeURIComponent(token.token)}`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      // Parse the response as JSON.
      .then((response) => response.json())
      .then((data) => {
        // Check if the API response indicates a successful update.
        if (data.status === "success") {
          // Find the index of the object to update in the 'information' variable.
          let objectIndex = information.value.findIndex(
            (e) => e[id] === payload[id]
          );
          // If index is found (not -1), update the object properties with the payload values.
          if (objectIndex !== -1) {
            Object.keys(information.value[objectIndex]).forEach((key) => {
              payload[key] &&
                (information.value[objectIndex][key] = payload[key]);
            });
          }
        }
        // Resolve the Promise with the response data.
        resolve(data);
      })
      .catch((error) => {
        // Reject the Promise with an error if there's an issue with the request.
        reject(error);
      });
  });
};

/**
 * deleteData
 *
 * Performs a delete request to the backend API and removes the deleted data from the 'information' variable.
 *
 * @param {string} path - The path to the backend API endpoint.
 * @param {object} payload - The payload containing the IDs of the data to be deleted.
 * @param {object} information - The object where the data will be deleted from.
 * @param {string} id - The key used for finding the objects to delete in the 'information' variable.
 * @returns {Promise} A Promise that resolves with the response data if the deletion is successful, otherwise rejects with an error.
 */
export const deleteData = (path, payload, information, id) => {
  // Create a Promise that will perform the API request.
  return new Promise((resolve, reject) => {
    // Perform a POST request to the backend API with the provided payload.
    fetch(`${baseBackendURL}${path}?token=${encodeURIComponent(token.token)}`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      // Parse the response as JSON.
      .then((response) => response.json())
      .then((data) => {
        // Check if the API response indicates a successful deletion.
        if (data.status === "success") {
          // Loop through the IDs in the payload and find the matching object index in 'information'.
          payload.ids.forEach((ids) => {
            let objectIndex = information.value.findIndex((e) => e[id] === ids);
            // If index is found (not -1), remove the object from the 'information' array.
            if (objectIndex !== -1) {
              information.value.splice(objectIndex, 1);
            }
          });
        }
        // Resolve the Promise with the response data.
        resolve(data);
      })
      .catch((error) => {
        // Reject the Promise with an error if there's an issue with the request.
        reject(error);
      });
  });
};
