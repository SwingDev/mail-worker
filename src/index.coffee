Worker = require('redisworker')


class MailWorker extends Worker

  constructor: (options) ->
    {@url, @mailAdapter} = options
    throw new Error('You must use MailWorker with mailAdapter') unless @mailAdapter

  name: () ->
    'MailWorker'

  work: (payload, cb) ->
    mail = JSON.parse(payload)
    @mailAdapter.sendMail mail.sender, mail.recipients, mail.mimeBody, (err) ->
      cb(err)

  error: (err, cb) ->
    console.log '[Error]', err if err
    cb()
    return


class MailAdapter
  
  constructor: () ->
    return

  sendMail: () ->
    throw new Error('You must overwrite sendMail#MailAdapter in subclass')


exports.MailAdapter = MailAdapter
exports.MailWorker = MailWorker
