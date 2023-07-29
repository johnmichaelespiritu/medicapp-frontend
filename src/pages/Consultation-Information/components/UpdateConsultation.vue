<template>
  <q-dialog persistent v-model="trigger.showUpdateConsultationModelDialog">
    <q-card class="update-consultation-dialog">
      <q-toolbar>
        <q-toolbar-title class="update-consultation-dialog-header">
          Update Consultation
        </q-toolbar-title>
      </q-toolbar>

      <div class="bg-white">
        <q-form class="update-consultation-form">
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
                :options="searchContents.length > 0 ? searchContents : []"
                :rules="[(val) => !!val || '']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="no-border text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
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
                :options="
                  searchDoctorContents.length > 0 ? searchDoctorContents : []
                "
                :rules="[(val) => !!val || '']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="no-border text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
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
              @click="updateConsultationInformation"
            />
            <q-btn
              flat
              no-caps
              class="cancel-button"
              label="Cancel"
              v-close-popup
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script src="../script/UpdateConsultation.js"></script>

<style lang="scss" scoped>
@import "../style/UpdateConsultation.scss";
</style>
