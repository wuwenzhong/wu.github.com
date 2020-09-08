/*
 * @Author: your name
 * @Date: 2020-04-29 09:39:12
 * @LastEditTime: 2020-04-29 14:29:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /com-school-front/src/common/js/context.js
 */
/* eslint-disable node/no-deprecated-api */
/**
 * @author liangkaiqin
 * @description App上下文单例
 */

import Cookie from 'js-cookie'
import { Base64 } from 'js-base64'
import md5 from 'blueimp-md5'

class AppContext {
  /**
     * 往 cookie 里存东西
     * @param {string} key
     * @param {string} value
     * @param {object} options
     */
  setItemInCookie(key, value, options = { expires: 30 }) {
    Cookie.set(key, value, options)
  }

  /**
   * 从 cookie 里取东西
   * @param {string} key
   */
  getItemInCookie(key) {
    return Cookie.get(key)
  }

  /**
   * 从cookie中删除某个key
   */
  removeItemInCookie(key) {
    return Cookie.remove(key)
  }

  /**
   * 往 cookie 里存东西
   * @param {string} key
   * @param {string} value
   * @param {object} options
   */
  setItemInCookieHashed(key, value, options = { expires: 30 }) {
    Cookie.set(md5(key), new Buffer(value + '').toString('base64'), options)
  }

  /**
   * 从 cookie 里取东西
   * @param {string} key
   */
  getItemInCookieHashed(key) {
    if (Cookie.get(md5(key))) {
      return new Buffer(Cookie.get(md5(key)), 'base64').toString()
    }
  }

  /**
   * 删除cookie里的某个key
   */
  removeItemInCookieHashed(key) {
    Cookie.remove(md5(key))
  }

  /**
   * 往 cookie 里存东西
   * @param {string} key
   * @param {string} value
   * @param {object} options
   */
  setItemInCookieBase64Value(key, value, options = { expires: 30 }) {
    Cookie.set(key, new Buffer(value + '').toString('base64'), options)
  }

  /**
   * 从 cookie 里取东西
   * @param {string} key
   */
  getItemInCookieBase64Value(key) {
    if (Cookie.get(key)) {
      return new Buffer(Cookie.get(key), 'base64').toString()
    }
  }

  /**
   * 从 cookie 里取东西
   * @param {string} key
   */
  getItemInCookieBase64SliceValue(key, length = 0) {
    if (Cookie.get(Base64.encode(key))) {
      return new Buffer(Cookie.get(Base64.encode(key)).slice(0, Cookie.get(Base64.encode(key)).length - length), 'base64').toString()
    }
  }
}

export default new AppContext()