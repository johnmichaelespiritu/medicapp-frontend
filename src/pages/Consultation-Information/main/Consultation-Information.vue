<template>
  <q-layout view="lHh LpR fFf">
    <q-header class="consultation-information-main-header">
      <q-toolbar>
        <q-toolbar-title class="consultation-information-header-title">
          Consultation Information
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-btn
      flat
      no-caps
      class="consultation-information-add-consultation-button"
      icon="add"
      label="Add Consultation"
      @click="addConsultation"
    />

    <q-select
      dense
      fill-input
      hide-selected
      outlined
      square
      use-input
      class="consultation-information-search-consultation q-mx-lg"
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
        <q-btn
          flat
          round
          class="clear-search-button cursor-pointer"
          icon="clear"
          @click="clearSearch()"
        />
      </template>

      <template v-slot:no-option>
        <q-item>
          <q-item-section class="no-border text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-btn
      flat
      dense
      round
      class="consultation-information-delete-button"
      icon="delete"
      :disable="!deleteMultipleConsultation.length"
      @click="deleteConsultationInformation(deleteMultipleConsultation)"
    />

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
            ></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <div v-show="trigger.showAddConsultationModelDialog">
      <AddConsultation />
    </div>

    <div v-show="trigger.showUpdateConsultationModelDialog">
      <UpdateConsultation />
    </div>
  </q-layout>
</template>

<script src="../script/Consultation-Information.js"></script>

<style lang="scss" scoped>
@import "../style/Consultation-Information.scss";
</style>
