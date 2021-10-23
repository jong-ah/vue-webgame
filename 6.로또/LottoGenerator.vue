<template>
  <div>
    <div>당첨 숫자</div>
    <div id="결과창">
      <!-- props를 v-bind할 수 있고, ball을 넣어줄 수 있다 -->
      <lotto-ball
        v-for="ball in winBalls"
        :key="ball"
        :number="ball"
      ></lotto-ball>
    </div>
    <div>보너스</div>
    <lotto-ball v-if="bonus" :number="bonus"></lotto-ball>
    <button v-if="redo" @click="onClickRedo">한 번 더!</button>
  </div>
</template>

<script>
import LottoBall from './LottoBall.vue';

function getWinNumbers() {
  const candidate = Array(45)
    .fill()
    .map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(
      candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]
    );
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  return [...winNumbers, bonusNumber];
}

const timeouts = [];

export default {
  // PascalCase는 자동으로 kebab-case로 바꿔준다 (호환)
  // 이름이 다르다면 key:value형태로 표시해야 한다 (대부분 놉)
  components: { LottoBall },
  data() {
    return {
      // 숫자를 뽑아놓고, 시각적인 용도로 볼에 조금씩 늦게 전달해준다
      winNumbers: getWinNumbers(),
      winBalls: [],
      bonus: null,
      redo: false,
    };
  },
  methods: {
    onClickRedo() {
      this.winNumbers = getWinNumbers();
      this.winBalls = [];
      this.bonus = null;
      this.redo = false;
      this.showBalls();
    },
    showBalls() {
      for (let i = 0; i < this.winNumbers.length - 1; i++) {
        timeouts[i] = setTimeout(() => {
          this.winBalls.push(this.winNumbers[i]);
        }, (i + 1) * 1000);
      }
      timeouts[6] = setTimeout(() => {
        this.bonus = this.winNumbers[6];
        this.redo = true;
      }, 7000);
    },
  },
  mounted() {
    this.showBalls();
  },
  beforeDestroy() {
    timeouts.forEach(t => {
      clearTimeout(t);
    });
  },
  watch: {
    // 최대한 watch사용 안 하는 것이 좋다
    // 무한반복될 수 있다. 남용주의
    // computed, watch 둘 다 데이터나 props가 바꿨을 때 자동으로 실행되는데
    // computed는 하나의 값을 리턴하고,
    // watch는 특정 동작을 수행한다.
    bonus(val, oldVal) {
      // 참조값이라서 구별되지 않지만, 현재값 예전값이 보여준다
      // 원시타입이면 구분이 잘 된다
      console.log(val, oldVal);
      if (val.length === 0) {
        console.log('변수의 값을 감시한다. bonus 값이 바꿨다');
      }
    },
  },
};
</script>

<style scoped></style>
