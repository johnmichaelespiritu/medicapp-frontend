<template>
  <q-card
    class="forgot-password-email-card text-white"
    v-show="trigger.showForgotPasswordEmailForm"
  >
    <q-card-section class="forgot-password-email-form-section">
      <div class="forgot-password-email-form-label1">Find your account</div>
      <q-separator class="forgot-password-email-form-separator" />
      <div class="forgot-password-email-form-label2">
        Please enter your email to search for your account.
      </div>
      <q-form class="forgot-password-email-form">
        <q-input
          hide-bottom-space
          lazy-rules
          outlined
          bg-color="white"
          class="email-input"
          color="orange-8"
          ref="userEmailRef"
          placeholder="Enter your email"
          v-model="user_email"
          :rules="rules"
        >
          <template v-slot:prepend>
            <q-icon name="mail" color="orange-8" />
          </template>
        </q-input>
      </q-form>
    </q-card-section>

    <q-card-section class="lower-buttons">
      <q-btn
        class="send-button text-capitalize"
        label="Send"
        @click="sendForgotPasswordEmailForm"
      />
      <q-btn
        class="cancel-button text-capitalize"
        label="Cancel"
        @click="exitForgotPasswordForm"
      />
    </q-card-section>
  </q-card>

  <q-card
    class="forgot-password-password-card text-white"
    v-show="trigger.showForgotPasswordPasswordForm"
  >
    <q-card-section>
      <q-form class="forgot-password-password-form">
        <q-input
          hide-bottom-space
          lazy-rules
          outlined
          bg-color="white"
          class="password-input"
          color="orange-8"
          ref="userPasswordRef"
          placeholder="Enter your new password"
          v-model="userUpdatePasswordForm.user_password"
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
          ref="userConfirmPasswordRef"
          placeholder="Confirm your new password"
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
        class="send-button text-capitalize"
        label="Submit"
        @click="sendForgotPasswordPasswordForm"
      />
      <q-btn
        class="cancel-button text-capitalize"
        label="Cancel"
        @click="exitForgotPasswordForm"
      />
    </q-card-section>
  </q-card>
</template>

<script src="../script/ForgotPassword.js"></script>

<style lang="scss" scoped>
@import "../style/ForgotPassword.scss";
</style>
