import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex); // this.$store
// Vue.use(axios); // this.$axios

// export const는 중괄호로 묶어주고, 이름이 일치해야하고, 여러개 가져올 수 있다.
// import { SET_WINNER, CLICK_CELL, CHANGE_TURN } from './store';

// 함수를 변수로 만들고, 다른 데에서 쓸 수 있게 module로 만든다
// 오타를 막기 위해서 변수를 만든다. 변수로 가져가서 오타내면 오류가 뜨기 때문
export const SET_WINNER = 'SET_WINNER';
export const CLICK_CELL = 'CLICK_CELL';
export const CHANGE_TURN = 'CHANGE_TURN';
export const RESET_GAME = 'RESET_GAME';
export const NO_WINNER = 'NO_WINNER';

// export default는 이름을 바꿀 수 있다. 가장 중요한 것 하나에 쓴다.
// import store from './store'

export default new Vuex.Store({
  state: {
    // vue data와 비슷
    tableData: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    turn: 'O',
    winner: '',
  },
  getters: {
    // vue computed와 비슷
    // 학습용 코드
    turnMessage(state) {
      return state.turn + '님이 승리하셨습니다.';
    },
  },
  mutations: {
    // state를 수정할 때 사용한다. 동기적으로
    [SET_WINNER](state, winner) {
      state.winner = winner;
    },
    [CLICK_CELL](state, { row, cell }) {
      // Vue.set을 안 쓰면 데이터는 바뀌지만, 화면엔 보이지 않는다
      // this.$set이 여긴 없다 그러므로 Vue를 불러와야한다
      Vue.set(state.tableData[row], cell, state.turn);
    },
    [CHANGE_TURN](state) {
      state.turn = state.turn === 'O' ? 'X' : 'O';
    },
    [RESET_GAME](state) {
      state.turn = 'O';
      state.tableData = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ];
    },
    [NO_WINNER](state) {
      state.winner = '';
    },
  },
  actions: {},
  // 비동기를 사용할 때, 또는 여러 뮤테이션을 연달아 실행할 때
});
