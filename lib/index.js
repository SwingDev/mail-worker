var MailAdapter, MailWorker, MailWorkerError, Worker, createError, errors,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Worker = require('redis-worker').Worker;

errors = require('./errors');

createError = errors.createError;

MailWorkerError = errors.MailWorkerError;

MailWorker = (function(superClass) {
  extend(MailWorker, superClass);

  function MailWorker(options) {
    this.url = options.url, this.taskLimit = options.taskLimit, this.retryTasks = options.retryTasks, this.mailAdapter = options.mailAdapter, this.mailBuilder = options.mailBuilder;
    if (!this.mailAdapter) {
      throw new Error('You must use MailWorker with MailAdapter');
    }
    if (!this.mailBuilder) {
      throw new Error('You must use MailWorker with MailBuilder');
    }
    MailWorker.__super__.constructor.call(this, {
      url: this.url,
      taskLimit: this.taskLimit,
      retryTasks: this.retryTasks
    });
  }

  MailWorker.prototype.name = function() {
    return 'MailWorker';
  };

  MailWorker.prototype.work = function(payload, cb) {
    var mail;
    mail = JSON.parse(payload);
    return this.mailAdapter.sendMail(mail.sender, mail.recipients, mail.mimeBody, function(err) {
      if (err) {
        return cb(createError(err, 'SENDMAIL'));
      }
      return cb(null);
    });
  };

  MailWorker.prototype.pushJob = function(jobDict, cb) {
    return this.mailBuilder.buildMail({
      mailFrom: jobDict.mailFrom,
      mailTo: jobDict.mailTo,
      mailCC: jobDict.mailCC,
      mailBCC: jobDict.mailBCC,
      mailSubject: jobDict.mailSubject,
      mailTpl: jobDict.mailTpl,
      mailData: jobDict.mailData,
      mailHeaders: jobDict.mailHeaders
    }, (function(_this) {
      return function(err, mailFrom, mailTo, mimeBody) {
        if (err) {
          return cb(createError(err, 'BUILDMAIL'));
        }
        jobDict = {};
        jobDict = {
          sender: mailFrom,
          recipients: mailTo,
          mimeBody: mimeBody
        };
        return MailWorker.__super__.pushJob.call(_this, jobDict, cb);
      };
    })(this));
  };

  MailWorker.prototype.error = function(err, task, cb) {
    return cb(err);
  };

  return MailWorker;

})(Worker);

MailAdapter = (function() {
  function MailAdapter() {
    return;
  }

  MailAdapter.prototype.sendMail = function() {
    throw new Error('You must overwrite sendMail#MailAdapter in subclass');
  };

  MailAdapter.prototype.buildMail = function() {
    throw new Error('You must overwrite buildMail#MailAdapter in subclass');
  };

  return MailAdapter;

})();


/* */

exports.MailAdapter = MailAdapter;

exports.MailWorker = MailWorker;

exports.MailWorkerError = MailWorkerError;

//# sourceMappingURL=data:application/json;base64,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QUEsQ0FBTSxzREFBTjtFQUREOzs7Ozs7O0FBSWI7O0FBRUEsT0FBTyxDQUFDLFdBQVIsR0FBc0I7O0FBQ3RCLE9BQU8sQ0FBQyxVQUFSLEdBQXFCOztBQUNyQixPQUFPLENBQUMsZUFBUixHQUEwQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIldvcmtlciA9IHJlcXVpcmUoJ3JlZGlzLXdvcmtlcicpLldvcmtlclxuZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKVxuXG5jcmVhdGVFcnJvciA9IGVycm9ycy5jcmVhdGVFcnJvclxuTWFpbFdvcmtlckVycm9yID0gZXJyb3JzLk1haWxXb3JrZXJFcnJvclxuXG5cbmNsYXNzIE1haWxXb3JrZXIgZXh0ZW5kcyBXb3JrZXJcblxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG4gICAge0B1cmwsIEB0YXNrTGltaXQsIEByZXRyeVRhc2tzLCBAbWFpbEFkYXB0ZXIsIEBtYWlsQnVpbGRlcn0gPSBvcHRpb25zXG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCB1c2UgTWFpbFdvcmtlciB3aXRoIE1haWxBZGFwdGVyJykgdW5sZXNzIEBtYWlsQWRhcHRlclxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgdXNlIE1haWxXb3JrZXIgd2l0aCBNYWlsQnVpbGRlcicpIHVubGVzcyBAbWFpbEJ1aWxkZXJcbiAgICBzdXBlciB1cmw6IEB1cmwsIHRhc2tMaW1pdDogQHRhc2tMaW1pdCwgcmV0cnlUYXNrczogQHJldHJ5VGFza3NcblxuICBuYW1lOiAoKSAtPlxuICAgICdNYWlsV29ya2VyJ1xuXG4gIHdvcms6IChwYXlsb2FkLCBjYikgLT5cbiAgICBtYWlsID0gSlNPTi5wYXJzZShwYXlsb2FkKVxuICAgIEBtYWlsQWRhcHRlci5zZW5kTWFpbCBtYWlsLnNlbmRlciwgbWFpbC5yZWNpcGllbnRzLCBtYWlsLm1pbWVCb2R5LCAoZXJyKSAtPlxuICAgICAgcmV0dXJuIGNiIGNyZWF0ZUVycm9yKGVyciwgJ1NFTkRNQUlMJykgaWYgZXJyXG4gICAgICBjYiBudWxsXG5cbiAgcHVzaEpvYjogKGpvYkRpY3QsIGNiKSAtPlxuICAgIEBtYWlsQnVpbGRlci5idWlsZE1haWxcbiAgICAgIG1haWxGcm9tOiBqb2JEaWN0Lm1haWxGcm9tXG4gICAgICBtYWlsVG86IGpvYkRpY3QubWFpbFRvXG4gICAgICBtYWlsQ0M6IGpvYkRpY3QubWFpbENDXG4gICAgICBtYWlsQkNDOiBqb2JEaWN0Lm1haWxCQ0NcbiAgICAgIG1haWxTdWJqZWN0OiBqb2JEaWN0Lm1haWxTdWJqZWN0XG4gICAgICBtYWlsVHBsOiBqb2JEaWN0Lm1haWxUcGxcbiAgICAgIG1haWxEYXRhOiBqb2JEaWN0Lm1haWxEYXRhXG4gICAgICBtYWlsSGVhZGVyczogam9iRGljdC5tYWlsSGVhZGVyc1xuICAgICwgKGVyciwgbWFpbEZyb20sIG1haWxUbywgbWltZUJvZHkpID0+XG4gICAgICByZXR1cm4gY2IgY3JlYXRlRXJyb3IoZXJyLCAnQlVJTERNQUlMJykgaWYgZXJyXG4gICAgICBqb2JEaWN0ID0ge31cbiAgICAgIGpvYkRpY3QgPVxuICAgICAgICBzZW5kZXI6IG1haWxGcm9tXG4gICAgICAgIHJlY2lwaWVudHM6IG1haWxUb1xuICAgICAgICBtaW1lQm9keTogbWltZUJvZHlcbiAgICAgIHN1cGVyKGpvYkRpY3QsIGNiKVxuXG4gIGVycm9yOiAoZXJyLCB0YXNrLCBjYikgLT5cbiAgICBjYihlcnIpXG5cblxuY2xhc3MgTWFpbEFkYXB0ZXJcblxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICByZXR1cm5cblxuICBzZW5kTWFpbDogKCkgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IG92ZXJ3cml0ZSBzZW5kTWFpbCNNYWlsQWRhcHRlciBpbiBzdWJjbGFzcycpXG5cbiAgYnVpbGRNYWlsOiAoKSAtPlxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3Qgb3ZlcndyaXRlIGJ1aWxkTWFpbCNNYWlsQWRhcHRlciBpbiBzdWJjbGFzcycpXG5cblxuIyMjICMjI1xuIyBFWFBPUlRTXG5leHBvcnRzLk1haWxBZGFwdGVyID0gTWFpbEFkYXB0ZXJcbmV4cG9ydHMuTWFpbFdvcmtlciA9IE1haWxXb3JrZXJcbmV4cG9ydHMuTWFpbFdvcmtlckVycm9yID0gTWFpbFdvcmtlckVycm9yXG4iXX0=