<template>
  <!-- Essential Link Item -->
  <q-item clickable tag="a" target="_self" :href="link">
    <!-- Icon Section (if provided) -->
    <q-item-section v-if="icon" avatar>
      <!-- Display the provided icon -->
      <q-icon :name="icon" />
    </q-item-section>

    <!-- Content Section -->
    <q-item-section>
      <!-- Title of the link -->
      <q-item-label>{{ title }}</q-item-label>
      <!-- Caption (optional) -->
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<!-- Javascript source file -->
<script src="../script/EssentialLink.js"></script>
