import { ref, readonly } from "vue";

// const baseBackendURL =
//   "http://localhost/medicapp/medicapp-frontend/medicapp-backend/";
const baseBackendURL =
  "https://medicappsystem.000webhostapp.com/medicapp-backend/";
export const searchContents = ref([]);
const token = JSON.parse(localStorage.getItem("token"));

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
  const queryParams = new URLSearchParams(payload.params).toString();
  const url = `${payload.path}&${queryParams}`;

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
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

export const filterData = (path, val, update, abort) => {
  if (val.length > 0) {
    let payload = {
      path: `${baseBackendURL}${path}?token=${encodeURIComponent(token.token)}`,
      params: {
        searchKeyword: val,
      },
    };
    update(() => {
      getSearchResult(payload).then((data) => {
        if (data.search === "doctor") {
          searchDoctorContents.value = data.data;
        } else {
          searchContents.value = data.data;
        }
      });
    });
  } else {
    abort();
  }
};

export const addData = (path, payload, information) => {
  return new Promise((resolve, reject) => {
    fetch(`${baseBackendURL}${path}?token=${encodeURIComponent(token.token)}`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          information.value.push(data.data);
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateData = (path, payload, information, id) => {
  return new Promise((resolve, reject) => {
    fetch(`${baseBackendURL}${path}?token=${encodeURIComponent(token.token)}`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          let objectIndex = information.value.findIndex(
            (e) => e[id] === payload[id]
          );
          // if index not found (-1) update nothing !
          if (objectIndex !== -1) {
            Object.keys(information.value[objectIndex]).forEach((key) => {
              payload[key] &&
                (information.value[objectIndex][key] = payload[key]);
            });
          }
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteData = (path, payload, information, id) => {
  return new Promise((resolve, reject) => {
    fetch(`${baseBackendURL}${path}?token=${encodeURIComponent(token.token)}`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          payload.ids.forEach((ids) => {
            let objectIndex = information.value.findIndex((e) => e[id] === ids);
            // if index not found (-1) delete nothing !
            if (objectIndex !== -1) {
              information.value.splice(objectIndex, 1);
            }
          });
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
