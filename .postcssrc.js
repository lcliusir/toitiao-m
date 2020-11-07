module.exports = {
  plugins: {
    // vue cli 默认配置了 autoprefixer 这里冲突了
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      // html 根元素字体大小
      // flexible 默认750px 10份 ---- Vant 默认是375  10份
      // rootValue 的值可以是 数值 和函数
      // rootValue: 37.5,
      rootValue({ file }) {
        return file.indexOf('vant') === -1 ? 75 : 37.5
      },
      // 配置需要转换的css 属性
      propList: ['*'],
      exclude: 'github-markdown'
    }
  }
}
