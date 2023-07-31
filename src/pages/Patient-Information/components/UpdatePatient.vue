<template>
  <!-- A dialog to add patient information. -->
  <q-dialog persistent v-model="trigger.showUpdatePatientModelDialog">
    <q-card class="update-patient-dialog">
      <q-toolbar>
        <!-- Dialog title -->
        <q-toolbar-title class="update-patient-dialog-header">
          Update Patient
        </q-toolbar-title>
      </q-toolbar>

      <div class="bg-white">
        <q-form class="update-patient-form">
          <!-- Loop through each patient field. -->
          <q-list v-for="(patientField, index) in patientFields" :key="index">
            <!-- Display the label for the current patient field. -->
            <span class="label">{{ patientField.label }}</span>
            <!-- Render different input components based on the patient field key. -->
            <template v-if="patientField.key === 'patient_gender'">
              <!-- Select input for patient gender. -->
              <q-select
                dense
                outlined
                square
                class="bg-white"
                color="orange-8"
                v-model.trim="patientForm[patientField.key]"
                :options="genderOptions"
                :rules="[(val) => !!val || '']"
              />
            </template>

            <template v-else>
              <!-- Default input for other patient fields (patient name, patient age, patient home address, patient contact number, patient birthdate). -->
              <q-input
                dense
                outlined
                square
                class="bg-white"
                color="orange-8"
                v-model.trim="patientForm[patientField.key]"
                @keydown="
                  patientField.key === 'patient_age' ? validateAge($event) : ''
                "
                :type="
                  patientField.key === 'patient_age'
                    ? 'number'
                    : '' || patientField.key === 'patient_birthdate'
                    ? 'date'
                    : ''
                "
                :hint="
                  patientField.key === 'patient_contact_number'
                    ? 'e.g. 09123456789'
                    : ''
                "
                :mask="
                  patientField.key === 'patient_contact_number'
                    ? '#### - ### - ####'
                    : ''
                "
                :unmasked-value="
                  patientField.key === 'patient_contact_number' ? true : false
                "
                :rules="rules"
              />
            </template>
          </q-list>

          <!-- Lower Buttons Section -->
          <div class="lower-buttons">
            <!-- Button for saving patient -->
            <q-btn
              flat
              no-caps
              class="update-button"
              label="Update"
              @click="updatePatientInformation"
            />
            <!-- Button for cancelling patient information -->
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
<script src="../script/UpdatePatient.js"></script>

<!-- Scoped styles for the AddPatient component -->
<style lang="scss" scoped>
@import "../style/UpdatePatient.scss";
</style>
