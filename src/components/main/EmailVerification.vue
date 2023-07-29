<template>
  <!-- Email Verification Card -->
  <q-card class="email-verification-card text-white">
    <!-- Email Verification Form Section -->
    <q-card-section>
      <q-form class="email-verification-form">
        <!-- Email Verification Input -->
        <q-input
          outlined
          color="orange-8"
          bg-color="white"
          ref="verificationCodeRef"
          placeholder="Enter the verification code"
          v-model="emailVerificationCode.verification_code"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) || 'Please input the verification code.',
          ]"
        >
          <!-- Prepend Icon -->
          <template v-slot:prepend>
            <q-icon name="domain_verification" color="orange-8" />
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
        @click="confirmVerificationCode"
      />
      <!-- Cancel Button -->
      <q-btn
        class="cancel-button text-capitalize"
        label="Cancel"
        @click="exitEmailVerificationForm"
      />
    </q-card-section>
  </q-card>
</template>

<!-- Javascript source file -->
<script src="../script/EmailVerification.js"></script>

<!-- Scoped styles for the EmailVerificationCard component -->
<style lang="scss" scoped>
@import "../style/EmailVerification.scss";
</style>
