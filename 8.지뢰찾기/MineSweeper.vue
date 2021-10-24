<template>
  <div>
    <mine-form />
    <div>{{ timer }}</div>
    <table-component />
    <div>{{ result }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store, { INCREMENT_TIMER } from './store';
import TableComponent from './TableComponent';
import MineForm from './MineForm';

let interval;

export default {
  store,
  components: { MineForm, TableComponent },
  computed: {
    ...mapState(['timer', 'result', 'halted']),
  },
  methods: {},
  watch: {
    // 통제된 환경에선 watch써도 된다
    // 초기화 halted 중단된 상태 -> 시작 버튼 누름 -> halted 게임 진행된 상태
    halted(value, oldValue) {
      if (value === false) {
        interval = setInterval(() => {
          this.$store.commit(INCREMENT_TIMER);
          // new Date() 시간이 중요할 때는 이전시간과 현재 시간을 빼서 비교해야한다
        }, 1000);
      } else {
        clearInterval(interval);
      }
    },
  },
};
</script>

<style>
table {
  border-collapse: collapse;
}
td {
  border: 1px solid black;
  width: 40px;
  height: 40px;
  text-align: center;
}
</style>
