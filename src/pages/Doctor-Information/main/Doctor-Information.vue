<template>
  <!-- Main layout for displaying doctor information -->
  <q-layout view="lHh LpR fFf">
    <div class="doctor-information-upper-section">
      <!-- Search input for doctor list -->
      <div class="doctor-information-search-wrapper">
        <q-select
          dense
          fill-input
          hide-selected
          outlined
          square
          use-input
          class="doctor-information-search-doctor"
          color="orange-8"
          dropdown-icon="false"
          input-debounce="0"
          option-label="doctor_name"
          option-value="doctor_id"
          placeholder="Search Doctor"
          v-model="searchDoctor"
          @blur="checkInput"
          @filter="
            (val, update, abort) => filterData('Doctor.php', val, update, abort)
          "
          @update:model-value="selectedDoctor"
          :options="searchDoctorContents.length > 0 ? searchDoctorContents : []"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="black" />
          </template>

          <template v-if="searchDoctor" v-slot:append>
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

      <div class="doctor-information-buttons-wrapper">
        <!-- Button to add a new doctor -->
        <q-btn
          flat
          dense
          round
          class="doctor-information-add-doctor-button"
          icon="add"
          @click="addDoctor"
        >
          <q-tooltip
            class="bg-black"
            transition-show="scale"
            transition-hide="scale"
          >
            Add Doctor
          </q-tooltip>
        </q-btn>

        <!-- Button to delete selected doctors -->
        <q-btn
          flat
          dense
          round
          class="doctor-information-delete-button"
          icon="delete"
          :disable="!deleteMultipleDoctor.length"
          @click="deleteDoctorInformation(deleteMultipleDoctor)"
        />
      </div>
    </div>

    <!-- Main table to display doctor list -->
    <div class="doctor-information-main-table">
      <q-table
        bordered
        flat
        hide-no-data
        row-key="doctor_id"
        selection="multiple"
        v-model:selected="deleteMultipleDoctor"
        :columns="columns"
        :rows="doctorListPage"
        :loading="loading"
        :selected-rows-label="getSelectedDoctor"
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
              class="doctor-information-edit-button"
              icon="edit"
              @click="updateDoctor(props.row.doctor_id)"
            >
              <q-tooltip
                class="bg-black"
                transition-show="scale"
                transition-hide="scale"
              >
                Update Doctor
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialog for adding a new doctor -->
    <div v-show="trigger.showAddDoctorModelDialog">
      <AddDoctor />
    </div>

    <!-- Dialog for updating an existing doctor -->
    <div v-show="trigger.showUpdateDoctorModelDialog">
      <UpdateDoctor />
    </div>
  </q-layout>
</template>

<!-- Javascript source file -->
<script src="../script/Doctor-Information.js"></script>

<!-- Scoped styles for the Doctor-Information component -->
<style lang="scss" scoped>
@import "../style/Doctor-Information.scss";
</style>
