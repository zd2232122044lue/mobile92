// module.exports = {
//     plugins: {
//       autoprefixer: {},
//         'postcss-pxtorem': {
//         // rem单位值 = px像素值 / rootValue  
//         // 默认为37.5,来自于设计稿大小的1/10
//         rootValue: 37.5,
//         propList: ['*']
//       }
//     }
//   }

const {
  sep
} = require('path')

module.exports = ({
  file
}) => {
  let rootValue = file.dirname.indexOf(`node_modules${sep}vant`) !== -1 ? 37.5 : 75

  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue,
        propList: ['*']
      }
    }
  }
}