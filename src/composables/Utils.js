import { computed } from "vue";

export const genderOptions = ["Male", "Female", "Others"];

export const statuses = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
  "Rescheduled",
  "No Show",
  "Follow-up",
];

export const rules = [(val) => (val && val.length > 0) || ""];

export const validateFields = (field) => {
  return (val) =>
    (val !== null && val !== "") || `Please input the ${field.label}.`;
};

export const validateFormInputs = (form, fields) => {
  return fields.every((field) => {
    let value = form.value[field.key];
    return value && value.length > 0;
  });
};

export const compareInformation = (form, fields, specificInformation) => {
  return fields.some((field) => {
    return form.value[field.key] !== specificInformation.value[0][field.key];
  });
};

export const resetForm = (form) => {
  for (let fields in form) {
    form[fields] = null;
  }
};

export const validateAge = (event) => {
  const key = event.key;
  const allowedKeys = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "Backspace",
    "Delete",
  ];
  if (!allowedKeys.includes(key)) {
    event.preventDefault();
  }
};

export const showNotification = ($quasar, type, message, timeout) => {
  $quasar.notify({
    type,
    message,
    timeout,
  });
};

export const getSelectedRecord = (deleteMultipleValue, recordLists) => {
  return deleteMultipleValue.value.length === 0
    ? ""
    : `${deleteMultipleValue.value.length} record${
        deleteMultipleValue.value.length > 1 ? "s" : ""
      } selected of ${recordLists.value.length}`;
};

export const useSelectedRecords = (deleteMultipleValue, recordLists) => {
  const getSelectedRecords = () => {
    const recordSelectedCount = deleteMultipleValue.value.length;
    const recordCount = recordLists.value.length;

    let message = "";

    if (recordSelectedCount > 0) {
      message = `${recordSelectedCount} record${
        recordSelectedCount > 1 ? "s" : ""
      } selected of ${recordCount}`;
    }

    return `${message}`;
  };

  return {
    getSelectedRecords,
  };
};

export const useListPage = (specificInformation, searchValue, listValue) => {
  const listPage = computed(() => {
    let list = [];

    if (specificInformation.value.length) {
      list = specificInformation.value;
    }

    if (searchValue.value === null) {
      list = listValue.value;
    }

    return list;
  });

  return {
    listPage,
  };
};

export const useSelectedRecord = (searchContents, form, recordProperty) => {
  const selectedRecord = computed(() => {
    return searchContents.value.find(
      (record) => record[recordProperty] === form.value[recordProperty]
    );
  });

  return {
    selectedRecord,
  };
};
