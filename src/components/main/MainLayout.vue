<template>
  <!-- Main Layout -->
  <q-layout view="lHh LpR fFf" class="main-layout">
    <!-- Main Header -->
    <q-header class="main-header" bordered fixed>
      <!-- Toolbar with Menu, User Name, and Logout Button -->
      <q-toolbar>
        <!-- Menu Button -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <!-- Display Page Title -->
        <q-toolbar-title class="main-page">
          {{ trigger.activeMenu }}
        </q-toolbar-title>

        <!-- Display User Name -->
        <q-toolbar-title class="main-user-name">
          {{ userName }}
        </q-toolbar-title>

        <!-- Logout Button Dropdown -->
        <q-btn-dropdown
          class="main-logout"
          dropdown-icon="change_history"
          fab-mini
          flat
        >
          <!-- List of Options in the Dropdown -->
          <q-list>
            <!-- Sign Out Item -->
            <q-item clickable v-close-popup @click="logOut">
              <q-item-section avatar>
                <!-- Logout Icon -->
                <q-icon name="logout" color="black" />
              </q-item-section>
              <q-item-section> Sign Out </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer -->
    <q-drawer
      v-model="trigger.leftDrawerOpen"
      show-if-above
      bordered
      class="main-drawer"
    >
      <q-list>
        <!-- Drawer Label: Medicapp -->
        <q-item-label header class="drawer-label"> Medicapp </q-item-label>
        <!-- Drawer Icon: Logo -->
        <q-icon class="drawer-icon" size="md">
          <img src="/logo.ico" />
        </q-icon>

        <!-- Essential Links in the Drawer -->
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          active-class="active-class"
          :active="trigger.activeMenu === link.title"
          @click="setActiveMenu(link.title)"
        />
      </q-list>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container class="main-page-container">
      <!-- Router View (renders the appropriate component based on the route) -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<!-- Javascript source file -->
<script src="../script/MainLayout.js"></script>

<!-- Scoped styles for the MainLayout component -->
<style>
@import "../style/MainLayout.scss";
</style>
