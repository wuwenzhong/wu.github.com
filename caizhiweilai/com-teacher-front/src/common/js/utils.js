/*
 * @Author: your name
 * @Date: 2020-04-28 09:38:04
 * @LastEditTime: 2020-04-29 11:11:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /com-teacher-front/src/common/js/utils.js
 */
const TokenKey = 'accessToken'

export function getToken() {
  // return Cookies.get(TokenKey)
  return window.localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return window.localStorage.setItem(TokenKey, token)
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return window.localStorage.removeItem(TokenKey)
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function getQueryString(name) {
  if (!window.location.href.split('?')[1]) return
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.href.split('?')[1].match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  };
  return null
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
	id = id || 'id'
	parentId = parentId || 'parentId'
	children = children || 'children'
	rootId = rootId || '-1'
	// 对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data))
	// 循环所有项
	const treeData = cloneData.filter(father => {
		const branchArr = cloneData.filter(child => {
      // 返回每一项的子级数组
      return father[id] === child[parentId]
    })
    // >0 显示children空数组，=0不显示
		// eslint-disable-next-line no-unused-expressions
		branchArr.length >= 0 ? father.children = branchArr : ''
		// 返回第一层
		return father[parentId] === rootId
  })
	return treeData != '' ? treeData : data
}

// 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = []
	Object.keys(datas).map((key) => {
		if (datas[key].dictValue == ('' + value)) {
			actions.push(datas[key].dictLabel)
			return false
		}
	})
	return actions.join('')
}

/**
 * @description: 移除url指定参数
 * @param {string} url
 * @param {string} name
 */
export function urlDelParams(url, name) {
  var urlArr = url.split('?')
  if (urlArr.length > 1 && urlArr[1].indexOf(name) > -1) {
    var query = urlArr[1]
    var obj = {}
    var arr = query.split('&')
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=')
      obj[arr[i][0]] = arr[i][1]
    };
    delete obj[name]
    // eslint-disable-next-line no-useless-escape
    var urlte = urlArr[0] + (Object.keys(obj).length === 0 ? '' : '?') + JSON.stringify(obj).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&')
    return urlte
  } else {
    return url
  };
}

// 深拷贝
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 修改时间数据格式
export function formatDate(timeStr) {
  var date = new Date(timeStr)
  var YY = date.getFullYear() + '-'
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return YY + MM + DD + ' ' + hh + mm + ss
}

/**
 * @param {String} str
 * @returns {Boolean}
 * input校验不能输入特殊字符
 */
export function validInput(val) {
  // eslint-disable-next-line no-useless-escape
  const regEn = /[`!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
  const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
  if (regEn.test(val) || regCn.test(val)) {
        return true
  }
  return false
}

// 防抖函数
export function _debounce (fn, delay) {
  delay = delay || 200
  var timer
  return function () {
    var th = this
    var args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      timer = null
      fn.apply(th, args)
    }, delay)
  }
}

export function _vueDebounce(fnName, time) {
  time = time || 200
  var timeout
  return function() {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      this[fnName]()
    }, time)
  }
}

// 节流函数
export function _throttle (fn, interval) {
  var last
  var timer
  interval = interval || 200
  return function () {
    var th = this
    var args = arguments
    var now = +new Date()
    if (last && now - last < interval) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(th, args)
      }, interval)
    } else {
      last = now
      fn.apply(th, args)
    }
  }
}

// 该方法判断一个文件属于什么类型
export function getFileType(fileExten) {
  let fileType = 'VIDEO'
  const fileExtenUp = fileExten.toUpperCase()
  switch (fileExtenUp) {
    case 'JPG':
    case 'GIF':
    case 'JPEG':
    case 'PNG':
    case 'SVG':
    case 'BMP':
      fileType = 'PIC'
      break
    case 'XLSX':
    case 'XLS':
      fileType = 'EXCEL'
      break
    case 'PDF':
      fileType = 'PDF'
      break
    case 'PPT':
    case 'PPTX':
    case 'POTM':
    case 'POTX':
      fileType = 'PPT'
      break
    case 'TXT':
    case 'TEXT':
      fileType = 'TXT'
      break
    case 'DOCX':
    case 'DOC':
      fileType = 'WORD'
      break
  }
  return fileType
}
