const qiniu = require('qiniu')
const { qiniu: config } = require('../config')

const accessKey = config.AK
const secretKey = config.SK
const bucket = config.bucket

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const cfg = new qiniu.conf.Config()
cfg.zone = qiniu.zone.Zone_z0
const bucketManager = new qiniu.rs.BucketManager(mac, cfg)

const upload = async (url, key) => new Promise((resolve, reject) => {
  bucketManager.fetch(url, bucket, key, function (err, respBody, respInfo) {
    if (err) {
      console.log(err)
      reject(err)
    } else {
      if (respInfo.statusCode === 200) {
        console.log('upload successful', key)
        resolve({ key })
      } else {
        reject(respInfo)
      }
    }
  })
})

module.exports = upload
