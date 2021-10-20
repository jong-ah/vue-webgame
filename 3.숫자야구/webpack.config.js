// node환경에서는 require 쓰고
// vue환경에서는 import 쓴다.
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// node가 만들어준 script => 절대경로를 만들어준다.
const path = require('path');

// entry, module, plugin, output 4가지 필수적이고, 나머지는 부가적이다
// webpack을 쓰는 이유? script가 많아서 하나로 합치기 위해 쓴다
module.exports = {
  // 배포할 때는 production
  mode: 'development',
  // 배초할 때는 hiden-source-map
  // eval하면 웹팩 속도가 빨라진다
  devtool: 'eval',
  // 확장자를 처리해준다
  // .vue 없애도 vue라고 인식한다.
  resolve: {
    extensions: ['.js', '.vue'],
  },
  entry: {
    app: path.join(__dirname, 'main.js'),
  },
  module: {
    rules: [
      {
        // .vue로 끝나는 파일 (정규표현식 $끝)
        test: /\.vue$/,
        // webpack는 js만 처리한다.
        // vue파일을 만나면 vue-loader가 처리한다.
        // vue-loader는 vue 컴포넌트를 일반적인 자바스크립트 모듈로 변환할 수 있는 webpack에서 사용하는 로더
        // use와 loader와 같은 역할 (key)
        // vue와 vue-template-compiler는 버전이 같아야한다. (package.json)
        use: 'vue-loader',
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
};
