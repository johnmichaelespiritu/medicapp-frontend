<template>
  <!-- Main layout for displaying patient information -->
  <q-layout view="lHh LpR fFf">
    <div class="patient-information-upper-section">
      <!-- Search input for patient list -->
      <div class="patient-information-search-wrapper">
        <q-select
          dense
          fill-input
          hide-selected
          outlined
          square
          use-input
          class="patient-information-search-patient"
          color="orange-8"
          dropdown-icon="false"
          input-debounce="0"
          option-label="patient_name"
          option-value="patient_id"
          placeholder="Search Patient"
          v-model="searchPatient"
          @blur="checkInput"
          @filter="
            (val, update, abort) =>
              filterData('Patient.php', val, update, abort)
          "
          @update:model-value="selectedPatient"
          :options="searchContents.length > 0 ? searchContents : []"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="black" />
          </template>

          <template v-if="searchPatient" v-slot:append>
            <!-- Clear search button. -->
            <q-btn
              flat
              round
              class="clear-search-button cursor-pointer"
              icon="clear"
              @click="clearSearch"
            />
          </template>

          <!-- No result template. -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-black"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="patient-information-buttons-wrapper">
        <!-- Button to add a new patient -->
        <q-btn
          flat
          dense
          round
          class="patient-information-add-patient-button"
          icon="add"
          @click="addPatient"
        >
          <q-tooltip
            class="bg-black"
            transition-show="scale"
            transition-hide="scale"
          >
            Add Patient
          </q-tooltip>
        </q-btn>

        <!-- Button to delete selected doctors -->
        <q-btn
          flat
          dense
          round
          class="patient-information-delete-button"
          icon="delete"
          :disable="!deleteMultiplePatient.length"
          @click="deletePatientInformation(deleteMultiplePatient)"
        />
      </div>
    </div>

    <!-- Main table to display patient list -->
    <div class="patient-information-main-table">
      <q-table
        bordered
        flat
        hide-no-data
        row-key="patient_id"
        selection="multiple"
        v-model:selected="deleteMultiplePatient"
        :columns="visibleColumns"
        :rows="patientListPage"
        :loading="loading"
        :selected-rows-label="getSelectedPatient"
        :table-header-style="{
          backgroundColor: 'rgb(249, 152, 48)',
          color: 'white',
        }"
      >
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              dense
              flat
              round
              class="patient-information-edit-button"
              icon="edit"
              @click="updatePatient(props.row.patient_id)"
            >
              <q-tooltip
                class="bg-black"
                transition-show="scale"
                transition-hide="scale"
              >
                Update Patient
              </q-tooltip></q-btn
            >
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialog for adding a new patient -->
    <div v-show="trigger.showAddPatientModelDialog">
      <AddPatient />
    </div>

    <!-- Dialog for updating an existing patient -->
    <div v-show="trigger.showUpdatePatientModelDialog">
      <UpdatePatient />
    </div>
  </q-layout>
</template>

<!-- Javascript source file -->
<script src="../script/Patient-Information.js"></script>

<!-- Scoped styles for the Patient-Information component -->
<style lang="scss" scoped>
@import "../style/Patient-Information.scss";
</style>
