<template>
  <q-layout view="lHh LpR fFf">
    <q-header class="doctor-information-main-header">
      <q-toolbar>
        <q-toolbar-title class="doctor-information-header-title">
          Doctor Information
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-btn
      flat
      no-caps
      class="doctor-information-add-doctor-button"
      icon="add"
      label="Add Doctor"
      @click="addDoctor"
    />

    <q-select
      dense
      fill-input
      hide-selected
      outlined
      square
      use-input
      class="doctor-information-search-doctor q-mx-lg"
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
        <q-btn
          flat
          round
          class="clear-search-button cursor-pointer"
          icon="clear"
          @click="clearSearch"
        />
      </template>

      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-black"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-btn
      flat
      dense
      round
      class="doctor-information-delete-button"
      icon="delete"
      :disable="!deleteMultipleDoctor.length"
      @click="deleteDoctorInformation(deleteMultipleDoctor)"
    />

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
            ></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <div v-show="trigger.showAddDoctorModelDialog">
      <AddDoctor />
    </div>

    <div v-show="trigger.showUpdateDoctorModelDialog">
      <UpdateDoctor />
    </div>
  </q-layout>
</template>

<script src="../script/Doctor-Information.js"></script>

<style lang="scss" scoped>
@import "../style/Doctor-Information.scss";
</style>
