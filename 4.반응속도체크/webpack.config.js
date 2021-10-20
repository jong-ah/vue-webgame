const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval',
  resolve: {
    extensions: ['.js', '.vue'],
  },
  entry: {
    app: path.join(__dirname, 'main.js'),
  },
  module: {
    // module은 webpack의 대부분의 일을 처리한다
    // loader - javascript가 아닌 애들을 javascript로 만들어주는 역할
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        // style-sheet를 처리하기 위함
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
    ],
  },
  // plugins는 부가적인 역할, output이 나오기 전에 기능을 추가할 수 있다.
  plugins: [new VueLoaderPlugin()],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    // webpack-dev-server하기 위해 추가한다.
    // 새로고침없이 리로드 기능이 가능하다
    // 디스크에 저장되지 않는 메모리 컴파일을 사용하기 때문에 컴파일 속도가 빨라짐
    // https://velog.io/@adam2/webpack-dev-server-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0%EC%82%BD%EC%A7%88%ED%9B%84%EA%B8%B0
    publicPath: '/dist/',
  },
  devServer: {
    //! (오류) [webpack-cli] Invalid options object. Dev Server has been initialized using an options object that does not match the API schema.
    // https://webpack.kr/configuration/dev-server/#devserver
    // 기존 localhost:8080이 docker랑 연결되어 있는 것 같다
    // port:9000으로 바꾸고 실행했는데도 안 되었다.
    // npm run build로 하면 되지만, webpack-dev-server는 성공 못 했다
    publicPath: '/dist/',
  },
};
