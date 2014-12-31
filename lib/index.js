var MailAdapter, MailWorker, MailWorkerError, Worker, createError, errors,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Worker = require('redis-worker').Worker;

errors = require('./errors');

createError = errors.createError;

MailWorkerError = errors.MailWorkerError;

MailWorker = (function(_super) {
  __extends(MailWorker, _super);

  function MailWorker(options) {
    this.url = options.url, this.mailAdapter = options.mailAdapter, this.mailBuilder = options.mailBuilder, this.taskLimit = options.taskLimit;
    if (!this.mailAdapter) {
      throw new Error('You must use MailWorker with MailAdapter');
    }
    if (!this.mailBuilder) {
      throw new Error('You must use MailWorker with MailBuilder');
    }
    MailWorker.__super__.constructor.call(this, this.url, this.taskLimit);
  }

  MailWorker.prototype.name = function() {
    return 'MailWorker';
  };

  MailWorker.prototype.work = function(payload, cb) {
    var mail;
    mail = JSON.parse(payload);
    return this.mailAdapter.sendMail(mail.sender, mail.recipients, mail.mimeBody, function(err) {
      return cb(createError(err, 'SENDMAIL'));
    });
  };

  MailWorker.prototype.pushJob = function(jobDict, cb) {
    return this.mailBuilder.buildMail({
      mailFrom: jobDict.mailFrom,
      mailTo: jobDict.mailTo,
      mailSubject: jobDict.mailSubject,
      mailTpl: jobDict.mailTpl,
      mailData: jobDict.mailData
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

//# sourceMappingURL=data:application/json;base64,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b0JBQUE7O0dBRnVCLE9BUHpCLENBQUE7O0FBQUE7QUE2Q2UsRUFBQSxxQkFBQSxHQUFBO0FBQ1gsVUFBQSxDQURXO0VBQUEsQ0FBYjs7QUFBQSx3QkFHQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBVSxJQUFBLEtBQUEsQ0FBTSxxREFBTixDQUFWLENBRFE7RUFBQSxDQUhWLENBQUE7O0FBQUEsd0JBTUEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQVUsSUFBQSxLQUFBLENBQU0sc0RBQU4sQ0FBVixDQURTO0VBQUEsQ0FOWCxDQUFBOztxQkFBQTs7SUE3Q0YsQ0FBQTs7QUF1REE7QUFBQSxLQXZEQTs7QUFBQSxPQXlETyxDQUFDLFdBQVIsR0FBc0IsV0F6RHRCLENBQUE7O0FBQUEsT0EwRE8sQ0FBQyxVQUFSLEdBQXFCLFVBMURyQixDQUFBOztBQUFBLE9BMkRPLENBQUMsZUFBUixHQUEwQixlQTNEMUIsQ0FBQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIldvcmtlciA9IHJlcXVpcmUoJ3JlZGlzLXdvcmtlcicpLldvcmtlclxuZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKVxuXG5jcmVhdGVFcnJvciA9IGVycm9ycy5jcmVhdGVFcnJvclxuTWFpbFdvcmtlckVycm9yID0gZXJyb3JzLk1haWxXb3JrZXJFcnJvclxuXG5cbmNsYXNzIE1haWxXb3JrZXIgZXh0ZW5kcyBXb3JrZXJcblxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG4gICAge0B1cmwsIEBtYWlsQWRhcHRlciwgQG1haWxCdWlsZGVyLCBAdGFza0xpbWl0fSA9IG9wdGlvbnNcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IHVzZSBNYWlsV29ya2VyIHdpdGggTWFpbEFkYXB0ZXInKSB1bmxlc3MgQG1haWxBZGFwdGVyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCB1c2UgTWFpbFdvcmtlciB3aXRoIE1haWxCdWlsZGVyJykgdW5sZXNzIEBtYWlsQnVpbGRlclxuICAgIHN1cGVyKEB1cmwsIEB0YXNrTGltaXQpXG5cbiAgbmFtZTogKCkgLT5cbiAgICAnTWFpbFdvcmtlcidcblxuICB3b3JrOiAocGF5bG9hZCwgY2IpIC0+XG4gICAgbWFpbCA9IEpTT04ucGFyc2UocGF5bG9hZClcbiAgICBAbWFpbEFkYXB0ZXIuc2VuZE1haWwgbWFpbC5zZW5kZXIsIG1haWwucmVjaXBpZW50cywgbWFpbC5taW1lQm9keSwgKGVycikgLT5cbiAgICAgIGNiIGNyZWF0ZUVycm9yKGVyciwgJ1NFTkRNQUlMJylcblxuICBwdXNoSm9iOiAoam9iRGljdCwgY2IpIC0+XG4gICAgQG1haWxCdWlsZGVyLmJ1aWxkTWFpbFxuICAgICAgbWFpbEZyb206IGpvYkRpY3QubWFpbEZyb21cbiAgICAgIG1haWxUbzogam9iRGljdC5tYWlsVG9cbiAgICAgIG1haWxTdWJqZWN0OiBqb2JEaWN0Lm1haWxTdWJqZWN0XG4gICAgICBtYWlsVHBsOiBqb2JEaWN0Lm1haWxUcGxcbiAgICAgIG1haWxEYXRhOiBqb2JEaWN0Lm1haWxEYXRhXG4gICAgLCAoZXJyLCBtYWlsRnJvbSwgbWFpbFRvLCBtaW1lQm9keSkgPT5cbiAgICAgIHJldHVybiBjYiBjcmVhdGVFcnJvcihlcnIsICdCVUlMRE1BSUwnKSBpZiBlcnJcbiAgICAgIGpvYkRpY3QgPSB7fVxuICAgICAgam9iRGljdCA9XG4gICAgICAgIHNlbmRlcjogbWFpbEZyb21cbiAgICAgICAgcmVjaXBpZW50czogbWFpbFRvXG4gICAgICAgIG1pbWVCb2R5OiBtaW1lQm9keVxuICAgICAgc3VwZXIoam9iRGljdCwgY2IpXG5cbiAgZXJyb3I6IChlcnIsIHRhc2ssIGNiKSAtPlxuICAgIGNiKGVycilcblxuXG5jbGFzcyBNYWlsQWRhcHRlclxuXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIHJldHVyblxuXG4gIHNlbmRNYWlsOiAoKSAtPlxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3Qgb3ZlcndyaXRlIHNlbmRNYWlsI01haWxBZGFwdGVyIGluIHN1YmNsYXNzJylcblxuICBidWlsZE1haWw6ICgpIC0+XG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBvdmVyd3JpdGUgYnVpbGRNYWlsI01haWxBZGFwdGVyIGluIHN1YmNsYXNzJylcblxuXG4jIyMgIyMjXG4jIEVYUE9SVFNcbmV4cG9ydHMuTWFpbEFkYXB0ZXIgPSBNYWlsQWRhcHRlclxuZXhwb3J0cy5NYWlsV29ya2VyID0gTWFpbFdvcmtlclxuZXhwb3J0cy5NYWlsV29ya2VyRXJyb3IgPSBNYWlsV29ya2VyRXJyb3JcbiJdfQ==