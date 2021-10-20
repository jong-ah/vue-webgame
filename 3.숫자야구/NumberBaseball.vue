<template>
  <div>
    <h1>{{ result }}</h1>
    <!-- v-on를 @로 바꿀 수 있다 -->
    <!-- e.preventDefault() 적용할 수 있다 -->
    <form @submit.prevent="onSubmitForm">
      <input ref="answer" minlength="4" maxlength="4" v-model="value" />
      <button type="submit">입력</button>
    </form>
    <div>시도: {{ tries.length }}</div>
    <ul>
      <!-- try는 예약어라서 쓸 수 없다 -->
      <!-- 같은 숫자를 입력할 수 있기 때문에 key를 index로 줬다 -->
      <!-- 예약어 : 컴퓨터 프로그래밍 언어에서 이미 문법적인 용도로 사용되고 있기 때문에 식별자로 사용할 수 없는 단어들 -->
      <li v-for="(t, index) in tries" :key="index">
        <div>{{ t.try }}</div>
        <div>{{ t.result }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
const getNumber = () => {
  const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const array = [];
  for (let i = 0; i < 4; i += 1) {
    const temp = candidates.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    array.push(temp);
  }
  return array;
};

export default {
  data() {
    // 화면에 보여주면 data
    return {
      answer: getNumber(), // [1,2,3,4] 정답은 배열이므로 join('')해서 비교한다
      tries: [],
      value: '',
      result: '',
    };
  },
  methods: {
    onSubmitForm() {
      if (this.value === this.answer.join('')) {
        this.tries.push({
          try: this.value,
          result: '홈런',
        });
        this.result = '홈런';
        alert('게임을 다시 실행합니다.');
        // 초기화 코드 만든다
        this.value = '';
        this.answer = getNumber();
        this.tries = [];
        this.$refs.answer.focus();
      } else {
        if (this.tries.length >= 9) {
          this.result = `10번 넘게 틀려서 실패! 답은 ${this.answer.join(
            ','
          )}였습니다!`;
          alert('게임을 다시 시작합니다.');
          this.value = '';
          this.answer = getNumber();
          this.tries = [];
          this.$refs.answer.focus();
        }
        // 화면에 보여지지 않는건 data가 아닌 변수로 선언하면 된다.
        let strike = 0;
        let ball = 0;
        // .map(v => parseInt(v))
        const answerArray = this.value.split('').map(Number);
        for (let i = 0; i < 4; i += 1) {
          if (answerArray[i] === this.answer[i]) {
            strike++;
          } else if (this.answer.includes(answerArray[i])) {
            ball++;
          }
        }
        this.tries.push({
          try: this.value,
          result: `${strike} 스트라이크, ${ball} 볼입니다.`,
        });
        this.value = '';
        this.$refs.answer.focus();
      }
    },
  },
};
</script>

<style></style>
