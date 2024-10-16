<template>
  <div class="load-analyzer__container">
    <div>
      <div class="load-analyzer__header">
        <div class="load-analyzer__copy">
          <h1 class="load-analyzer__title">
            {{ title }}
          </h1>
          <p class="load-analyzer__call-to-action">
            {{ description }}
          </p>
        </div>
      </div>
      <form
        ref="form"
        class="load-analyzer__form"
        :disabled="loading"
        @submit.prevent="handleSubmit"
      >
        <div class="cost">
          <legend class="load-analyzer__title h3 w-auto">
            Cost
          </legend>
          <legend class="p small info w-auto">
            Enter cost information
          </legend>
          <fieldset class="border mb-3 cost-block">
            <div class="load-analyzer__form-group">
              <label class="load-analyzer__label p-3">
                <div class="load-analyzer__label-text">
                  Fixed cost per day under load
                </div>
                <input
                  ref="input"
                  v-model="fixedCost"
                  class="form-control load-analyzer__fixedCost"
                  type="number"
                  min="0.00"
                  max="250000"
                  :readonly="loading"
                  :placeholder="placeholder"
                  required
                >
              </label>
            </div>

            <div class="load-analyzer__form-group">
              <label class="load-analyzer__label p-3">
                <div class="load-analyzer__label-text">
                  Salary per day under load
                </div>
                <input
                  ref="input"
                  v-model="salary"
                  class="form-control load-analyzer__salary"
                  type="number"
                  min="0.00"
                  max="2500000"
                  :readonly="loading"
                  :placeholder="placeholder"
                  required
                >
              </label>
            </div>

            <div class="load-analyzer__form-group">
              <label class="load-analyzer__label p-3">
                <div class="load-analyzer__label-text">
                  Vairable cost per mile
                </div>
                <input
                  ref="input"
                  v-model="varCostPerMile"
                  class="form-control load-analyzer__varCostPerMile"
                  type="number"
                  min="0.00"
                  step="0.05"
                  max="2500000"
                  :readonly="loading"
                  :placeholder="placeholder"
                  required
                >
              </label>
            </div>
          </fieldset>
        </div>
        <legend class="load-analyzer__title h3 w-auto mt-block">
          Load Information
        </legend>
        <legend class="p small info w-auto">
          Enter Load Information for one or more loads
        </legend>
        <div
          v-for="(load, index) in loads"
          :key="index"
          class="load border mb-3"
        >
          <legend class="load-analyzer__title h6 w-auto">
            Load {{ index + 1 }}
            <span
              v-if="index !== 0"
              class="load-analyzer__remove-btn"
            >
              <a
                href="javascript:void(0)"
                role="button"
                @click="removeLoad(index)"
              >
                Remove
              </a>
            </span>
          </legend>
          <fieldset class="load-block">
            <div class="load-analyzer__form-group">
              <label class="load-analyzer__label p-3">
                <div class="load-analyzer__label-text">Days to haul the load (in 1/4 days)</div>
                <input
                  ref="input"
                  v-model="load.quarterDays"
                  class="form-control load-analyzer__quarterDays"
                  type="number"
                  min="0.00"
                  step="0.25"
                  max="2500000"
                  :readonly="loading"
                  :placeholder="placeholder"
                  required
                >
              </label>
            </div>

            <div class="load-analyzer__form-group">
              <label class="load-analyzer__label p-3">
                <div class="load-analyzer__label-text">Deadhead Miles</div>
                <input
                  ref="input"
                  v-model="load.deadheadMiles"
                  class="form-control load-analyzer__deadheadMiles"
                  type="number"
                  min="1"
                  step="1"
                  max="2500000"
                  :readonly="loading"
                  :placeholder="placeholder"
                  required
                >
              </label>
            </div>

            <div class="load-analyzer__form-group">
              <label class="load-analyzer__label p-3">
                <div class="load-analyzer__label-text">Loaded Miles</div>
                <input
                  ref="input"
                  v-model="load.loadedMiles"
                  class="form-control load-analyzer__loadedMiles"
                  type="number"
                  min="1"
                  step="1"
                  max="2500000"
                  :readonly="loading"
                  :placeholder="placeholder"
                  required
                >
              </label>
            </div>

            <div class="load-analyzer__form-group">
              <label class="load-analyzer__label p-3">
                <div class="load-analyzer__label-text">Total miles</div>
                <div class="load-analyzer__totalMiles">
                  {{ Number(load.loadedMiles) + Number(load.deadheadMiles) }}
                </div>
              </label>
            </div>

            <div class="load-analyzer__form-group">
              <label class="load-analyzer__label p-3">
                <div class="load-analyzer__label-text">Gross Rate</div>
                <input
                  ref="input"
                  v-model="load.grossRate"
                  class="form-control load-analyzer__grossRate"
                  type="number"
                  min="0.00"
                  max="2500000"
                  :readonly="loading"
                  :placeholder="placeholder"
                  required
                >
              </label>
            </div>
          </fieldset>
        </div>
        <div v-if="hasUserInput" class="load-analyzer__buttons">
          <a
            href="javascript:void(0)"
            role="button"
            class="btn mb-3 load-analyzer__add-load"
            :disabled="loading"
            @click="addLoad()"
          >
            + Add Another Load
          </a>
        </div>

        <div v-if="hasUserInput" class="load-analyzer__buttons">
          <button
            type="submit"
            class="btn btn-primary load-analyzer__submit"
            :disabled="loading"
          >
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
            v-if="hasUserInput"
            type="reset"
            class="btn btn-secondary ml-3 load-analyzer__reset"
            :disabled="loading"
            @click="reset"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LoadAnalyzer',

  props: {
    title: {
      type: String,
      default: 'Load Analyzer',
    },
    description: {
      type: String,
      default: '',
    },
    placeholder: {
      type: Number,
      default: 0,
    },
    buttonLabel: {
      type: String,
      default: 'Calculate Results',
    },
  },

  data: () => ({
    cookieName: 'loadAnalyzer',
    attempted: false,
    error: null,
    status: null,
    loading: false,
    fixedCost: null,
    salary: null,
    varCostPerMile: null,
    verified: false,
    truckInfo: null,
    loads: [],
    defaultLoad: {
      quarterDays: null,
      deadheadMiles: null,
      loadedMiles: null,
      grossRate: null,
    },
    fieldsToCheck: [
      'fixedCost',
      'salary',
      'varCostPerMile',
    ],
  }),

  computed: {
    hasUserInput() {
      let hasInput = false;
      this.fieldsToCheck.forEach((field) => {
        if (this[field]) hasInput = true;
      });
      this.loads.forEach((load) => {
        Object.keys(this.defaultLoad).forEach((field) => {
          if (load[field]) hasInput = true;
        });
      });
      return hasInput;
    },
  },

  created() {
    const cookie = this.getCookie();
    if (cookie) {
      const { payload } = JSON.parse(cookie);
      Object.entries(payload).forEach(([key, value]) => {
        if ((this.fieldsToCheck.includes(key) || key === 'loads') && value) {
          this[key] = value;
        }
      });
    }
    if (this.loads.length === 0) {
      const newLoad = { ...this.defaultLoad };
      this.loads.push(newLoad);
    }
  },
  methods: {
    async setCookie(payload) {
      const expires = '';
      const value = JSON.stringify({ payload });
      document.cookie = `${this.cookieName}=${(value || '')} ${expires}`;
    },
    addLoad() {
      const newLoad = { ...this.defaultLoad };
      this.loads.push(newLoad);
    },
    removeLoad(index) {
      this.loads.splice(index);
    },
    getCookie() {
      const nameEQ = `${this.cookieName}=`;
      const ca = document.cookie.split(';');
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
    reset() {
      this.fieldsToCheck.forEach((field) => { this[field] = 0; });
      this.loads = [this.defaultLoad];
    },
    async handleSubmit() {
      this.error = null;
      this.status = null;
      this.loading = true;
      const {
        fixedCost,
        salary,
        varCostPerMile,
        loads,
      } = this;
      await this.setCookie({
        fixedCost,
        salary,
        varCostPerMile,
        loads,
      });
      this.loading = false;
      window.location = '/load-analyzer/submit';
    },
  },

};
</script>
