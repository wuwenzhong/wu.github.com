import * as types from './mutation-types.js'

export default {
  [types.SET_USER_IMAGE](state, path) {
    state.userImage = path
  },
  [types.setTurntableShow](state, isShow) {
    state.turntableShow = isShow
  },
  [types.setRushAnswerShow](state, isShow) {
    state.rushAnswerShow = isShow
  },
  [types.setVoteShow](state, isShow) {
    state.voteShow = isShow
  },
  [types.setTeachSearchShow](state, isShow) {
    state.teachSearchShow = isShow
  },
  [types.setTurnLottery](state, isShow) {
    state.turnLottery = isShow
  },
  [types.setLookLotteryResult](state, isShow) {
    state.lotteryResult = isShow
  },
  [types.setOldLottery](state, data) {
    state.oldLotteryData = data
  },
  [types.setLotteryPerson](state, data) {
    state.lotteryPerson = data
  },
  [types.setLotteryId](state, data) {
    state.currentLotteryId = data
  },
  [types.setLotteryType](state, data) {
    state.lotteryType = data
  },
  [types.setAnswerStatus](state, isShow) {
    state.answerStatus = isShow
  },
  [types.setHeight](state, isShow) {
    state.height = isShow
  },
  [types.setRankingShow](state, isShow) {
    state.isShowRanking = isShow
  },

  [types.setDialogInit](state, isShow) {
    state.dialogInit = isShow
  },
  [types.setDialogInitList](state, isShow) {
    state.dialogInitList = isShow
  },
  [types.setLessonId](state, data) {
    state.lessonCourseId = data
  }
}
