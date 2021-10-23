<template>
  <div class="ball" :style="styleObject">{{ number }}</div>
</template>

<script>
export default {
  name: 'LottoBall',
  props: {
    // props는 타입을 명시해줘야한다
    // 전달받은 props는 바꿀 수 없다 (읽기전용, 쓸 수 있지만 바꿀 수 없는)
    number: Number,
  },
  computed: {
    styleObject() {
      let background;
      if (this.number <= 10) {
        background = 'red';
      } else if (this.number <= 20) {
        background = 'orange';
      } else if (this.number <= 30) {
        background = 'yellow';
      } else if (this.number <= 40) {
        background = 'blue';
      } else {
        background = 'green';
      }
      return {
        background,
      };
    },
  },
};
</script>

<style scoped>
.ball {
  display: inline-block;
  border: 1px solid black;
  border-radius: 20px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  text-align: center;
  margin-right: 20px;
}
</style>
