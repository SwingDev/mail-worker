Worker = require('redis-worker').Worker
errors = require('./errors')

createError = errors.createError
MailWorkerError = errors.MailWorkerError


class MailWorker extends Worker

  constructor: (options) ->
    {@url, @taskLimit, @retryTasks, @mailAdapter, @mailBuilder} = options
    throw new Error('You must use MailWorker with MailAdapter') unless @mailAdapter
    throw new Error('You must use MailWorker with MailBuilder') unless @mailBuilder
    super url: @url, taskLimit: @taskLimit, retryTasks: @retryTasks

  name: () ->
    'MailWorker'

  work: (payload, cb) ->
    mail = JSON.parse(payload)
    @mailAdapter.sendMail mail.sender, mail.recipients, mail.mimeBody, (err) ->
      return cb createError(err, 'SENDMAIL') if err
      cb null

  pushJob: (jobDict, cb) ->
    @mailBuilder.buildMail
      mailFrom: jobDict.mailFrom
      mailTo: jobDict.mailTo
      mailSubject: jobDict.mailSubject
      mailTpl: jobDict.mailTpl
      mailData: jobDict.mailData
    , (err, mailFrom, mailTo, mimeBody) =>
      return cb createError(err, 'BUILDMAIL') if err
      jobDict = {}
      jobDict =
        sender: mailFrom
        recipients: mailTo
        mimeBody: mimeBody
      super(jobDict, cb)

  error: (err, task, cb) ->
    cb(err)


class MailAdapter

  constructor: () ->
    return

  sendMail: () ->
    throw new Error('You must overwrite sendMail#MailAdapter in subclass')

  buildMail: () ->
    throw new Error('You must overwrite buildMail#MailAdapter in subclass')


### ###
# EXPORTS
exports.MailAdapter = MailAdapter
exports.MailWorker = MailWorker
exports.MailWorkerError = MailWorkerError
