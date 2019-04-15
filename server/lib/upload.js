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

export default {
  upload(url, key) {
    return new Promise((resolve, reject) => {
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
  },

  parseRemoveOption(ids) {
    return ids.map(id => {
      return qiniu.rs.deleteOp(bucket, id)
    })
  },

  remove(ids) {
    return new Promise((resolve, reject) => {
      const deleteOperations = this.parseRemoveOption(ids)
      bucketManager.batch(deleteOperations, function(err, respBody, respInfo) {
        if (err) {
          logger.error('qiniu remove error', err)
          reject(err)
        }

        if (parseInt(respInfo.statusCode / 100) === 2) {
          respBody.forEach(function(item) {
            if (Number(item.code) === 200) {
              logger.info('remove successful', item.code)
            } else {
              logger.info('remove error', item.code + '\t' + item.data.error)
            }
          })
          resolve(respBody)
        } else {
          logger.info('qiniu remove error ' + respInfo.statusCode, respBody)
          reject(respBody)
        }
      })
    })
  }
}
