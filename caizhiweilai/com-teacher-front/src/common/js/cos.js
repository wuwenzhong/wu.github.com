import { putObj, uploadLocal } from '@/api/user'

const COS = require('cos-js-sdk-v5')
const config = {
  Bucket: 'public-1300943404',
  Region: 'ap-beijing'
}
const saas = localStorage.getItem('saas')
export function cos(e, file, route, name, _this, progressName, cb) {
  if (saas == 'off') {
    const formData = new FormData() // FormData 对象
    formData.append('file', file) // 文件对象
    if (_this) {
      return new Promise((resolve, reject) => {
        const config = {
          onUploadProgress: ProgressEvent => {
            const progressPercent = (ProgressEvent.loaded / ProgressEvent.total * 100)
            _this[progressName] = progressPercent
            const tempJson = {
              percent: progressPercent / 100
            }
            cb(tempJson)
          }
        }
        uploadLocal(formData, config).then(res => {
          _this[progressName] = 100
          const tempJson = {
            percent: 1
          }
          cb(tempJson)
          resolve(res.result)
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        uploadLocal(formData).then(res => {
          resolve(res.result)
        })
      })
    }
  } else {
    let TaskId = ''
    const timestamp = new Date().valueOf()
    const cos = new COS({
      // 必选参数
      getAuthorization: function (options, callback) {
        putObj().then(res => {
          // eslint-disable-next-line standard/no-callback-literal
          callback({
            TmpSecretId: res.result.tmpSecretId,
            TmpSecretKey: res.result.tmpSecretKey,
            XCosSecurityToken: res.result.sessionToken,
            ExpiredTime: res.result.expiration
          })
        })
      }
    })
    // const file = e.file
    const index = file.name.lastIndexOf('.')
    const suffix = file.name.substring(index, file.name.length)
    if (!file) return
    return new Promise((resolve, reject) => {
      cos.putObject(
        {
          Bucket: config.Bucket,
          Region: config.Region,
          Key: route + timestamp + name + suffix,
          Body: file,
          onTaskReady: function (tid) {
            TaskId = tid
          },
          // 校验
          onHashProgress: function (progressData) {
            console.log('onHashProgress', JSON.stringify(progressData))
          },
          // 上传中
          onProgress: function (progressData) {
            e.file.percent = progressData.percent * 100
            e.onProgress(e.file)

            _this[progressName] = parseInt(progressData.percent * 100)
            cb(progressData)
          }
        },
        function (err, data) {
          if (data) {
            const res = 'https://' + data.Location
            resolve(res)
          } else if (err) {
            reject(err)
          }
        }
      )
    })
  }
}
