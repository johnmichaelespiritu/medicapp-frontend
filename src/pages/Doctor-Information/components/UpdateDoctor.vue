<template>
  <q-dialog persistent v-model="trigger.showUpdateDoctorModelDialog">
    <q-card class="update-doctor-dialog">
      <q-toolbar>
        <q-toolbar-title class="update-doctor-dialog-header">
          Update Doctor
        </q-toolbar-title>
      </q-toolbar>

      <div class="bg-white">
        <q-form class="update-doctor-form">
          <q-list v-for="(doctorField, index) in doctorFields" :key="index">
            <span class="label">{{ doctorField.label }}</span>
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

          <div class="lower-buttons">
            <q-btn
              flat
              no-caps
              class="update-button"
              label="Update"
              @click="updateDoctorInformation"
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

<script src="../script/UpdateDoctor.js"></script>

<style lang="scss" scoped>
@import "../style/UpdateDoctor.scss";
</style>
