import Vue from 'vue';
import MineSweeper from './MineSweeper.vue';

new Vue({
  render: createElement => createElement(MineSweeper),
}).$mount('#root');
