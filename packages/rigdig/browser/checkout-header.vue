<template>
  <div>
    <p v-if="step === 1" class="rigdig-modal__copy">
      We found a match for the VIN. To purchase the report, complete the payment process below.
    </p>
    <p v-if="step === 1" class="rigdig-modal__copy">
      Reports are delivered instantly via email after payment.
    </p>
    <div class="rigdig-modal__promo">
      <img
        alt="Truck History Report Sample"
        src="https://img.overdriveonline.com/files/base/randallreilly/all/image/static/rigdigreport.jpg?w=90"
      >
      <div>
        <dl>
          <dt>Truck</dt>
          <dd>{{ truckInfo || 'Truck details unavailable' }}</dd>
          <dt>VIN</dt>
          <dd>{{ vin }}</dd>
        </dl>
      </div>
    </div>
    <div class="rigdig-modal__promo-footer">
      <span>
        1 Truck History Report
      </span>
      <strong>
        $34.99
      </strong>
    </div>
    <div v-if="email" class="rigdig-modal__teaser border">
      <span>
        Deliver to <strong>{{ email }}</strong>
      </span>
      <a href="javascript:void(0)" @click="$emit('back')">
        Edit
      </a>
    </div>
    <div class="rigdig-modal__step">
      Step {{ step }} of 2
    </div>
  </div>
</template>

<script>

export default {
  name: 'CheckoutHeader',

  props: {
    step: {
      type: Number,
      default: 1,
    },
    truckInfo: {
      type: String,
      required: true,
    },
    vin: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
  },

  emits: ['back'],
};
</script>
