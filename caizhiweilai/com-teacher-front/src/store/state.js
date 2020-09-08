const state = {
  height: true,
  userImage: '',
  windowHeight: '',
  turntableShow: false, // 转盘选择学生弹窗显示隐藏
  turnLottery: false, // 转盘显示隐藏
  rushAnswerShow: false, // 抢答器隐藏
  answerStatus: true,
  voteShow: false, // 投票隐藏
  teachSearchShow: false, // 教学资源检索
  lotteryResult: false, // 往期结果显示
  oldLotteryData: [], // 往期结果数据
  lotteryPerson: [], // 参与抽奖的数据
  currentLotteryId: '', // 当前抽奖的id
  lotteryType: 1, // 当前摇奖类型默认是按学生类型摇奖
  isShowRanking: false, // 显示隐藏红旗榜

  dialogInit: false, // 初始化弹窗
  dialogInitList: false, // 初始化列表
  lessonCourseId: '' // 选中教案id
}

export default state
