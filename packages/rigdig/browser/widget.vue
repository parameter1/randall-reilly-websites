<template>
  <div class="rigdig-widget__container">
    <div>
      <div v-if="withTag" class="rigdig-widget__website-section-name">
        <a href="https://truckhistory.overdriveonline.com/">
          New
        </a>
      </div>
      <div class="rigdig-widget__header">
        <div class="rigdig-widget__copy">
          <h1 class="rigdig-widget__title">
            {{ title }}
          </h1>
          <p class="rigdig-widget__call-to-action">
            {{ callToAction }}
          </p>
        </div>
        <img
          v-if="withMobileImg"
          class="lazyload rigdig-widget__report-img rigdig-widget__report-img--mobile"
          :data-src="mobileImgSrc"
          :data-srcset="mobileImgSrcSet"
          alt="Example Report"
        >
        <img
          v-if="withDesktopImg"
          class="lazyload rigdig-widget__report-img rigdig-widget__report-img--desktop"
          :data-src="desktopImgSrc"
          :data-srcset="desktopImgSrcSet"
          alt="Attachments Idea Book Cover"
        >
      </div>
      <form
        ref="form"
        class="rigdig-widget__form"
        :disabled="loading"
        @submit.prevent="handleSubmit"
      >
        <div class="rigdig-widget__form-group">
          <label class="rigdig-widget__label">
            <div v-if="inputLabel" class="rigdig-widget__label-text">{{ inputLabel }}</div>
            <input
              ref="input"
              v-model="vin"
              class="form-control rigdig-widget__vin"
              type="text"
              :readonly="loading"
              :placeholder="placeholder"
              required
            >
          </label>
        </div>

        <div class="rigdig-widget__buttons">
          <button type="submit" class="btn btn-primary rigdig-widget__submit" :disabled="loading">
            <div class="d-flex align-items-center">
              <span>{{ buttonLabel }}</span>
              <div
                v-show="loading"
                class="spinner-border spinner-border-sm text-light ml-1"
                role="status"
              >
                <span class="sr-only">Loading…</span>
              </div>
            </div>
          </button>
          <button
            v-if="vin && attempted"
            type="reset"
            class="btn btn-secondary ml-1 rigdig-widget__reset"
            :disabled="loading"
            @click="reset"
          >
            Reset
          </button>
          <a
            v-if="learnMoreText && learnMoreUrl"
            class="learn-more-link"
            :href="learnMoreUrl"
            title="Truck History Report"
          >
            {{ learnMoreText }}
          </a>
        </div>
        <alert-error v-if="error" title="Unable to look up VIN.">
          <!-- Invalid Vin Provided and API returns 400 -->
          <p v-if="status === 400">
            The Vehicle Identification Number supplied is invalid.
          </p>
          <!-- Found the vin, and api returns okay but no reports & we return a 400 internally-->
          <p v-else-if="status === 404">
            No report could be found with the Vehicle Identification Number you supplied.
          </p>
          <!-- Display other abnormal errors -->
          <p v-else>
            {{ error }}
          </p>
        </alert-error>
        <div v-if="withDetails" class="rigdig-widget__form-group--details">
          <label class="rigdig-widget__label">
            Reports Include
          </label>
          <ul class="rigdig-widget__benifits-list">
            <li><icon-check-circle class="mr-2" />Reported accidents</li>
            <li><icon-check-circle class="mr-2" />Reported inspection violations</li>
            <li><icon-check-circle class="mr-2" />Title and odometer brands</li>
            <li><icon-check-circle class="mr-2" />Reported insurance claims</li>
            <li><icon-check-circle class="mr-2" />Carrier/owner history</li>
            <li><icon-check-circle class="mr-2" />Manufacturer recall notices</li>
            <li><icon-check-circle class="mr-2" />Plus more vehicle data</li>
          </ul>
          <div class="rigdig-widget__pricing">
            <span>Price</span> <span>$34.95</span>
          </div>
          <div class="rigdig-widget__info">
            <icon-email class="mr-2" /> Reports are delivered immediately via email
          </div>
        </div>
      </form>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <checkout-modal
          v-if="verified"
          :country-code="countryCode"
          :email="email"
          :zip="zip"
          :vin="vin"
          :truck-info="truckInfo"
          :environment="environment"
          :payment-methods="paymentMethods"
          :pretax-amount="pretaxAmount"
          :debug="debug"
          @cancel="reset"
          @error="(e) => emit('thr_error', e)"
          @purchase="(e) => emit('thr_purchase', e)"
          @generate="(e) => emit('thr_generate', e)"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import IconEmail from '@parameter1/base-cms-marko-web-icons/browser/mail.vue';
import IconCheckCircle from '@parameter1/base-cms-marko-web-icons/browser/check-circle.vue';

import CheckoutModal from './checkout-modal.vue';
import AlertError from './alert-error.vue';

export default {
  name: 'RigDigWidget',

  components: {
    IconCheckCircle,
    IconEmail,
    AlertError,
    CheckoutModal,
  },

  inject: ['EventBus'],

  props: {
    countryCode: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    zip: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: 'Look up a report by VIN',
    },
    callToAction: {
      type: String,
      default: 'Enter a VIN (17-characters) to see if we have a report in our database',
    },
    queryVin: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: 'Enter Truck VIN',
    },
    buttonLabel: {
      type: String,
      default: 'Find Report',
    },
    inputLabel: {
      type: String,
      default: null,
    },
    environment: {
      type: String,
      default: 'SANDBOX',
      validator(v) {
        return ['SANDBOX', 'LIVE'].includes(v);
      },
    },
    learnMoreText: {
      type: String,
      default: null,
    },
    learnMoreUrl: {
      type: String,
      default: 'https://truckhistory.overdriveonline.com/',
    },
    withDesktopImg: {
      type: Boolean,
      default: false,
    },
    desktopImgSrc: {
      type: String,
      default: 'https://img.overdriveonline.com/files/base/randallreilly/all/image/static/inbody-preview.svg?h=252',
    },
    desktopImgSrcSet: {
      type: String,
      default: "['https://img.overdriveonline.com/files/base/randallreilly/all/image/static/inbody-preview.svg?h=252&dpr=2 2x']",
    },
    withMobileImg: {
      type: Boolean,
      default: false,
    },
    mobileImgSrc: {
      type: String,
      default: 'https://img.overdriveonline.com/files/base/randallreilly/all/image/static/rigdigreport-full.svg?w=95',
    },
    mobileImgSrcSet: {
      type: String,
      default: "['https://img.overdriveonline.com/files/base/randallreilly/all/image/static/rigdigreport-full.svg?w=95&dpr=2 2x']",
    },
    paymentMethods: {
      type: Array,
      default: () => ['CreditCard', 'ApplePay'],
    },
    pretaxAmount: {
      type: Number,
      default: null,
    },
    withDetails: {
      type: Boolean,
      dafault: false,
    },
    withTag: {
      type: Boolean,
      default: false,
    },
    debug: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: 'landing page',
      validator(v) {
        return ['landing page', 'widget'].includes(v);
      },
    },
  },

  emits: ['thr_lookup', 'thr_error', 'thr_purchase', 'thr_generate'],

  data: () => ({
    attempted: false,
    error: null,
    status: null,
    loading: false,
    vin: null,
    verified: false,
    truckInfo: null,
  }),

  mounted() {
    if (this.queryVin) {
      this.vin = this.queryVin;
      this.$nextTick(() => {
        this.handleSubmit();
      });
    }
  },

  methods: {
    emit(name, args = {}) {
      const { EventBus } = this;
      const eventArgs = { vin: this.vin, thr_source: this.source };
      EventBus.$emit(name, { ...eventArgs, ...args });
    },
    reset() {
      this.error = null;
      this.attempted = false;
      this.verified = false;
      this.$refs.input.focus();
    },
    async handleSubmit() {
      this.vin = this.vin ? `${this.vin}`.trim() : this.vin;
      this.error = null;
      this.status = null;
      this.loading = true;
      try {
        const response = await fetch('/__rigdig/verify', {
          method: 'post',
          headers: { 'content-type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ vin: [this.vin] }),
        });
        if (!response.ok) {
          let message = `RigDig Lookup failure: ${response.status} ${response.statusText}`;
          // 5TEVL52N0YZ700762
          try {
            const { error } = await response.json();
            if (error) message = error;
          } catch (e) {
            // noop
          }
          const error = new Error(message);
          error.code = response.status;
          this.status = error.code;
          throw error;
        }
        const { PoweredByVinLink: { year, make, model } } = await response.json();
        this.truckInfo = `${year} ${make} ${model}`;
        this.verified = true;
        this.emit('thr_lookup', { status: 'found' });
      } catch (e) {
        this.emit('thr_lookup', { status: 'not found', message: e.message });
        this.error = e.message;
        this.loading = false;
        this.$refs.input.focus();
      } finally {
        this.attempted = true;
        this.loading = false;
      }
    },
  },

};
</script>
