<template>
  <q-card class="email-verification-card text-white">
    <q-card-section>
      <q-form class="email-verification-form">
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
          <template v-slot:prepend>
            <q-icon name="domain_verification" color="orange-8" />
          </template>
        </q-input>
      </q-form>
    </q-card-section>

    <q-card-section class="lower-buttons">
      <q-btn
        class="send-button text-capitalize"
        label="Send"
        @click="confirmVerificationCode"
      />
      <q-btn
        class="cancel-button text-capitalize"
        label="Cancel"
        @click="exitEmailVerificationForm"
      />
    </q-card-section>
  </q-card>
</template>

<script src="../script/EmailVerification.js"></script>

<style lang="scss" scoped>
@import "../style/EmailVerification.scss";
</style>
