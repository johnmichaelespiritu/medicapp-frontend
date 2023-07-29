<template>
  <!-- Signup Card Component -->
  <q-card class="signup-card text-white">
    <q-card-section>
      <!-- Registration Form -->
      <q-form class="register-form">
        <!-- Username Input -->
        <q-input
          hide-bottom-space
          lazy-rules
          outlined
          bg-color="white"
          class="username-input"
          color="orange-8"
          placeholder="Enter your name"
          ref="userNameRef"
          v-model="registerForm.user_name"
          :rules="rules"
        >
          <template v-slot:prepend>
            <!-- Person Icon -->
            <q-icon name="person" color="orange-8" />
          </template>
        </q-input>

        <!-- Email Input -->
        <q-input
          hide-bottom-space
          outlined
          bg-color="white"
          class="email-input"
          color="orange-8"
          placeholder="Enter your email"
          ref="userEmailRef"
          v-model="registerForm.user_email"
          :rules="rules"
        >
          <template v-slot:prepend>
            <!-- Mail Icon -->
            <q-icon name="mail" color="orange-8" />
          </template>
        </q-input>

        <!-- Password Input -->
        <q-input
          hide-bottom-space
          lazy-rules
          outlined
          bg-color="white"
          class="password-input"
          color="orange-8"
          placeholder="Enter your password"
          ref="userPasswordRef"
          v-model="registerForm.user_password"
          :rules="rules"
          :type="isCreatePassword ? 'password' : 'text'"
        >
          <template v-slot:prepend>
            <!-- Lock Icon -->
            <q-icon name="lock" color="orange-8" />
          </template>
          <template v-slot:append>
            <!-- Toggle Visibility Icon for Password -->
            <q-icon
              class="cursor-pointer"
              color="orange-8"
              :name="isCreatePassword ? 'visibility_off' : 'visibility'"
              @click="showCreatePassword"
            />
          </template>
        </q-input>

        <!-- Confirm Password Input -->
        <q-input
          hide-bottom-space
          lazy-rules
          outlined
          bg-color="white"
          class="confirm-password-input"
          color="orange-8"
          placeholder="Confirm your password"
          ref="userConfirmPasswordRef"
          v-model="user_confirm_password"
          :rules="rules"
          :type="isConfirmPassword ? 'password' : 'text'"
        >
          <template v-slot:prepend>
            <!-- Lock Icon -->
            <q-icon name="lock" color="orange-8" />
          </template>
          <template v-slot:append>
            <!-- Toggle Visibility Icon for Confirm Password -->
            <q-icon
              class="cursor-pointer"
              color="orange-8"
              :name="isConfirmPassword ? 'visibility_off' : 'visibility'"
              @click="showConfirmPassword"
            />
          </template>
        </q-input>
      </q-form>
    </q-card-section>

    <!-- Lower Buttons Section -->
    <q-card-section class="lower-buttons">
      <!-- Register Button -->
      <q-btn
        class="register-button text-capitalize"
        label="Register"
        @click="addAccount"
      />
      <!-- Cancel Button -->
      <q-btn
        class="cancel-button text-capitalize"
        label="Cancel"
        @click="exitSignUpForm"
      />
    </q-card-section>
  </q-card>
</template>

<!-- Javascript source file -->
<script src="../script/Sign-up.js"></script>

<!-- Scoped styles for the Sign-up component -->
<style lang="scss" scoped>
@import "../style/Sign-up.scss";
</style>
