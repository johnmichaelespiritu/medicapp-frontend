<template>
  <q-card class="signup-card text-white">
    <q-card-section>
      <q-form class="register-form">
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
            <q-icon name="person" color="orange-8" />
          </template>
        </q-input>

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
            <q-icon name="mail" color="orange-8" />
          </template>
        </q-input>

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
            <q-icon name="lock" color="orange-8" />
          </template>
          <template v-slot:append>
            <q-icon
              class="cursor-pointer"
              color="orange-8"
              :name="isCreatePassword ? 'visibility_off' : 'visibility'"
              @click="showCreatePassword"
            />
          </template>
        </q-input>

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
            <q-icon name="lock" color="orange-8" />
          </template>
          <template v-slot:append>
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

    <q-card-section class="lower-buttons">
      <q-btn
        class="register-button text-capitalize"
        label="Register"
        @click="addAccount"
      />
      <q-btn
        class="cancel-button text-capitalize"
        label="Cancel"
        @click="exitSignUpForm"
      />
    </q-card-section>
  </q-card>
</template>

<script src="../script/Sign-up.js"></script>

<style lang="scss" scoped>
@import "../style/Sign-up.scss";
</style>
