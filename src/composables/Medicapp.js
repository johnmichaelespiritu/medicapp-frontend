import { ref, readonly } from "vue";
import axios from "axios";

// const baseBackendURL =
//   "http://localhost/medicapp/medicapp-frontend/medicapp-backend/";
const baseBackendURL =
  "https://medicappsystem.000webhostapp.com/medicapp-backend/";
export const searchContents = ref([]);

//Sign Up
export const userAccount = ref([]);
export const searchUserName = ref([]);
export const userAccountList = readonly(userAccount);
export const userID = ref(0);
export const userEmail = ref(null);
export const userEmailVerificationPurpose = ref(null);

//Doctor
export const doctor = ref([]);
export const doctorLists = readonly(doctor);
export const doctorInformation = ref([]);
export const specificDoctorInformation = readonly(doctorInformation);
export const searchDoctorContents = ref([]);

//Patient
export const patient = ref([]);
export const patientLists = readonly(patient);
export const patientInformation = ref([]);
export const specificPatientInformation = readonly(patientInformation);

//Consultation
export const consultation = ref([]);
export const consultationLists = readonly(consultation);
export const consultationInformation = ref([]);
export const specificConsultationInformation = readonly(
  consultationInformation
);

//Triggers
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

// User Account Functions
export const loginFunction = (payload) => {
  return new Promise((resolve, reject) => {
    fetch(`${baseBackendURL}Login.php`, {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          localStorage.setItem("token", JSON.stringify(data.data));
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const logoutFunction = (payload) => {
  return new Promise((resolve, reject) => {
    fetch(`${baseBackendURL}Login.php`, {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateFunction = (payload) => {
  return new Promise((resolve, reject) => {
    fetch(`${baseBackendURL}Login.php`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAllDataList = (path, information) => {
  return new Promise((resolve, reject) => {
    const token = JSON.parse(localStorage.getItem("token"));

    fetch(`${baseBackendURL}${path}?token=${encodeURIComponent(token.token)}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          information.value = data.data;
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getSpecificInformation = (data, payload, id, result) => {
  result.value = [];
  let objectIndex = data.value.findIndex((e) => e[id] === payload);
  if (objectIndex !== -1) {
    result.value.push(data.value[objectIndex]);
  }
};

const getSearchResult = (payload) => {
  return new Promise((resolve, reject) => {
    axios
      .get(payload.path, {
        withCredentials: true,
        params: payload.params,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const filterData = (path, val, update, abort) => {
  if (val.length > 0) {
    let payload = {
      path: `${baseBackendURL}${path}`,
      params: {
        searchKeyword: val,
      },
    };
    update(() => {
      getSearchResult(payload).then((response) => {
        if (response.search === "doctor") {
          searchDoctorContents.value = response.data;
        } else {
          searchContents.value = response.data;
        }
      });
    });
  } else {
    abort();
  }
};

export const addData = (path, payload, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseBackendURL}${path}`, payload, { withCredentials: true })
      .then((response) => {
        if (response.data.status === "success") {
          data.value.push(response.data.data);
        }
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateData = (path, payload, data, id) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${baseBackendURL}${path}`, payload, { withCredentials: true })
      .then((response) => {
        if (response.data.status === "success") {
          let objectIndex = data.value.findIndex((e) => e[id] === payload[id]);
          // if index not found (-1) update nothing !
          if (objectIndex !== -1) {
            Object.keys(data.value[objectIndex]).forEach((key) => {
              payload[key] && (data.value[objectIndex][key] = payload[key]);
            });
          }
        }
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteData = (path, payload, data, id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${baseBackendURL}${path}`, {
        data: { payload },
      })
      .then((response) => {
        if (response.data.status === "success") {
          payload.forEach((ids) => {
            let objectIndex = data.value.findIndex((e) => e[id] === ids);
            // if index not found (-1) delete nothing !
            if (objectIndex !== -1) {
              data.value.splice(objectIndex, 1);
            }
          });
        }
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
