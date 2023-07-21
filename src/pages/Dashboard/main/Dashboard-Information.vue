<template>
  <q-layout view="lHh LpR fFf">
    <q-header class="dashboard-information-main-header">
      <q-toolbar>
        <q-toolbar-title class="dashboard-information-header-title">
          Dashboard Information
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div
      class="dashboard-details full-width row justify-evenly items-start content-start"
    >
      <div
        v-for="dashboardField in dashboardFields"
        :key="dashboardField.key"
        class="col"
      >
        <q-card class="dashboard-card">
          <q-card-section class="dashboard-card-info">
            <span class="dashboard-total-label">{{
              dashboardField.total
            }}</span>

            <span class="dashboard-label">{{ dashboardField.label }}</span>
          </q-card-section>

          <q-card-actions vertical align="center" class="dashboard-card-action">
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

<script src="../script/Dashboard-Information.js"></script>

<style lang="scss" scoped>
@import "../style/Dashboard-Information.scss";
</style>
