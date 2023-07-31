<template>
  <!-- A dialog to update doctor information. -->
  <q-dialog persistent v-model="trigger.showUpdateDoctorModelDialog">
    <q-card class="update-doctor-dialog">
      <q-toolbar>
        <!-- Dialog title -->
        <q-toolbar-title class="update-doctor-dialog-header">
          Update Doctor
        </q-toolbar-title>
      </q-toolbar>

      <div class="bg-white">
        <q-form class="update-doctor-form">
          <!-- Loop through each doctor field. -->
          <q-list v-for="(doctorField, index) in doctorFields" :key="index">
            <!-- Display the label for the current doctor field. -->
            <span class="label">{{ doctorField.label }}</span>
            <!-- Default input fields for doctor fields. -->
            <q-input
              dense
              outlined
              square
              class="bg-white"
              color="orange-8"
              v-model.trim="doctorForm[doctorField.key]"
              :hint="
                doctorField.key === 'contact_number' ? 'e.g. 09123456789' : ''
              "
              :mask="
                doctorField.key === 'contact_number' ? '#### - ### - ####' : ''
              "
              :unmasked-value="
                doctorField.key === 'contact_number' ? true : false
              "
              :rules="rules"
            />
          </q-list>

          <!-- Lower Buttons Section -->
          <div class="lower-buttons">
            <!-- Button for saving doctor -->
            <q-btn
              flat
              no-caps
              class="update-button"
              label="Update"
              @click="updateDoctorInformation"
            />
            <!-- Button for cancelling doctor information -->
            <q-btn
              flat
              no-caps
              v-close-popup
              class="cancel-button"
              label="Cancel"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<!-- Javascript source file -->
<script src="../script/UpdateDoctor.js"></script>

<!-- Scoped styles for the UpdateDoctor component -->
<style lang="scss" scoped>
@import "../style/UpdateDoctor.scss";
</style>
