var MailAdapter, MailWorker, Worker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Worker = require('redis-worker');

MailWorker = (function(_super) {
  __extends(MailWorker, _super);

  function MailWorker(options) {
    this.url = options.url, this.mailAdapter = options.mailAdapter, this.mailBuilder = options.mailBuilder;
    if (!this.mailAdapter) {
      throw new Error('You must use MailWorker with MailAdapter');
    }
    if (!this.mailBuilder) {
      throw new Error('You must use MailWorker with MailBuilder');
    }
  }

  MailWorker.prototype.name = function() {
    return 'MailWorker';
  };

  MailWorker.prototype.work = function(payload, cb) {
    var mail;
    mail = JSON.parse(payload);
    return this.mailAdapter.sendMail(mail.sender, mail.recipients, mail.mimeBody, function(err) {
      return cb(err);
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
          return cb(err);
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

  MailWorker.prototype.error = function(err, cb) {
    if (err) {
      console.log('[Error]', err);
    }
    cb();
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

exports.MailAdapter = MailAdapter;

exports.MailWorker = MailWorker;

//# sourceMappingURL=data:application/json;base64,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R0FBQTtBQUNULFVBQVUsSUFBQSxLQUFBLENBQU0sc0RBQU4sQ0FBVixDQURTO0VBQUEsQ0FOWCxDQUFBOztxQkFBQTs7SUExQ0YsQ0FBQTs7QUFBQSxPQW9ETyxDQUFDLFdBQVIsR0FBc0IsV0FwRHRCLENBQUE7O0FBQUEsT0FxRE8sQ0FBQyxVQUFSLEdBQXFCLFVBckRyQixDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiV29ya2VyID0gcmVxdWlyZSgncmVkaXMtd29ya2VyJylcblxuXG5jbGFzcyBNYWlsV29ya2VyIGV4dGVuZHMgV29ya2VyXG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgIHtAdXJsLCBAbWFpbEFkYXB0ZXIsIEBtYWlsQnVpbGRlcn0gPSBvcHRpb25zXG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCB1c2UgTWFpbFdvcmtlciB3aXRoIE1haWxBZGFwdGVyJykgdW5sZXNzIEBtYWlsQWRhcHRlclxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgdXNlIE1haWxXb3JrZXIgd2l0aCBNYWlsQnVpbGRlcicpIHVubGVzcyBAbWFpbEJ1aWxkZXJcblxuICBuYW1lOiAoKSAtPlxuICAgICdNYWlsV29ya2VyJ1xuXG4gIHdvcms6IChwYXlsb2FkLCBjYikgLT5cbiAgICBtYWlsID0gSlNPTi5wYXJzZShwYXlsb2FkKVxuICAgIEBtYWlsQWRhcHRlci5zZW5kTWFpbCBtYWlsLnNlbmRlciwgbWFpbC5yZWNpcGllbnRzLCBtYWlsLm1pbWVCb2R5LCAoZXJyKSAtPlxuICAgICAgY2IoZXJyKVxuXG4gIHB1c2hKb2I6IChqb2JEaWN0LCBjYikgLT5cbiAgICBAbWFpbEJ1aWxkZXIuYnVpbGRNYWlsXG4gICAgICBtYWlsRnJvbTogam9iRGljdC5tYWlsRnJvbVxuICAgICAgbWFpbFRvOiBqb2JEaWN0Lm1haWxUb1xuICAgICAgbWFpbFN1YmplY3Q6IGpvYkRpY3QubWFpbFN1YmplY3RcbiAgICAgIG1haWxUcGw6IGpvYkRpY3QubWFpbFRwbFxuICAgICAgbWFpbERhdGE6IGpvYkRpY3QubWFpbERhdGFcbiAgICAsIChlcnIsIG1haWxGcm9tLCBtYWlsVG8sIG1pbWVCb2R5KSA9PlxuICAgICAgcmV0dXJuIGNiKGVycikgaWYgZXJyXG4gICAgICBqb2JEaWN0ID0ge31cbiAgICAgIGpvYkRpY3QgPVxuICAgICAgICBzZW5kZXI6IG1haWxGcm9tXG4gICAgICAgIHJlY2lwaWVudHM6IG1haWxUb1xuICAgICAgICBtaW1lQm9keTogbWltZUJvZHlcbiAgICAgIHN1cGVyKGpvYkRpY3QsIGNiKVxuXG4gIGVycm9yOiAoZXJyLCBjYikgLT5cbiAgICBjb25zb2xlLmxvZyAnW0Vycm9yXScsIGVyciBpZiBlcnJcbiAgICBjYigpXG4gICAgcmV0dXJuXG5cblxuY2xhc3MgTWFpbEFkYXB0ZXJcbiAgXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIHJldHVyblxuXG4gIHNlbmRNYWlsOiAoKSAtPlxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3Qgb3ZlcndyaXRlIHNlbmRNYWlsI01haWxBZGFwdGVyIGluIHN1YmNsYXNzJylcblxuICBidWlsZE1haWw6ICgpIC0+XG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBvdmVyd3JpdGUgYnVpbGRNYWlsI01haWxBZGFwdGVyIGluIHN1YmNsYXNzJylcblxuXG5leHBvcnRzLk1haWxBZGFwdGVyID0gTWFpbEFkYXB0ZXJcbmV4cG9ydHMuTWFpbFdvcmtlciA9IE1haWxXb3JrZXJcbiJdfQ==