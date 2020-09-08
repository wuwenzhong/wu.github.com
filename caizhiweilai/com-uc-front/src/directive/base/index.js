import hasImage from './hasImage'

const install = function (Vue) {
  Vue.directive('hasImage', hasImage)
}

if (window.Vue) {
  window.hasImage = hasImage
  Vue.use(install); // eslint-disable-line
}

export default install
