<template>
  <div v-if="loadCount > 1" class="load-analyzer__toggler-wrapper">
    <button
      v-for="index in loadCount"
      :key="index"
      :data-load-id="index - 1"
      class="mr-3 mb-3 btn btn-load btn-load-toggler"
      @click="showLoad(index - 1)"
    >
      Load {{ index }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'LoadToggler',

  props: {
    loadCount: {
      type: Number,
      default: 1,
    },
    targetClass: {
      type: String,
      default: 'load-wrapper',
    },
  },

  data: () => ({}),

  mounted() {
    this.showLoad(0);
  },
  methods: {
    showLoad(key) {
      const loads = document.querySelectorAll('.load-wrapper');
      const btns = document.querySelectorAll('.btn-load-toggler');

      loads.forEach((load) => {
        if (Number(load.dataset.loadId) !== Number(key)) {
          load.classList.add('d-none');
        } else {
          load.classList.remove('d-none');
        }
      });
      btns.forEach((btn) => {
        if (Number(btn.dataset.loadId) !== Number(key)) {
          btn.classList.remove('active');
        } else {
          btn.classList.add('active');
        }
      });
    },
  },
};
</script>
