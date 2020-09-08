let socket = ''
let wsuri = ''
const _host = window.location.host
let timer = null
// 创建链接
export function createSocket() {
  if (_host == '127.0.0.1:32007') {
    setTimeout(() => {
      doCreateSocket()
    }, 2000)
  } else {
    doCreateSocket()
  }
}
export function doCreateSocket() {
  if (_host == '127.0.0.1:32007') {
    wsuri = 'ws://129.211.171.155:20021/connect?accessToken=' + localStorage.getItem('accessToken')
  } else {
    wsuri = 'ws://' + _host + '/api/websocket/connect?accessToken=' + localStorage.getItem('accessToken')
  }
  socket = new WebSocket(wsuri)
  socket.onopen = onopenWs
  socket.onmessage = onmessageWs
  socket.onerror = onerrorWs
  socket.onclose = oncloseWs
}
// 打开链接
export function onopenWs() {
  // console.log('连接成功')
  clearInterval(timer)
  const actions = { type: 'com', messageType: 'login' }
  sendWspush(JSON.stringify(actions))
  heart.start()
}

// 连接失败
export function onerrorWs() {
  clearInterval(timer)
  timer = setInterval(() => {
    createSocket() // 重新连接
  }, 30000)
  // console.log('正在重新连接11')
}

// 接收数据
export function onmessageWs(e) {
  // console.log(e)
  const messages = JSON.parse(e.data)
  // 接收消息类型
  const type = messages[0].messageType
  heart.start()
}

// 发送数据
export function sendWspush(data) {
  socket.send(data)
}

// 断开连接
export function oncloseWs(val) {
  if (val.wasClean || val == 1) { // 如果参数是1那么就是手动断开连接 不需要重新连接
    socket.close()
    // console.log('连接已断开')
    clearTimeout(heart.timeObj)
  } else { // 参数不是1就是自动端开了连接 需要重新连接
    clearInterval(timer)
    timer = setInterval(() => {
      createSocket()
      // console.log('正在重新连接22')
    }, 30000)
  }
}

// 心跳机制
const heart = {
  timeOut: 50000, // 心跳间隔50s
  timeObj: null,
  serverTimeObj: null,
  start: function() {
    const self = this
    // console.log('start')
    // 清除延时器
    this.timeObj && clearTimeout(this.timeObj)
    this.serverTimeObj && clearTimeout(this.serverTimeObj)
    this.timeObj = setTimeout(function() {
      try {
        const pingData = { type: 'com', messageType: 'ping' }
        sendWspush(JSON.stringify(pingData))// 发送消息，服务端返回信息，即表示连接良好，可以在socket的onmessage事件重置心跳机制函数
        // 定义一个延时器等待服务器响应，若超时，则关闭连接，重新请求server建立socket连接
        self.serverTimeObj = setTimeout(function() {
          socket.close()
          // console.log('断开了')
        }, self.timeOut)
      } catch (error) {
        // console.log(error)
      }
    }, this.timeOut)
  }
}
