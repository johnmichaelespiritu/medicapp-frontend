<template>
  <!-- Main layout for displaying consultation information -->
  <q-layout view="lHh LpR fFf">
    <div class="consultation-information-upper-section">
      <!-- Search input for consultation list -->
      <div class="consultation-information-search-wrapper">
        <q-select
          dense
          fill-input
          hide-selected
          outlined
          square
          use-input
          class="consultation-information-search-consultation"
          color="orange-8"
          dropdown-icon="false"
          input-debounce="0"
          option-label="patient_name"
          option-value="consultation_id"
          placeholder="Search Consultation"
          v-model="searchConsultation"
          @blur="checkInput"
          @filter="
            (val, update, abort) =>
              filterData('Consultation.php', val, update, abort)
          "
          @update:model-value="selectedConsultation"
          :options="searchContents.length > 0 ? searchContents : []"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="black" />
          </template>

          <template v-if="searchConsultation" v-slot:append>
            <!-- Clear search button. -->
            <q-btn
              flat
              round
              class="clear-search-button cursor-pointer"
              icon="clear"
              @click="clearSearch()"
            />
          </template>

          <!-- No result template. -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="no-border text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="consultation-information-buttons-wrapper">
        <!-- Button to add a new consultation -->
        <q-btn
          flat
          dense
          round
          class="consultation-information-add-consultation-button"
          icon="add"
          @click="addConsultation"
        >
          <q-tooltip
            class="bg-black"
            transition-show="scale"
            transition-hide="scale"
          >
            Add Consultation
          </q-tooltip>
        </q-btn>

        <!-- Button to delete selected consultations -->
        <q-btn
          flat
          dense
          round
          class="consultation-information-delete-button"
          icon="delete"
          :disable="!deleteMultipleConsultation.length"
          @click="deleteConsultationInformation(deleteMultipleConsultation)"
        />
      </div>
    </div>

    <!-- Main table to display consultation list -->
    <div class="consultation-information-main-table">
      <q-table
        bordered
        flat
        hide-no-data
        row-key="consultation_id"
        selection="multiple"
        v-model:selected="deleteMultipleConsultation"
        :columns="columns"
        :rows="consultationListPage"
        :loading="loading"
        :selected-rows-label="getSelectedConsultation"
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
              class="consultation-information-edit-button"
              icon="edit"
              @click="updateConsultation(props.row.consultation_id)"
            >
              <q-tooltip
                class="bg-black"
                transition-show="scale"
                transition-hide="scale"
              >
                Update Consultation
              </q-tooltip></q-btn
            >
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialog for adding a new consultation -->
    <div v-show="trigger.showAddConsultationModelDialog">
      <AddConsultation />
    </div>

    <!-- Dialog for updating an existing consultation -->
    <div v-show="trigger.showUpdateConsultationModelDialog">
      <UpdateConsultation />
    </div>
  </q-layout>
</template>

<!-- Javascript source file -->
<script src="../script/Consultation-Information.js"></script>

<!-- Scoped styles for the Consultation-Information component -->
<style lang="scss" scoped>
@import "../style/Consultation-Information.scss";
</style>
