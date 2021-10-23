<template>
  <div>
    <!-- v-bind: v-on@ -->
    <!-- :class={ state: true, hello: false} -->
    <!-- class랑 style은 객체 스타일을 지원한다 -->
    <div id="computer" :style="computedStyleObject"></div>
    <div>
      <button @click="onClickButton('바위')">바위</button>
      <button @click="onClickButton('가위')">가위</button>
      <button @click="onClickButton('보')">보</button>
    </div>
    <div>{{ result }}</div>
    <div>현재 {{ score }}점</div>
  </div>
</template>

<script>
// 좌표만 보면 무엇을 의미하는지 모르니 명시해주는 것이 좋다
const rspCoords = {
  바위: '0',
  가위: '-142px',
  보: '-284px',
};

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
};

const computerChoice = imgCoord => {
  return Object.entries(rspCoords).find(function(v) {
    return v[1] === imgCoord;
  })[0];
};

let interval = null;

export default {
  data() {
    return {
      imgCoord: rspCoords.바위,
      result: '',
      score: 0,
    };
  },
  computed: {
    // Data를 가공한 것, 캐싱효과를 받을 수 있게(성능up)
    computedStyleObject() {
      return {
        background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${this.imgCoord} 0`,
      };
    },
  },
  methods: {
    changeHand() {
      interval = setInterval(() => {
        if (this.imgCoord === rspCoords.바위) {
          this.imgCoord = rspCoords.가위;
        } else if (this.imgCoord === rspCoords.가위) {
          this.imgCoord = rspCoords.보;
        } else if (this.imgCoord === rspCoords.보) {
          this.imgCoord = rspCoords.바위;
        }
      }, 100);
    },
    onClickButton(choice) {
      clearInterval(interval);
      const myScore = scores[choice];
      const cpuScore = scores[computerChoice(this.imgCoord)];
      const diff = myScore - cpuScore;
      if (diff === 0) {
        this.result = '비겼습니다.';
      } else if ([-1, 2].includes(diff)) {
        this.result = '이겼습니다.';
        this.score += 1;
      } else {
        this.result = '졌습니다.';
        this.score -= 1;
      }
      setTimeout(() => {
        this.changeHand();
      }, 1000);
    },
  },
  // beforeCreate() {
  //   console.log('beforeCreate');
  // },
  //! created : 보여지긴 하지만 화면에 보여지기 전
  //! (데이터가 준비 되었다. 그러나 화면엔 노노, 자바스크립 상에서만 존재)
  // created() {
  //   console.log('created');
  // },
  // beforeMount() {
  //   console.log('beforeMount');
  // },
  //! mounted : 화면에 보여진 후 (보통은 여기에서 많이 한다)
  //! (화면이 다 구현된 뒤에 조작하는 것이 좋기 때문에)
  mounted() {
    // console.log('mounted');
    this.changeHand();
  },
  // beforeUpdate() {
  //   console.log('beforeUpdate');
  // },
  //! updated : 화면에 데이터가 바꿔서 다시 그려질 때
  // updated() {
  //   console.log('updated');
  // },
  //! beforeDestroy : 메모리누수 방지
  beforeDestroy() {
    // console.log('beforeDestroy');
    clearInterval(interval);
  },
  //! destroyed : 화면에 있다가 없어질 때
  // destroyed() {
  //   console.log('destroyed');
  // },
};
</script>

<style scoped>
#computer {
  width: 142px;
  height: 200px;
  background-position: 0 0;
}
</style>
