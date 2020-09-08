/**
* 图片加载失败
*/

export default {
  async inserted(el, binding, vnode) {
    const imgURL = binding.value
    if (imgURL) {
      const exist = await imageIsExist(imgURL)
      if (exist) {
        el.setAttribute('src', imgURL)
      }
    }
  }
}

const imageIsExist = function (url) {
  return new Promise((resolve) => {
    var img = new Image()
    img.onload = function () {
      if (this.complete === true) {
        resolve(true)
        img = null
      }
    }
    img.onerror = function () {
      resolve(false)
      img = null
    }
    img.src = url
  })
}
