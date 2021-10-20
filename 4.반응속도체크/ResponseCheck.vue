<template>
  <!-- template 안에 바로 template을 못 쓴다 -->
  <!-- 의미없는 div를 피하기 위해 react는 Fragment를 사용한다 -->
  <div>
    <!-- v-bind:class="state" 축약하면 :만 쓰면 된다 -->
    <div id="screen" :class="state" @click="onClickScreen">{{ message }}</div>
    <!-- v-show style="display: none" 태그가 있지만 눈에 보이지 않게 한다-->
    <!-- v-if 태그 자체가 존재하지 않는다-->
    <!-- 감싸주는 역할만이라면 div가 아닌 template을 쓰면 된다 -->
    <template v-if="result.length">
      <div>평균 시간: {{ average }}ms</div>
      <button @click="onReset">리셋</button>
    </template>
  </div>
</template>

<script>
let startTime = 0;
let endTime = 0;
let timeout = null;
export default {
  data() {
    return {
      result: [],
      state: 'waiting',
      message: '클릭해서 시작하세요.',
    };
  },
  computed: {
    // 일반 데이터를 가공해서 쓸 때 사용하고, 가공된 데이터가 캐싱된다
    // computed vs watch : https://kr.vuejs.org/v2/guide/computed.html
    average() {
      const num =
        this.result.reduce((a, c) => a + c, 0) / this.result.length || 0;
      // 소수점 반올림
      return num.toFixed(2);
    },
  },
  methods: {
    onReset() {
      this.result = [];
    },
    onClickScreen() {
      if (this.state === 'waiting') {
        this.state = 'ready';
        this.message = '초록색이 되면 클릭하세요.';
        timeout = setTimeout(() => {
          this.state = 'now';
          this.message = '지금 클릭!';
          startTime = new Date();
        }, Math.floor(Math.random() * 1000) + 2000); // 2~3초
      } else if (this.state === 'ready') {
        clearTimeout(timeout);
        this.state = 'waiting';
        this.message = '너무 성급하시군요! 초록색이 된 후에 클릭하세요.';
      } else if (this.state === 'now') {
        endTime = new Date();
        this.state = 'waiting';
        this.message = '클릭해서 시작하세요.';
        this.result.push(endTime - startTime);
      }
    },
  },
};
</script>

<style scoped>
/* scoped : 이 컴포넌트 안에서만 유효한 style */
#screen {
  width: 300px;
  height: 200px;
  text-align: center;
  user-select: none;
}
#screen.waiting {
  background-color: aqua;
}
#screen.ready {
  background-color: red;
  color: white;
}
#screen.now {
  background-color: greenyellow;
}
</style>
