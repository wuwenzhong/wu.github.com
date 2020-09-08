import * as types from './mutation-types.js'

export default {
  [types.SET_USER_IMAGE](state, path) {
    state.userImage = path
  },
  [types.setRushAnswerShow](state, isShow) {
    state.rushAnswerShow = isShow
  },
  [types.setVote](state, voteDate) {
    state.voteId = voteDate
  },
  [types.setIssue](state, issueDate) {
    state.issue = issueDate
  },
  [types.setAnswerStatus](state, isShow) {
    state.answerStatus = isShow
  },
  [types.setTeachSearchShow](state, isShow) {
    state.teachSearchShow = isShow
  },
  [types.setHeight](state, isShow) {
    state.height = isShow
  },
  [types.setRanking](state, isShow) {
    state.rankingIsShow = isShow
  }
}
