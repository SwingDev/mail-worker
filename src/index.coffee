Worker = require('redis-worker')


class MailWorker extends Worker

  constructor: (options) ->
    {@url, @mailAdapter, @mailBuilder} = options
    throw new Error('You must use MailWorker with MailAdapter') unless @mailAdapter
    throw new Error('You must use MailWorker with MailBuilder') unless @mailBuilder

  name: () ->
    'MailWorker'

  work: (payload, cb) ->
    mail = JSON.parse(payload)
    @mailAdapter.sendMail mail.sender, mail.recipients, mail.mimeBody, (err) ->
      cb(err)

  pushJob: (jobDict, cb) ->
    @mailBuilder.buildMail
      mailFrom: jobDict.mailFrom
      mailTo: jobDict.mailTo
      mailSubject: jobDict.mailSubject
      mailTpl: jobDict.mailTpl
      mailData: jobDict.mailData
    , (err, mailFrom, mailTo, mimeBody) =>
      return cb(err) if err
      jobDict = {}
      jobDict =
        sender: mailFrom
        recipients: mailTo
        mimeBody: mimeBody
      super(jobDict, cb)

  error: (err, cb) ->
    console.log '[Error]', err if err
    cb()
    return


class MailAdapter
  
  constructor: () ->
    return

  sendMail: () ->
    throw new Error('You must overwrite sendMail#MailAdapter in subclass')

  buildMail: () ->
    throw new Error('You must overwrite buildMail#MailAdapter in subclass')


exports.MailAdapter = MailAdapter
exports.MailWorker = MailWorker
