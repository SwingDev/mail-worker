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

//# sourceMappingURL=data:application/json;base64,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SUFBTixFQUFZLEVBQVosR0FBQTtXQUNMLEVBQUEsQ0FBRyxHQUFILEVBREs7RUFBQSxDQS9CUCxDQUFBOztvQkFBQTs7R0FGdUIsT0FQekIsQ0FBQTs7QUFBQTtBQThDZSxFQUFBLHFCQUFBLEdBQUE7QUFDWCxVQUFBLENBRFc7RUFBQSxDQUFiOztBQUFBLHdCQUdBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFVLElBQUEsS0FBQSxDQUFNLHFEQUFOLENBQVYsQ0FEUTtFQUFBLENBSFYsQ0FBQTs7QUFBQSx3QkFNQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBVSxJQUFBLEtBQUEsQ0FBTSxzREFBTixDQUFWLENBRFM7RUFBQSxDQU5YLENBQUE7O3FCQUFBOztJQTlDRixDQUFBOztBQXdEQTtBQUFBLEtBeERBOztBQUFBLE9BMERPLENBQUMsV0FBUixHQUFzQixXQTFEdEIsQ0FBQTs7QUFBQSxPQTJETyxDQUFDLFVBQVIsR0FBcUIsVUEzRHJCLENBQUE7O0FBQUEsT0E0RE8sQ0FBQyxlQUFSLEdBQTBCLGVBNUQxQixDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiV29ya2VyID0gcmVxdWlyZSgncmVkaXMtd29ya2VyJykuV29ya2VyXG5lcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpXG5cbmNyZWF0ZUVycm9yID0gZXJyb3JzLmNyZWF0ZUVycm9yXG5NYWlsV29ya2VyRXJyb3IgPSBlcnJvcnMuTWFpbFdvcmtlckVycm9yXG5cblxuY2xhc3MgTWFpbFdvcmtlciBleHRlbmRzIFdvcmtlclxuXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cbiAgICB7QHVybCwgQG1haWxBZGFwdGVyLCBAbWFpbEJ1aWxkZXIsIEB0YXNrTGltaXR9ID0gb3B0aW9uc1xuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgdXNlIE1haWxXb3JrZXIgd2l0aCBNYWlsQWRhcHRlcicpIHVubGVzcyBAbWFpbEFkYXB0ZXJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IHVzZSBNYWlsV29ya2VyIHdpdGggTWFpbEJ1aWxkZXInKSB1bmxlc3MgQG1haWxCdWlsZGVyXG4gICAgc3VwZXIoQHVybCwgQHRhc2tMaW1pdClcblxuICBuYW1lOiAoKSAtPlxuICAgICdNYWlsV29ya2VyJ1xuXG4gIHdvcms6IChwYXlsb2FkLCBjYikgLT5cbiAgICBtYWlsID0gSlNPTi5wYXJzZShwYXlsb2FkKVxuICAgIEBtYWlsQWRhcHRlci5zZW5kTWFpbCBtYWlsLnNlbmRlciwgbWFpbC5yZWNpcGllbnRzLCBtYWlsLm1pbWVCb2R5LCAoZXJyKSAtPlxuICAgICAgcmV0dXJuIGNiIGNyZWF0ZUVycm9yKGVyciwgJ1NFTkRNQUlMJykgaWYgZXJyXG4gICAgICBjYiBudWxsXG5cbiAgcHVzaEpvYjogKGpvYkRpY3QsIGNiKSAtPlxuICAgIEBtYWlsQnVpbGRlci5idWlsZE1haWxcbiAgICAgIG1haWxGcm9tOiBqb2JEaWN0Lm1haWxGcm9tXG4gICAgICBtYWlsVG86IGpvYkRpY3QubWFpbFRvXG4gICAgICBtYWlsU3ViamVjdDogam9iRGljdC5tYWlsU3ViamVjdFxuICAgICAgbWFpbFRwbDogam9iRGljdC5tYWlsVHBsXG4gICAgICBtYWlsRGF0YTogam9iRGljdC5tYWlsRGF0YVxuICAgICwgKGVyciwgbWFpbEZyb20sIG1haWxUbywgbWltZUJvZHkpID0+XG4gICAgICByZXR1cm4gY2IgY3JlYXRlRXJyb3IoZXJyLCAnQlVJTERNQUlMJykgaWYgZXJyXG4gICAgICBqb2JEaWN0ID0ge31cbiAgICAgIGpvYkRpY3QgPVxuICAgICAgICBzZW5kZXI6IG1haWxGcm9tXG4gICAgICAgIHJlY2lwaWVudHM6IG1haWxUb1xuICAgICAgICBtaW1lQm9keTogbWltZUJvZHlcbiAgICAgIHN1cGVyKGpvYkRpY3QsIGNiKVxuXG4gIGVycm9yOiAoZXJyLCB0YXNrLCBjYikgLT5cbiAgICBjYihlcnIpXG5cblxuY2xhc3MgTWFpbEFkYXB0ZXJcblxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICByZXR1cm5cblxuICBzZW5kTWFpbDogKCkgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IG92ZXJ3cml0ZSBzZW5kTWFpbCNNYWlsQWRhcHRlciBpbiBzdWJjbGFzcycpXG5cbiAgYnVpbGRNYWlsOiAoKSAtPlxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3Qgb3ZlcndyaXRlIGJ1aWxkTWFpbCNNYWlsQWRhcHRlciBpbiBzdWJjbGFzcycpXG5cblxuIyMjICMjI1xuIyBFWFBPUlRTXG5leHBvcnRzLk1haWxBZGFwdGVyID0gTWFpbEFkYXB0ZXJcbmV4cG9ydHMuTWFpbFdvcmtlciA9IE1haWxXb3JrZXJcbmV4cG9ydHMuTWFpbFdvcmtlckVycm9yID0gTWFpbFdvcmtlckVycm9yXG4iXX0=