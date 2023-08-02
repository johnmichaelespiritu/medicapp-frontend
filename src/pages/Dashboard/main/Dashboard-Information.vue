<template>
  <!-- Main layout for displaying dashboard information -->
  <q-layout view="lHh LpR fFf">
    <div
      class="dashboard-details full-width row justify-evenly items-start content-start"
    >
      <!-- Loop through each dashboard field to display the data in cards -->
      <div
        v-for="dashboardField in dashboardFields"
        :key="dashboardField.key"
        class="col"
      >
        <q-card class="dashboard-card">
          <q-card-section class="dashboard-card-info">
            <!-- Display the total value (total number of doctors, patients, and consultations) for the dashboard field -->
            <span class="dashboard-total-label">{{
              dashboardField.total
            }}</span>
            <!-- Display the label for the dashboard field -->
            <span class="dashboard-label">{{ dashboardField.label }}</span>
          </q-card-section>

          <q-card-actions vertical align="center" class="dashboard-card-action">
            <!-- "More Information" chip to show detailed information -->
            <q-chip
              clickable
              square
              class="dashboard-card-chip"
              icon-right="chevron_right"
              @click="moreInformation(dashboardField.key, dashboardField.title)"
            >
              More Information
            </q-chip>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-layout>
</template>

<!-- Javascript source file -->
<script src="../script/Dashboard-Information.js"></script>

<!-- Scoped styles for the Dashboard-Information component -->
<style lang="scss" scoped>
@import "../style/Dashboard-Information.scss";
</style>
