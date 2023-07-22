<template>
  <q-dialog persistent v-model="trigger.showAddConsultationModelDialog">
    <q-card class="add-consultation-dialog">
      <q-toolbar>
        <q-toolbar-title class="add-consultation-dialog-header">
          Add Consultation
        </q-toolbar-title>
      </q-toolbar>

      <div class="bg-white">
        <q-form class="add-consultation-form">
          <q-list
            v-for="(consultationField, index) in consultationFields"
            :key="index"
          >
            <span class="label">{{ consultationField.label }}</span>
            <template v-if="consultationField.key === 'patient_name'">
              <q-select
                dense
                emit-value
                hide-dropdown-icon
                map-options
                outlined
                square
                use-input
                class="bg-white"
                color="orange-8"
                option-label="patient_name"
                option-value="patient_name"
                v-model="consultationForm[consultationField.key]"
                @filter="
                  (val, update, abort) =>
                    filterData('Patient.php', val, update, abort)
                "
                :options="searchContents"
                :rules="[(val) => !!val || '']"
              />
            </template>

            <template v-else-if="consultationField.key === 'doctor_name'">
              <q-select
                dense
                emit-value
                hide-dropdown-icon
                map-options
                outlined
                square
                use-input
                class="bg-white"
                color="orange-8"
                option-label="doctor_name"
                option-value="doctor_name"
                v-model="consultationForm[consultationField.key]"
                @filter="
                  (val, update, abort) =>
                    filterData('Doctor.php', val, update, abort)
                "
                :options="searchDoctorContents"
                :rules="[(val) => !!val || '']"
              />
            </template>

            <template v-else-if="consultationField.key === 'status'">
              <q-select
                dense
                outlined
                square
                class="bg-white"
                color="orange-8"
                v-model="consultationForm[consultationField.key]"
                :options="statuses"
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
                v-model.trim="consultationForm[consultationField.key]"
                :type="
                  consultationField.key === 'consultation_date' ? 'date' : ''
                "
                :autogrow="
                  consultationField.key === 'complaints' ||
                  consultationField.key === 'diagnosis' ||
                  consultationField.key === 'treatment'
                    ? true
                    : false
                "
                :readonly="
                  consultationField.key === 'patient_age' ||
                  consultationField.key === 'patient_home_address' ||
                  consultationField.key === 'patient_contact_number'
                    ? true
                    : false
                "
                :rules="
                  consultationField.key !== 'patient_age' &&
                  consultationField.key !== 'patient_home_address' &&
                  consultationField.key !== 'patient_contact_number'
                    ? [rules]
                    : []
                "
              />
            </template>
          </q-list>

          <div class="lower-buttons">
            <q-btn
              flat
              no-caps
              class="save-button"
              label="Save"
              @click="addConsultationInformation"
            />
            <q-btn
              flat
              no-caps
              class="cancel-button"
              label="Cancel"
              v-close-popup
              @click="resetForm(consultationForm)"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script src="../script/AddConsultation.js"></script>

<style lang="scss" scoped>
@import "../style/AddConsultation.scss";
</style>