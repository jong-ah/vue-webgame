import Vue from 'vue';
import VueRouter from 'vue-router';
import NumberBaseball from '../3.숫자야구/NumberBaseball';
import ResponseCheck from '../4.반응속도체크/ResponseCheck';
import RockScissorsPaper from '../5.가위바위보/RockScissorsPaper';
import LottoGenerator from '../6.로또/LottoGenerator';
import GameMatcher from './GameMatcher';
// 각 페이지를 컴포넌트로 생각

Vue.use(VueRouter);

export default new VueRouter({
  // 기존은 hash인데 history로 바꾸면 주소가 깔끔해진다
  // 대신에 새로고침하면 페이지가 뜨지 않는다 -> 서버가 필요하다
  mode: 'history',
  routes: [
    { path: '/number-baseball', component: NumberBaseball },
    { path: '/response-check', component: ResponseCheck },
    { path: '/rock-scissors-paper', component: RockScissorsPaper },
    { path: '/lotto-generator', component: LottoGenerator },
    { path: '/game/:name', component: GameMatcher },
  ],
});
