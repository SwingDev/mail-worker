ErrorHandler = require('error-handler')
WorkerError = require('redis-worker').WorkerError

errCodes = ['SENDMAIL', 'BUILDMAIL']

createError = (err, errCode) ->
  return null unless err

  if errCode
    switch errCode
      when 'SENDMAIL'
        return new MailWorkerError('Sending mail was unsuccessful', err)
      when 'BUILDMAIL'
        return new MailWorkerError('Building mail was unsuccessful', err)
      else
        return new MailWorkerError(errCode, err)
  else
    return new MailWorkerError(null, err)


class MailWorkerError extends WorkerError

  name: 'MailWorkerError'


### ###
# EXPORTS
exports.MailWorkerError = MailWorkerError
exports.createError = createError
