import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';
export const INCREMENT_TIMER = 'INCREMENT_TIMER';

// 상태를 확인할 수 있는 CODE
export const CODE = {
  MINE: -7, // 지뢰
  NORMAL: -1, // 빈칸
  QUESTION: -2, // 헷갈리는 부분 -> 원상태는 빈칸
  FLAG: -3, // 깃발 -> 원상태는 빈칸
  QUESTION_MINE: -4, // 헷갈리는 부분 (지뢰) -> 원상태는 지뢰
  FLAG_MINE: -5, // 깃발 (지뢰) -> 원상태는 지뢰
  CLICKED_MINE: -6, // 지뢰 선택
  OPEND: 0, // 열린 부분
};

// 지뢰심기
const plantMine = (row, cell, mine) => {
  const candidate = Array(row * cell)
    .fill()
    .map((arr, i) => {
      return i;
    });

  const shuffle = [];

  // 지뢰 수만큼 shuffle에 임의의 수 넣기 ( 0 <= 임의의 수 < 칸의 수)
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(
      Math.floor(Math.random() * candidate.length),
      1
    )[0];
    shuffle.push(chosen);
  }

  const data = [];

  // 모든 칸에 기본 상태 넣기 (-1)
  for (let i = 0; i < row; i++) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }

  // 칸에 지뢰 넣기
  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }

  return data;
};

export default new Vuex.Store({
  state: {
    tableData: [],
    data: {
      row: 0,
      cell: 0,
      mine: 0,
    },
    timer: 0,
    halted: true,
    result: '',
    openedCount: 0,
  },
  getters: {},
  mutations: {
    [START_GAME](state, { row, cell, mine }) {
      state.data = {
        row,
        cell,
        mine,
      };
      state.tableData = plantMine(row, cell, mine);
      state.timer = 0;
      state.halted = false;
      state.openedCount = 0;
      state.result = '';
    },
    [OPEN_CELL](state, { row, cell }) {
      let openedCount = 0;
      const checked = [];

      // 주변 8칸 지뢰인지 확인한다.
      function checkAround(row, cell) {
        // 범위
        const checkRowOrCellIsUndefined =
          row < 0 ||
          row >= state.tableData.length ||
          cell < 0 ||
          cell >= state.tableData[0].length;

        // 범위 밖이라면 return
        if (checkRowOrCellIsUndefined) {
          return;
        }

        // 열렸거나, 깃발, 물음표일 때 열지 않아도 되니깐 return
        if (
          [
            CODE.OPEND,
            CODE.FLAG,
            CODE.FLAG_MINE,
            CODE.QUESTION_MINE,
            CODE.QUESTION,
          ].includes(state.tableData[row][cell])
        ) {
          return;
        }

        // 한 번 연 칸이면 무시하고, 열지 않았으면 checked 안에 넣어 다시 검삭 안 하게 하기
        if (checked.includes(row + '/' + cell)) {
          return;
        } else {
          checked.push(row + '/' + cell);
        }

        let around = [];
        if (state.tableData[row - 1]) {
          around = around.concat([
            state.tableData[row - 1][cell - 1],
            state.tableData[row - 1][cell],
            state.tableData[row - 1][cell + 1],
          ]);
        }
        around = around.concat([
          state.tableData[row][cell - 1],
          state.tableData[row][cell + 1],
        ]);
        if (state.tableData[row + 1]) {
          around = around.concat([
            state.tableData[row + 1][cell - 1],
            state.tableData[row + 1][cell],
            state.tableData[row + 1][cell + 1],
          ]);
        }

        // 주변 지뢰 갯수
        const counted = around.filter(function(v) {
          return [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v);
        });

        // 주변에 지뢰가 하나도 없으면
        if (counted.length === 0 && row > -1) {
          const near = [];
          if (row - 1 > -1) {
            near.push([row - 1, cell - 1]);
            near.push([row - 1, cell]);
            near.push([row - 1, cell + 1]);
          }
          near.push([row, cell - 1]);
          near.push([row, cell + 1]);
          if (row + 1 < state.tableData.length) {
            near.push([row + 1, cell - 1]);
            near.push([row + 1, cell]);
            near.push([row + 1, cell + 1]);
          }

          // 주변 8칸 연 칸이 아니면 지뢰 수 확인한다.
          near.forEach(n => {
            if (state.tableData[n[0]][n[1]] !== CODE.OPEND) {
              checkAround(n[0], n[1]);
            }
          });
        }

        // 방금 누른 칸이 지뢰가 없는 빈 칸이라면
        if (state.tableData[row][cell] === CODE.NORMAL) {
          openedCount += 1;
        }

        // 여기서 열리는거다
        Vue.set(state.tableData[row], cell, counted.length);
      }

      // 재귀함수 말고도 처음에 클릭했을 때도 지뢰 수 확인해야한다
      checkAround(row, cell);
      let halted = false;
      let result = '';

      // 연 칸의 갯수와 방금 클릭한 갯수의 합이 지뢰를 제외한 칸의 수와 같으면 승리
      if (
        state.data.row * state.data.cell - state.data.mine ===
        state.openedCount + openedCount
      ) {
        halted = true;
        result = `${state.timer}초만에 승리하셨습니다.`;
      }

      // 최종적으로 Vuex store에 저장
      state.openedCount += openedCount;
      state.halted = halted;
      state.result = result;
    },
    [CLICK_MINE](state, { row, cell }) {
      state.halted = true;
      Vue.set(state.tableData[row], cell, CODE.CLICKED_MINE);
    },
    [FLAG_CELL](state, { row, cell }) {
      if (state.tableData[row][cell] === CODE.FLAG_MINE) {
        Vue.set(state.tableData[row], cell, CODE.FLAG_MINE);
      } else {
        Vue.set(state.tableData[row], cell, CODE.FLAG);
      }
    },
    [QUESTION_CELL](state, { row, cell }) {
      if (state.tableData[row][cell] === CODE.FLAG_MINE) {
        Vue.set(state.tableData[row], cell, CODE.QUESTION_MINE);
      } else {
        Vue.set(state.tableData[row], cell, CODE.QUESTION);
      }
    },
    [NORMALIZE_CELL](state, { row, cell }) {
      if (state.tableData[row][cell] === CODE.QUESTION_MINE) {
        Vue.set(state.tableData[row], cell, CODE.MINE);
      } else {
        Vue.set(state.tableData[row], cell, CODE.NORMAL);
      }
    },
    [INCREMENT_TIMER](state) {
      state.timer += 1;
    },
  },
  actions: {},
});
