import { isAnswer } from '@/api/teacherTools'
let socket = ''
let wsuri = ''
const _host = window.location.host
// 收到第一条消息，发送ack，并弹出提示
// 收到第二条消息，发现已经弹出提示，就不弹出，直接发送ack
let isShow = false
let timer = null
export function createSocket() {
  if (_host == '127.0.0.1:32008') {
    setTimeout(() => {
      doCreateSocket()
    }, 2000)
  } else {
    doCreateSocket()
  }
}

export function doCreateSocket() {
  if (_host == '127.0.0.1:32008') {
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
  clearInterval(timer)
  const actions = {
    type: 'com',
    messageType: 'login',
    content: {
      customerId: localStorage.getItem('customerId'),
      classId: localStorage.getItem('classId'),
      courseId: localStorage.getItem('courseId')
    }
  }
  sendWspush(actions)
  heart.start()
}
// 连接失败
export function onerrorWs() {
  clearInterval(timer)
  timer = setInterval(() => {
    createSocket() // 重新连接
  }, 30000)
}
// 接收数据
export function onmessageWs(e) {
  const messages = JSON.parse(e.data)

  for (const i in messages) {
    const message = messages[i]
    if (message.messageType == 'pong') {
      heart.start()
      return false
    } else if (message.messageType == 'logout') {
      oncloseWs(1)
      location.href = location.origin + '/index'
      return
    }
    if (message.content.classId !== localStorage.getItem('classId')) {
      return false
    }

    const ackMessage = JSON.parse(JSON.stringify(message))
    ackMessage.messageType = 'ACK'
    sendWspush(ackMessage)
    // 当类型等于 申请 同意 拒绝
    if (message.messageType === 'applyTeam') {
      receiverApply(message) // 申请
    } else if (message.messageType === 'agreeTeam') {
      receiverAgree(message) // 同意
    } else if (message.messageType === 'refuseTeam') {
      receiverRefuse(message) // 拒绝
    } else if (message.messageType === 'startVote') {
      receiverStartVote(message) // 开始投票
    } else if (message.messageType === 'startRush') {
      receiverStartRush(message) // 开始抢答
    } else if (message.messageType === 'startTrain') {
      receiverStartTrain(message) // 开启实训
    } else if (message.messageType === 'issue') {
      receiverIssue(message) // 下发资源
    }
  }
}
// 发送数据
export function sendWspush(data) {
  const newData = JSON.stringify(data)
  socket.send(newData)
}
// 手动断开连接 不需要重新连接val
export function oncloseWs(val) {
  if (val.wasClean || val == 1) { // 如果参数是1那么就是手动断开连接 不需要重新连接
    socket.close()
    clearTimeout(heart.timeObj)
  } else { // 参数不是1就是自动端开了连接 需要重新连接
    clearInterval(timer)
    timer = setInterval(() => {
      createSocket()
    }, 30000)
  }
}
// 心跳机制
const heart = {
  timeOut: 50000, // 心跳间隔1分钟
  timeObj: null,
  serverTimeObj: null,
  start: function() {
      const self = this
      // 清除延时器
      this.timeObj && clearTimeout(this.timeObj)
      this.serverTimeObj && clearTimeout(this.serverTimeObj)
      this.timeObj = setTimeout(function() {
        try {
          sendWspush({
          type: 'com',
          messageType: 'ping',
          content: {
            customerId: localStorage.getItem('customerId'),
            classId: localStorage.getItem('classId'),
            courseId: localStorage.getItem('courseId')
          }
        })// 发送消息，服务端返回信息，即表示连接良好，可以在socket的onmessage事件重置心跳机制函数
          // 定义一个延时器等待服务器响应，若超时，则关闭连接，重新请求server建立socket连接
          self.serverTimeObj = setTimeout(function() {
            socket.close()
          }, self.timeOut)
        } catch (error) {
        }
      }, this.timeOut)
  }
}

// 组长接收到组员的申请
function receiverApply(message) {
  if (isShow == false) {
    isShow = true
    window.globalVariable.$confirm(message.content.msg, '通知', {
      confirmButtonText: '前往查看',
      cancelButtonText: '暂不处理',
      confirmButtonClass: 'el-button--medium',
      cancelButtonClass: 'el-button--medium',
      type: 'success'
    }).then(() => {
      isShow = false
      if (window.globalVariable.$route.path === '/team') {
        window.globalVariable.$router.go(0)
      } else {
        window.globalVariable.$router.push({
          path: '/team'
        })
      }
    }).catch(() => {
      isShow = false
    })
  }
}
// 组长同意
function receiverAgree(message) {
  window.globalVariable.$alert(message.content.msg, '通知', {
    confirmButtonText: '我知道了',
    type: 'success',
    callback: () => {
      isShow = false
      if (window.globalVariable.$route.path === '/team') {
        window.globalVariable.$router.go(0)
      }
    }
  })
}
// 组长拒绝
function receiverRefuse(message) {
  window.globalVariable.$alert(message.content.msg, '通知', {
    confirmButtonText: '我知道了',
    type: 'warning',
    callback: () => {
      isShow = false
      if (window.globalVariable.$route.path === '/team') {
        window.globalVariable.$router.go(0)
      }
    }
  })
}
// 开始投票
function receiverStartVote (message) {
  window.globalVariable.$store.commit('setVote', message.content.voteId)
  // 投票标题
  localStorage.setItem('voteTitle', message.content.title)
}
// 下发资源
function receiverIssue (message) {
  window.globalVariable.$store.commit('setIssue', message)
}
// 开始抢答
function receiverStartRush(message) {
  const rushId = message.content.rushId
  isAnswer({
    rushId
  }).then(res => {
    if (res.result) {
      window.globalVariable.$store.commit('setRushAnswerShow', true)
      window.globalVariable.$store.commit('setAnswerStatus', true)
    }
  })
}
// 开启实训
function receiverStartTrain(message) {
  window.globalVariable.$alert(message.content.msg, '通知', {
    confirmButtonText: '我知道了',
    type: 'warning',
    callback: () => {
      const currentPath = window.location.pathname
      localStorage.removeItem('currentOUT')
      localStorage.removeItem('currentINDEX')
      if (currentPath == '/trainLevel') {
        window.location.href = '/training'
      } else {
        isShow = false
      }
    }
  })
}
