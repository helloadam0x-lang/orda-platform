const chalk = require('chalk')

function timestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19)
}

function format(level, message, meta) {
  const ts = chalk.gray(`[${timestamp()}]`)
  const lvl = level === 'info'  ? chalk.cyan('INFO ')
             : level === 'error' ? chalk.red('ERROR')
             : level === 'warn'  ? chalk.yellow('WARN ')
             : chalk.white('DEBUG')

  const metaStr = meta && Object.keys(meta).length > 0
    ? ' ' + chalk.gray(JSON.stringify(meta))
    : ''

  return `${ts} ${lvl} ${message}${metaStr}`
}

module.exports = {
  info:  (msg, meta = {}) => console.log(format('info',  msg, meta)),
  error: (msg, meta = {}) => console.error(format('error', msg, meta)),
  warn:  (msg, meta = {}) => console.warn(format('warn',  msg, meta)),
  debug: (msg, meta = {}) => process.env.DEBUG && console.log(format('debug', msg, meta)),
}
