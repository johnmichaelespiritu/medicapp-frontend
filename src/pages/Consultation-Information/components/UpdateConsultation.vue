<template>
  <!-- A dialog to update consultation information -->
  <q-dialog persistent v-model="trigger.showUpdateConsultationModelDialog">
    <q-card class="update-consultation-dialog">
      <q-toolbar>
        <!-- Dialog title -->
        <q-toolbar-title class="update-consultation-dialog-header">
          Update Consultation
        </q-toolbar-title>
      </q-toolbar>

      <div class="bg-white">
        <q-form class="update-consultation-form">
          <!-- Loop through each consultation field -->
          <q-list
            v-for="(consultationField, index) in consultationFields"
            :key="index"
          >
            <!-- Display the label for the current consultation field. -->
            <span class="label">{{ consultationField.label }}</span>
            <!-- Render different input components based on the consultation field key. -->
            <template v-if="consultationField.key === 'patient_name'">
              <!-- Select input for patient name. -->
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
                <!-- No result template. -->
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
              <!-- Select input for doctor name. -->
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
                <!-- No result template. -->
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
              <!-- Select input for consultation status. -->
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
              <!-- Default input for other consultation fields (patient age, patient home address, patient contact number, complaints, diagnosis, treatment, consultation date). -->
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

          <!-- Lower Buttons Section -->
          <div class="lower-buttons">
            <!-- Button for saving consultation -->
            <q-btn
              flat
              no-caps
              class="save-button"
              label="Save"
              @click="updateConsultationInformation"
            />
            <!-- Button for cancelling consultation -->
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

<!-- Javascript source file -->
<script src="../script/UpdateConsultation.js"></script>

<!-- Scoped styles for the UpdateConsultation component -->
<style lang="scss" scoped>
@import "../style/UpdateConsultation.scss";
</style>
