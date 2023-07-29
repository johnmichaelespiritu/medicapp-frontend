<template>
  <!-- Forgot Password Email Card -->
  <q-card
    class="forgot-password-email-card text-white"
    v-show="trigger.showForgotPasswordEmailForm"
  >
    <!-- Card Section for the email form -->
    <q-card-section class="forgot-password-email-form-section">
      <!-- Label 1: Find your account -->
      <div class="forgot-password-email-form-label1">Find your account</div>
      <!-- Separator -->
      <q-separator class="forgot-password-email-form-separator" />
      <!-- Label 2: Instructions for email search -->
      <div class="forgot-password-email-form-label2">
        Please enter your email to search for your account.
      </div>
      <!-- Email Form -->
      <q-form class="forgot-password-email-form">
        <!-- Input for email -->
        <q-input
          hide-bottom-space
          lazy-rules
          outlined
          bg-color="white"
          class="email-input"
          color="orange-8"
          ref="userEmailRef"
          placeholder="Enter your email"
          v-model="resendVerificationCodeForm.user_email"
          :rules="rules"
        >
          <template v-slot:prepend>
            <!-- Icon for email input -->
            <q-icon name="mail" color="orange-8" />
          </template>
        </q-input>
      </q-form>
    </q-card-section>

    <!-- Lower Buttons Section -->
    <q-card-section class="lower-buttons">
      <!-- Send Button -->
      <q-btn
        class="send-button text-capitalize"
        label="Send"
        @click="sendForgotPasswordEmailForm"
      />
      <!-- Cancel Button -->
      <q-btn
        class="cancel-button text-capitalize"
        label="Cancel"
        @click="exitForgotPasswordForm"
      />
    </q-card-section>
  </q-card>

  <!-- Forgot Password Password Card -->
  <q-card
    class="forgot-password-password-card text-white"
    v-show="trigger.showForgotPasswordPasswordForm"
  >
    <!-- Card Section for the password form -->
    <q-card-section>
      <!-- Password Form -->
      <q-form class="forgot-password-password-form">
        <!-- Input for new password -->
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
            <!-- Icon for password input -->
            <q-icon name="lock" color="orange-8" />
          </template>
          <template v-slot:append>
            <!-- Icon for password visibility toggle -->
            <q-icon
              class="cursor-pointer"
              color="orange-8"
              :name="isCreatePassword ? 'visibility_off' : 'visibility'"
              @click="showCreatePassword"
            />
          </template>
        </q-input>

        <!-- Input for confirming new password -->
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
            <!-- Icon for confirm password input -->
            <q-icon name="lock" color="orange-8" />
          </template>
          <template v-slot:append>
            <!-- Icon for confirm password visibility toggle -->
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
      <!-- Submit Button -->
      <q-btn
        class="send-button text-capitalize"
        label="Submit"
        @click="sendForgotPasswordPasswordForm"
      />
      <!-- Cancel Button -->
      <q-btn
        class="cancel-button text-capitalize"
        label="Cancel"
        @click="exitForgotPasswordForm"
      />
    </q-card-section>
  </q-card>
</template>

<!-- Javascript source file -->
<script src="../script/ForgotPassword.js"></script>

<!-- Scoped styles for the ForgetPassword component -->
<style lang="scss" scoped>
@import "../style/ForgotPassword.scss";
</style>
