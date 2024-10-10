<template>
  <div class="rigdig-modal">
    <div class="rigdig-modal__wrapper">
      <!-- @todo swap this for bootstrap modal? -->
      <div class="rigdig-modal__container">
        <h2 class="rigdig-modal__subtitle">
          <icon-check-circle v-if="complete" :modifiers="['xl', 'complete']" />
          {{ title }}
          <button class="btn btn-text rigdig-modal__close" @click="$emit('cancel')">
            <icon-x />
          </button>
        </h2>
        <div v-if="complete" class="rigdig-modal__content rigdig-modal__content--complete">
          <div class="rigdig-modal__payment-details">
            <div>
              <dl>
                <dt>Order Details</dt>
                <dd class="small">
                  {{ truckInfo || 'Truck details unavailable' }}
                </dd>
                <dd class="small">
                  {{ vin }}
                </dd>
                <dd class="small">
                  ${{ total }}
                </dd>
              </dl>
            </div>
            <p>
              The Truck History Report you requested has been sent to
              <strong> {{ userEmail }}</strong>. You can also access the report at the link below.
            </p>
          </div>
          <div class="rigdig-modal__buttons mt-1">
            <a :href="createdAtUri" title="Download your report" target="_blank">
              <button
                type="submit"
                class="btn btn-primary btn-block rigdig-widget__submit"
                :disabled="loading"
              >
                <div class="d-flex align-items-center justify-content-between">
                  <div style="width:1.5rem" />
                  <span>View Report</span>
                  <div style="width:1.5rem">
                    <div
                      v-show="loading"
                      class="spinner-border spinner-border-sm text-light ml-1"
                      role="status"
                    >
                      <span class="sr-only">Generating Report…</span>
                    </div>
                  </div>
                </div>
              </button>
            </a>
          </div>
        </div>
        <div v-else-if="transactionId" class="rigdig-modal__content">
          <checkout-header
            :sales-tax="salesTax"
            :pretax-amount="pretaxAmount"
            :truck-info="truckInfo"
            :vin="vin"
            title="Sending Report!"
            :email="userEmail"
            :step="2"
          />
          <alert-error v-if="error" :show-help="false" title="Unable to send report.">
            <p>
              We are unable to generate the report at this time.<br>
              Please contact us at <a :href="`mailto:${supportEmail}`">{{ supportEmail }}</a>
            </p>
            <p>
              <strong>VIN:</strong> {{ vin }}<br>
              <strong>Transaction ID:</strong> {{ transactionId }}
            </p>
          </alert-error>
          <div v-else>
            <p>Your payment was processed successfully.</p>
            <p>Your transaction ID was {{ transactionId }}.</p>
            <p class="mb-0">
              We're sending your truck history report now!
            </p>

            <div class="rigdig-modal__buttons mt-1">
              <button
                type="submit"
                class="btn btn-secondary rigdig-widget__generate"
                :disabled="loading"
                @click="generate"
              >
                <div class="d-flex align-items-center">
                  <span>Send Report</span>
                  <div
                    v-show="loading"
                    class="spinner-border spinner-border-sm text-light ml-1"
                    role="status"
                  >
                    <span class="sr-only">Sending report…</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="rigdig-modal__content">
          <checkout-header
            :sales-tax="salesTax"
            :pretax-amount="pretaxAmount"
            :truck-info="truckInfo"
            :vin="vin"
            title="Report found!"
            :email="transactionToken ? userEmail : ''"
            :step="transactionToken ? 2 : 1"
            @back="cancelCheckout"
          />

          <template v-if="!transactionToken">
            <p class="rigdig-modal__copy">
              Where should we send the report?
            </p>
            <form :disabled="loading" @submit.prevent="handleSubmit">
              <!-- <div class="rigdig-modal__form_group">
                <label class="rigdig-modal__label">
                  <div class="rigdig-widget__label-text">Vehicle Identification Number</div>
                  <input
                    ref="vin"
                    :value="vin"
                    class="form-control disabled rigdig-modal__vin"
                    type="text"
                    disabled
                  >
                </label>
              </div> -->
              <div class="rigdig-modal__form_group">
                <label class="rigdig-modal__label">
                  <template v-if="email">
                    <div class="rigdig-modal__label-text">
                      Email
                      <span class="rigdig-modal__signout-link">
                        Not you?&nbsp;
                        <a class="my-2" href="/user/logout">Click here to sign out</a>.
                      </span>
                    </div>
                    <input
                      ref="email"
                      :value="email"
                      class="form-control disabled rigdig-modal__email"
                      type="email"
                      disabled
                    >
                  </template>
                  <template v-else>
                    <div class="rigdig-widget__label-text">Email</div>
                    <input
                      ref="email"
                      v-model="userEmail"
                      class="form-control rigdig-modal__email"
                      type="email"
                      required
                    >
                  </template>
                </label>
                <country-code
                  v-model="userCountryCode"
                  class-name="rigdig-modal__form-group"
                  :required="true"
                  label="Country"
                />
                <label v-if="zipRequired" class="rigdig-modal__label">
                  <template v-if="zip">
                    <div class="rigdig-widget__label-text">
                      Postal/Zip Code <strong class="text-danger">*</strong>
                    </div>
                    <input
                      ref="zip"
                      :value="zip"
                      class="form-control rigdig-modal__zip"
                      type="text"
                      required
                    >
                  </template>
                  <template v-else>
                    <div class="rigdig-widget__label-text">
                      Postal/Zip Code <strong class="text-danger">*</strong>
                    </div>
                    <input
                      ref="zip"
                      v-model="userZip"
                      class="form-control rigdig-modal__zip"
                      type="text"
                      required
                    >
                  </template>
                </label>
              </div>

              <div class="rigdig-modal__buttons">
                <button
                  type="submit"
                  class="btn btn-primary btn-block rigdig-widget__submit"
                  :disabled="loading"
                >
                  <div class="d-flex align-items-center justify-content-between">
                    <div style="width:1.5rem" />
                    <span>Next</span>
                    <div style="width:1.5rem">
                      <div
                        v-show="loading"
                        class="spinner-border spinner-border-sm text-light ml-1"
                        role="status"
                      >
                        <span class="sr-only">Processing…</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </form>
            <alert-error v-if="error" :show-help="false" title="Unable to start checkout.">
              <p>
                The email address or zip code you supplied is invalid.
                Please verify and try again or
                <a :href="`mailto:${supportEmail}`">contact us</a>.
              </p>
            </alert-error>
          </template>

          <alert-error v-if="transactionToken && error" title="Unable to purchase report.">
            <p>We weren't able to purchase the Truck History Report.</p>
            <p>
              Review the form below, or
              <a href="javascript:void(0)" @click="handleSubmit">click here</a> to start over.
            </p>
          </alert-error>
        </div>

        <!-- The PayFabric render target -->
        <div id="payfabricTarget" ref="payfabricTarget" />
      </div>
    </div>
  </div>
</template>

<script>
import IconX from '@parameter1/base-cms-marko-web-icons/browser/x.vue';
import IconCheckCircle from '@parameter1/base-cms-marko-web-icons/browser/check-circle.vue';
import CountryCode from '@parameter1/base-cms-marko-web-identity-x/browser/form/fields/country.vue';
import AlertError from './alert-error.vue';
import CheckoutHeader from './checkout-header.vue';

export default {
  name: 'RigDigCheckoutModal',

  components: {
    AlertError,
    CheckoutHeader,
    CountryCode,
    IconX,
    IconCheckCircle,
  },

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
    buttonLabel: {
      type: String,
      default: 'Start checkout',
    },
    vin: {
      type: String,
      default: null,
    },
    truckInfo: {
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
    paymentMethods: {
      type: Array,
      default: () => ['CreditCard', 'ApplePay'],
    },
    pretaxAmount: {
      type: Number,
      default: null,
    },
    debug: {
      type: Boolean,
      default: false,
    },
    supportEmail: {
      type: String,
      default: 'support@rigdig.com',
    },
  },

  emits: ['cancel', 'purchase', 'error', 'generate'],

  data: () => ({
    userCountryCode: 'US',
    userEmail: null,
    userZip: null,
    error: null,
    loading: false,
    complete: false,
    salesTax: null,
    transactionToken: null,
    transactionId: null,
    client: null,
    createdAtUri: null,
  }),

  computed: {
    title() {
      return this.complete ? 'Payment Received!' : 'Report Found!';
    },
    total() {
      return (this.salesTax + this.pretaxAmount).toFixed(2);
    },
    zipRequired() {
      return new Set(['US', 'CA']).has(this.userCountryCode);
    },
  },

  created() {
    if (this.email) {
      this.userEmail = this.email;
    }
    if (this.zip) {
      this.userZip = this.zip;
    }
    if (this.countryCode) {
      this.userCountryCode = this.countryCode;
    }
  },

  methods: {
    /**
     *
     */
    async handleSubmit() {
      this.error = null;
      this.loading = true;
      this.complete = false;

      // Create a transaction
      try {
        const token = await this.createTransaction();
        this.transactionToken = token;
      } catch (e) {
        this.error = `Unable to create a transaction: ${e.message}.`;
        this.$emit('error', { message: this.error.message });
        return false;
      } finally {
        this.loading = false;
      }

      // access payfabric sdk client and perform checkout
      try {
        await this.startCheckout();
      } catch (e) {
        this.error = e.message;
        this.loading = false;
      } finally {
        this.loading = false;
      }
      return true;
    },

    /**
     *
     */
    async createTransaction() {
      const response = await fetch('/__payfabric/create-transaction-token', {
        method: 'post',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          vin: this.vin,
          countryCode: this.userCountryCode,
          email: this.userEmail,
          zip: this.userZip,
        }),
      });
      if (!response.ok) {
        let message = `PayFabric Purchase failure: ${response.status} ${response.statusText}`;
        try {
          const { error } = await response.json();
          if (error) message = error;
        } catch (e) {
          // noop
        }
        const error = new Error(message);
        error.code = response.status;
        throw error;
      }
      const { Token, salesTax } = await response.json();
      this.salesTax = salesTax;
      return Token;
    },

    /**
     *
     */
    async startCheckout() {
      // eslint-disable-next-line new-cap, no-new, no-undef
      this.client = new payfabricpayments({
        debug: this.debug,
        environment: this.environment,
        target: 'payfabricTarget',
        displayMethod: 'IN_PLACE',
        useDefaultWallet: false,
        acceptedPaymentMethods: this.paymentMethods,
        session: this.transactionToken,
        disableCancel: true,
        successCallback: (...args) => this.handleSuccess(args),
        failureCallback: (e) => {
          if (e.ResponseMsg === 'JWT token has expired.') {
            // Clear the client session, crete a new token, and re-start checkout
            this.client.destroy();
            this.transactionToken = null;
            this.loading = true;
            this.handleSubmit();
          } else {
            // Undo SDK opacity/pointer change. Why isn't the SDK calling this?
            this.client.transactionStoppedProcessing(this.client, e);
            this.error = e.ResponseMsg;
            this.$emit('error', { message: this.error.message });
          }
        },
        cancelCallback: () => {
          // Clear the transaction to start fresh.
          this.client.destroy();
          this.transactionToken = null;
        },
      });
    },

    async cancelCheckout() {
      this.transactionToken = null;
      if (this.client) this.client.destroy();
    },

    /**
     * Send completed transaction id to endpoint, trigger email send
     * Update messaging, display thankyou/etc.
     */
    async handleSuccess([{ TrxKey: transactionId }]) {
      this.error = null;
      this.complete = false;
      this.transactionId = transactionId;
      this.$emit('purchase', { transactionId });
      return this.generate();
    },

    /**
     *
     */
    async generate() {
      this.error = null;
      this.complete = false;
      this.loading = true;
      try {
        const email = this.userEmail;
        const { vin, transactionId } = this;
        const r = await fetch('/__rigdig/complete', {
          headers: { 'content-type': 'application/json' },
          method: 'post',
          body: JSON.stringify({ vin, email, transactionId }),
        });
        if (!r.ok) {
          let message = `RigDig generation failure: ${r.status} ${r.statusText}`;
          try {
            const { error } = await r.json();
            if (error) message = error;
          } catch (e) {
            // noop
          }
          const error = new Error(message);
          error.code = r.status;
          this.$emit('error', { transactionId, message: error.message });
          throw error;
        }

        const data = await r.json();
        const { report } = data;
        const { createdAtUri } = report;
        this.createdAtUri = createdAtUri;
        this.complete = true;
        this.$emit('generate', { transactionId, createdAtUri });
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
