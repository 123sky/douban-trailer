import log4js from 'log4js'

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: 'logs/important-things.log',
      maxLogSize: 10 * 1024 * 1024, // = 10Mb
      backups: 5, // keep five backup files
      compress: true, // compress the backups
      encoding: 'utf-8',
      mode: 0o0640,
      flags: 'w+'
    },
    dateFile: {
      type: 'dateFile',
      filename: 'logs/more-important-things.log',
      pattern: 'yyyy-MM-dd-hh',
      compress: true
    },
    out: {
      type: 'stdout'
    }
  },
  categories: {
    default: { appenders: ['file', 'dateFile', 'out'], level: 'info' }
  }
})

export default log4js.getLogger('things')
