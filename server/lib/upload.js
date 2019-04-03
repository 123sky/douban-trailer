import qiniu from 'qiniu'
import config from '../config'
import logger from '../lib/logger'

const accessKey = config.qiniu.AK
const secretKey = config.qiniu.SK
const bucket = config.qiniu.bucket

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const cfg = new qiniu.conf.Config()
cfg.zone = qiniu.zone.Zone_z0
const bucketManager = new qiniu.rs.BucketManager(mac, cfg)

export default (url, key) =>
  new Promise((resolve, reject) => {
    bucketManager.fetch(url, bucket, key, function(err, respBody, respInfo) {
      if (err) {
        logger.error(err)
        reject(err)
      } else if (respInfo.statusCode === 200) {
        logger.info('upload successful', key)
        resolve({ key })
      } else {
        reject(respInfo)
      }
    })
  })
