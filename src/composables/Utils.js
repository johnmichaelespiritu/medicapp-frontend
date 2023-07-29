import { computed } from "vue";

// An array of strings representing gender options available in the application.
export const genderOptions = ["Male", "Female", "Others"];

// An array of strings representing different statuses for consultations in the application.
export const statuses = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
  "Rescheduled",
  "No Show",
  "Follow-up",
];

/**
 * rules
 *
 * An array of validation rules used for form fields in the application.
 * The validation rule checks if a value exists (not null and not empty).
 *
 * @type {Array<Function>}
 */
export const rules = [(val) => (val && val.length > 0) || ""];

/**
 * validateFields
 *
 * Returns a validation function for a specific field.
 *
 * @param {Object} field - The field object with a 'label' property representing the field's label.
 * @returns {Function} A validation function that checks if the field value exists.
 */
export const validateFields = (field) => {
  // Return a validation function for the provided field.
  return (val) =>
    (val !== null && val !== "") || `Please input the ${field.label}.`;
};

/**
 * validateFormInputs
 *
 * Validates the form inputs based on the provided fields.
 *
 * @param {Object} form - The form object containing form data as key-value pairs.
 * @param {Array<Object>} fields - An array of field objects used for validation.
 * @returns {boolean} True if all fields have non-empty values, false otherwise.
 */
export const validateFormInputs = (form, fields) => {
  // Check if every field in the 'fields' array has a non-empty value in the 'form' object.
  return fields.every((field) => {
    let value = form.value[field.key];
    return value && value.length > 0;
  });
};

/**
 * compareInformation
 *
 * Compares the form data with the specificInformation data for specified fields.
 *
 * @param {Object} form - The form object containing form data as key-value pairs.
 * @param {Array<Object>} fields - An array of field objects used for comparison.
 * @param {Object} specificInformation - The specific information object to compare with.
 * @returns {boolean} True if any field in the form data is different from the specificInformation data, false otherwise.
 */
export const compareInformation = (form, fields, specificInformation) => {
  return fields.some((field) => {
    return form.value[field.key] !== specificInformation.value[0][field.key];
  });
};

/**
 * resetForm
 *
 * Resets the form fields by setting their values to null.
 *
 * @param {Object} form - The form object containing form data as key-value pairs.
 */
export const resetForm = (form) => {
  // Loop through all fields in the 'form' object and set their values to null.
  for (let fields in form) {
    form[fields] = null;
  }
};

/**
 * validateAge
 *
 * Prevents non-numeric keys from being entered in an input field to validate age.
 *
 * @param {Event} event - The keydown event object.
 */
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
  // If the pressed key is not included in the allowedKeys array, prevent its default action (typing in the input field).
  if (!allowedKeys.includes(key)) {
    event.preventDefault();
  }
};

/**
 * showNotification
 *
 * Displays a notification using Quasar's notify feature.
 *
 * @param {object} $quasar - The Quasar framework instance.
 * @param {string} type - The type of notification ('positive', 'negative', 'warning', 'info').
 * @param {string} message - The message to be displayed in the notification.
 * @param {number} timeout - The timeout duration for the notification to be shown.
 */
export const showNotification = ($quasar, type, message, timeout) => {
  // Call Quasar's notify function with the provided parameters to display the notification.
  $quasar.notify({
    type,
    message,
    timeout,
  });
};

/**
 * useSelectedRecords
 *
 * Provides a function to get the message for the number of selected records and the total number of records in a list.
 *
 * @param {ref} deleteMultipleValue - The ref containing the array of selected records.
 * @param {ref} recordLists - The ref containing the array of all records in the list.
 * @returns {Object} An object with a function 'getSelectedRecords' to get the message.
 */
export const useSelectedRecords = (deleteMultipleValue, recordLists) => {
  /**
   * getSelectedRecords
   *
   * Gets the message for the number of selected records and the total number of records in a list.
   *
   * @returns {string} A message indicating the number of selected records and the total number of records.
   */
  const getSelectedRecords = () => {
    const recordSelectedCount = deleteMultipleValue.value.length;
    const recordCount = recordLists.value.length;

    let message = "";

    // Check if there are any selected records. If so, construct a message indicating the number of selected records and the total number of records in the list.
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

/**
 * useListPage
 *
 * Filters and returns the list of records based on specific information and search value.
 *
 * @param {ref} specificInformation - The ref containing specific information about the records.
 * @param {ref} searchValue - The ref containing the search value.
 * @param {ref} listValue - The ref containing the full list of records.
 * @returns {Object} An object with a computed property 'listPage' representing the filtered list of records.
 */
export const useListPage = (specificInformation, searchValue, listValue) => {
  const listPage = computed(() => {
    let list = [];

    // If there is specific information available, display it on the list page.
    if (specificInformation.value.length) {
      list = specificInformation.value;
    }

    // If the searchValue is null (no search/filtering), display the complete list of items.
    if (searchValue.value === null) {
      list = listValue.value;
    }

    return list;
  });

  return {
    listPage,
  };
};

/**
 * useSelectedRecord
 *
 * Returns the selected record from the search results based on the record property.
 *
 * @param {ref} search - The ref containing the search results.
 * @param {ref} form - The ref containing the form data.
 * @param {string} recordProperty - The property used to compare the selected record.
 * @returns {Object} An object with a computed property 'selectedRecord' representing the matched record.
 */
export const useSelectedRecord = (search, form, recordProperty) => {
  const selectedRecord = computed(() => {
    // If there are search results and the search results are an array, find the matching record based on the 'recordProperty'.
    if (search.value && Array.isArray(search.value)) {
      return search.value.find(
        (record) => record[recordProperty] === form.value[recordProperty]
      );
    } else {
      // If there are no search results or the search results are not an array, return null.
      return null;
    }
  });

  return {
    selectedRecord,
  };
};
