var MailAdapter, MailWorker, Worker, async,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

async = require('async');

Worker = require('redisworker');

MailWorker = (function(_super) {
  __extends(MailWorker, _super);

  function MailWorker(options) {
    this.url = options.url, this.mailAdapter = options.mailAdapter, this.mailBuilder = options.mailBuilder;
    if (!this.mailAdapter) {
      throw new Error('You must use MailWorker with MailAdapter');
    }
    if (!this.mailBuilder) {
      throw new Error('You must use MailBuilder with MailAdapter');
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
    }, function(err, mailFrom, mailTo, mimeBody) {
      var payload;
      if (err) {
        return cb(err);
      }
      jobDict = {};
      jobDict = {
        sender: mailFrom,
        recipients: mailTo,
        mimeBody: mimeBody
      };
      payload = JSON.stringify(jobDict);
      return async.series([
        (function(_this) {
          return function(callback) {
            return _this.obtainListClient(function(err, client) {
              if (err) {
                return callback(err);
              }
              return client.rpush(_this.listKey(), payload, callback);
            });
          };
        })(this), (function(_this) {
          return function(callback) {
            return _this.obtainListClient(function(err, client) {
              if (err) {
                return callback(err);
              }
              return client.publish(_this.channelKey(), payload, callback);
            });
          };
        })(this)
      ], function(err) {
        return cb(err);
      });
    });
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

//# sourceMappingURL=data:application/json;base64,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Um9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgID0gcmVxdWlyZSgnYXN5bmMnKVxuV29ya2VyID0gcmVxdWlyZSgncmVkaXN3b3JrZXInKVxuXG5cbmNsYXNzIE1haWxXb3JrZXIgZXh0ZW5kcyBXb3JrZXJcblxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG4gICAge0B1cmwsIEBtYWlsQWRhcHRlciwgQG1haWxCdWlsZGVyfSA9IG9wdGlvbnNcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IHVzZSBNYWlsV29ya2VyIHdpdGggTWFpbEFkYXB0ZXInKSB1bmxlc3MgQG1haWxBZGFwdGVyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCB1c2UgTWFpbEJ1aWxkZXIgd2l0aCBNYWlsQWRhcHRlcicpIHVubGVzcyBAbWFpbEJ1aWxkZXJcblxuICBuYW1lOiAoKSAtPlxuICAgICdNYWlsV29ya2VyJ1xuXG4gIHdvcms6IChwYXlsb2FkLCBjYikgLT5cbiAgICBtYWlsID0gSlNPTi5wYXJzZShwYXlsb2FkKVxuICAgIEBtYWlsQWRhcHRlci5zZW5kTWFpbCBtYWlsLnNlbmRlciwgbWFpbC5yZWNpcGllbnRzLCBtYWlsLm1pbWVCb2R5LCAoZXJyKSAtPlxuICAgICAgY2IoZXJyKVxuXG4gIHB1c2hKb2I6IChqb2JEaWN0LCBjYikgLT5cbiAgICBAbWFpbEJ1aWxkZXIuYnVpbGRNYWlsXG4gICAgICBtYWlsRnJvbTogam9iRGljdC5tYWlsRnJvbVxuICAgICAgbWFpbFRvOiBqb2JEaWN0Lm1haWxUb1xuICAgICAgbWFpbFN1YmplY3Q6IGpvYkRpY3QubWFpbFN1YmplY3RcbiAgICAgIG1haWxUcGw6IGpvYkRpY3QubWFpbFRwbFxuICAgICAgbWFpbERhdGE6IGpvYkRpY3QubWFpbERhdGFcbiAgICAsIChlcnIsIG1haWxGcm9tLCBtYWlsVG8sIG1pbWVCb2R5KSAtPlxuICAgICAgcmV0dXJuIGNiKGVycikgaWYgZXJyXG4gICAgICBqb2JEaWN0ID0ge31cbiAgICAgIGpvYkRpY3QgPVxuICAgICAgICBzZW5kZXI6IG1haWxGcm9tXG4gICAgICAgIHJlY2lwaWVudHM6IG1haWxUb1xuICAgICAgICBtaW1lQm9keTogbWltZUJvZHlcbiAgICAgIHBheWxvYWQgPSBKU09OLnN0cmluZ2lmeShqb2JEaWN0KVxuICAgICAgYXN5bmMuc2VyaWVzKFtcbiAgICAgICAgKGNhbGxiYWNrKSA9PiBAb2J0YWluTGlzdENsaWVudCAoZXJyLGNsaWVudCkgPT5cbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKSBpZiBlcnJcbiAgICAgICAgICBjbGllbnQucnB1c2goQGxpc3RLZXkoKSwgcGF5bG9hZCwgY2FsbGJhY2spXG4gICAgICAgIChjYWxsYmFjaykgPT4gQG9idGFpbkxpc3RDbGllbnQgKGVycixjbGllbnQpID0+XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycikgaWYgZXJyXG4gICAgICAgICAgY2xpZW50LnB1Ymxpc2goQGNoYW5uZWxLZXkoKSwgcGF5bG9hZCwgY2FsbGJhY2spXG4gICAgICBdLCAoZXJyKSAtPiBjYihlcnIpKVxuXG4gIGVycm9yOiAoZXJyLCBjYikgLT5cbiAgICBjb25zb2xlLmxvZyAnW0Vycm9yXScsIGVyciBpZiBlcnJcbiAgICBjYigpXG4gICAgcmV0dXJuXG5cblxuY2xhc3MgTWFpbEFkYXB0ZXJcbiAgXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIHJldHVyblxuXG4gIHNlbmRNYWlsOiAoKSAtPlxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3Qgb3ZlcndyaXRlIHNlbmRNYWlsI01haWxBZGFwdGVyIGluIHN1YmNsYXNzJylcblxuICBidWlsZE1haWw6ICgpIC0+XG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBvdmVyd3JpdGUgYnVpbGRNYWlsI01haWxBZGFwdGVyIGluIHN1YmNsYXNzJylcblxuXG5leHBvcnRzLk1haWxBZGFwdGVyID0gTWFpbEFkYXB0ZXJcbmV4cG9ydHMuTWFpbFdvcmtlciA9IE1haWxXb3JrZXJcbiJdfQ==