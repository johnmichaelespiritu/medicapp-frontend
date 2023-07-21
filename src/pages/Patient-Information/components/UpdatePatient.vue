<template>
  <q-dialog persistent v-model="trigger.showUpdatePatientModelDialog">
    <q-card class="update-patient-dialog">
      <q-toolbar>
        <q-toolbar-title class="update-patient-dialog-header">
          Update Patient
        </q-toolbar-title>
      </q-toolbar>

      <div class="bg-white">
        <q-form class="update-patient-form">
          <q-list v-for="(patientField, index) in patientFields" :key="index">
            <span class="label">{{ patientField.label }}</span>

            <template v-if="patientField.key === 'patient_gender'">
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

          <div class="lower-buttons">
            <q-btn
              flat
              no-caps
              class="update-button"
              label="Update"
              @click="updatePatientInformation"
            />
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

<script src="../script/UpdatePatient.js"></script>

<style lang="scss" scoped>
@import "../style/UpdatePatient.scss";
</style>
