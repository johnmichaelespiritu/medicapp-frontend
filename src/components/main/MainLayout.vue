<template>
  <q-layout view="lHh LpR fFf" class="main-layout">
    <q-header class="main-header" bordered fixed>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="main-user-name">
          {{ userName }}
        </q-toolbar-title>

        <q-btn-dropdown
          class="main-logout"
          dropdown-icon="change_history"
          fab-mini
          flat
        >
          <q-list>
            <q-item clickable v-close-popup @click="logOut">
              <q-item-section avatar>
                <q-icon name="logout" color="black" />
              </q-item-section>
              <q-item-section> Sign Out </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="trigger.leftDrawerOpen"
      show-if-above
      bordered
      class="main-drawer"
    >
      <q-list>
        <q-item-label header class="drawer-label"> Medicapp </q-item-label>
        <q-icon class="drawer-icon" size="md">
          <img src="/logo.ico" />
        </q-icon>

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

    <q-page-container class="main-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script src="../script/MainLayout.js"></script>

<!-- <style lang="scss" scoped>
@import "../style/MainLayout.scss";
</style> -->

<style>
.main-layout,
.main-user-name {
  font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  font-size: 16px;
  font-weight: 400;
}
.main-header {
  background-color: white;
  color: black;
}
.main-drawer {
  background-color: rgb(20, 34, 73);
  color: white;
}
.drawer-label {
  font-size: 16px;
  color: white;
  text-align: center;
}
.drawer-icon {
  margin-top: -75px;
  margin-left: 50px;
}
.active-class {
  color: white;
  background: linear-gradient(
    90deg,
    rgba(249, 152, 48, 1) 1.5%,
    rgba(13, 26, 63, 1) 1.5%
  );
}
.main-page-container {
  position: relative;
  z-index: 1;
  overflow: hidden !important;
}
.main-user-name {
  text-align: end;
}
.main-logout {
  color: rgba(249, 152, 48, 1);
  margin-left: auto;
}
</style>
