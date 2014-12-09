var MailAdapter, MailWorker, Worker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLCtCQUFBO0VBQUE7aVNBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxhQUFSLENBQVQsQ0FBQTs7QUFBQTtBQUtFLCtCQUFBLENBQUE7O0FBQWEsRUFBQSxvQkFBQyxPQUFELEdBQUE7QUFDWCxJQUFDLElBQUMsQ0FBQSxjQUFBLEdBQUYsRUFBTyxJQUFDLENBQUEsc0JBQUEsV0FBUixFQUFxQixJQUFDLENBQUEsc0JBQUEsV0FBdEIsQ0FBQTtBQUNBLElBQUEsSUFBQSxDQUFBLElBQW9FLENBQUEsV0FBcEU7QUFBQSxZQUFVLElBQUEsS0FBQSxDQUFNLDBDQUFOLENBQVYsQ0FBQTtLQURBO0FBRUEsSUFBQSxJQUFBLENBQUEsSUFBcUUsQ0FBQSxXQUFyRTtBQUFBLFlBQVUsSUFBQSxLQUFBLENBQU0sMkNBQU4sQ0FBVixDQUFBO0tBSFc7RUFBQSxDQUFiOztBQUFBLHVCQUtBLElBQUEsR0FBTSxTQUFBLEdBQUE7V0FDSixhQURJO0VBQUEsQ0FMTixDQUFBOztBQUFBLHVCQVFBLElBQUEsR0FBTSxTQUFDLE9BQUQsRUFBVSxFQUFWLEdBQUE7QUFDSixRQUFBLElBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLE9BQVgsQ0FBUCxDQUFBO1dBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQXNCLElBQUksQ0FBQyxNQUEzQixFQUFtQyxJQUFJLENBQUMsVUFBeEMsRUFBb0QsSUFBSSxDQUFDLFFBQXpELEVBQW1FLFNBQUMsR0FBRCxHQUFBO2FBQ2pFLEVBQUEsQ0FBRyxHQUFILEVBRGlFO0lBQUEsQ0FBbkUsRUFGSTtFQUFBLENBUk4sQ0FBQTs7QUFBQSx1QkFhQSxPQUFBLEdBQVMsU0FBQyxPQUFELEVBQVUsRUFBVixHQUFBO1dBQ1AsSUFBQyxDQUFBLFdBQVcsQ0FBQyxTQUFiLENBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxPQUFPLENBQUMsUUFBbEI7QUFBQSxNQUNBLE1BQUEsRUFBUSxPQUFPLENBQUMsTUFEaEI7QUFBQSxNQUVBLFdBQUEsRUFBYSxPQUFPLENBQUMsV0FGckI7QUFBQSxNQUdBLE9BQUEsRUFBUyxPQUFPLENBQUMsT0FIakI7QUFBQSxNQUlBLFFBQUEsRUFBVSxPQUFPLENBQUMsUUFKbEI7S0FERixFQU1FLFNBQUMsR0FBRCxFQUFNLFFBQU4sRUFBZ0IsTUFBaEIsRUFBd0IsUUFBeEIsR0FBQTtBQUNBLFVBQUEsT0FBQTtBQUFBLE1BQUEsSUFBa0IsR0FBbEI7QUFBQSxlQUFPLEVBQUEsQ0FBRyxHQUFILENBQVAsQ0FBQTtPQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsRUFEVixDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQ0U7QUFBQSxRQUFBLE1BQUEsRUFBUSxRQUFSO0FBQUEsUUFDQSxVQUFBLEVBQVksTUFEWjtBQUFBLFFBRUEsUUFBQSxFQUFVLFFBRlY7T0FIRixDQUFBO0FBQUEsTUFNQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxPQUFmLENBTlYsQ0FBQTthQU9BLEtBQUssQ0FBQyxNQUFOLENBQWE7UUFDWCxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsUUFBRCxHQUFBO21CQUFjLEtBQUMsQ0FBQSxnQkFBRCxDQUFrQixTQUFDLEdBQUQsRUFBSyxNQUFMLEdBQUE7QUFDOUIsY0FBQSxJQUF3QixHQUF4QjtBQUFBLHVCQUFPLFFBQUEsQ0FBUyxHQUFULENBQVAsQ0FBQTtlQUFBO3FCQUNBLE1BQU0sQ0FBQyxLQUFQLENBQWEsS0FBQyxDQUFBLE9BQUQsQ0FBQSxDQUFiLEVBQXlCLE9BQXpCLEVBQWtDLFFBQWxDLEVBRjhCO1lBQUEsQ0FBbEIsRUFBZDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFcsRUFJWCxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsUUFBRCxHQUFBO21CQUFjLEtBQUMsQ0FBQSxnQkFBRCxDQUFrQixTQUFDLEdBQUQsRUFBSyxNQUFMLEdBQUE7QUFDOUIsY0FBQSxJQUF3QixHQUF4QjtBQUFBLHVCQUFPLFFBQUEsQ0FBUyxHQUFULENBQVAsQ0FBQTtlQUFBO3FCQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBQyxDQUFBLFVBQUQsQ0FBQSxDQUFmLEVBQThCLE9BQTlCLEVBQXVDLFFBQXZDLEVBRjhCO1lBQUEsQ0FBbEIsRUFBZDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSlc7T0FBYixFQU9HLFNBQUMsR0FBRCxHQUFBO2VBQVMsRUFBQSxDQUFHLEdBQUgsRUFBVDtNQUFBLENBUEgsRUFSQTtJQUFBLENBTkYsRUFETztFQUFBLENBYlQsQ0FBQTs7QUFBQSx1QkFxQ0EsS0FBQSxHQUFPLFNBQUMsR0FBRCxFQUFNLEVBQU4sR0FBQTtBQUNMLElBQUEsSUFBOEIsR0FBOUI7QUFBQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksU0FBWixFQUF1QixHQUF2QixDQUFBLENBQUE7S0FBQTtBQUFBLElBQ0EsRUFBQSxDQUFBLENBREEsQ0FESztFQUFBLENBckNQLENBQUE7O29CQUFBOztHQUZ1QixPQUh6QixDQUFBOztBQUFBO0FBa0RlLEVBQUEscUJBQUEsR0FBQTtBQUNYLFVBQUEsQ0FEVztFQUFBLENBQWI7O0FBQUEsd0JBR0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQVUsSUFBQSxLQUFBLENBQU0scURBQU4sQ0FBVixDQURRO0VBQUEsQ0FIVixDQUFBOztBQUFBLHdCQU1BLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFVLElBQUEsS0FBQSxDQUFNLHNEQUFOLENBQVYsQ0FEUztFQUFBLENBTlgsQ0FBQTs7cUJBQUE7O0lBbERGLENBQUE7O0FBQUEsT0E0RE8sQ0FBQyxXQUFSLEdBQXNCLFdBNUR0QixDQUFBOztBQUFBLE9BNkRPLENBQUMsVUFBUixHQUFxQixVQTdEckIsQ0FBQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIldvcmtlciA9IHJlcXVpcmUoJ3JlZGlzd29ya2VyJylcblxuXG5jbGFzcyBNYWlsV29ya2VyIGV4dGVuZHMgV29ya2VyXG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgIHtAdXJsLCBAbWFpbEFkYXB0ZXIsIEBtYWlsQnVpbGRlcn0gPSBvcHRpb25zXG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCB1c2UgTWFpbFdvcmtlciB3aXRoIE1haWxBZGFwdGVyJykgdW5sZXNzIEBtYWlsQWRhcHRlclxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgdXNlIE1haWxCdWlsZGVyIHdpdGggTWFpbEFkYXB0ZXInKSB1bmxlc3MgQG1haWxCdWlsZGVyXG5cbiAgbmFtZTogKCkgLT5cbiAgICAnTWFpbFdvcmtlcidcblxuICB3b3JrOiAocGF5bG9hZCwgY2IpIC0+XG4gICAgbWFpbCA9IEpTT04ucGFyc2UocGF5bG9hZClcbiAgICBAbWFpbEFkYXB0ZXIuc2VuZE1haWwgbWFpbC5zZW5kZXIsIG1haWwucmVjaXBpZW50cywgbWFpbC5taW1lQm9keSwgKGVycikgLT5cbiAgICAgIGNiKGVycilcblxuICBwdXNoSm9iOiAoam9iRGljdCwgY2IpIC0+XG4gICAgQG1haWxCdWlsZGVyLmJ1aWxkTWFpbFxuICAgICAgbWFpbEZyb206IGpvYkRpY3QubWFpbEZyb21cbiAgICAgIG1haWxUbzogam9iRGljdC5tYWlsVG9cbiAgICAgIG1haWxTdWJqZWN0OiBqb2JEaWN0Lm1haWxTdWJqZWN0XG4gICAgICBtYWlsVHBsOiBqb2JEaWN0Lm1haWxUcGxcbiAgICAgIG1haWxEYXRhOiBqb2JEaWN0Lm1haWxEYXRhXG4gICAgLCAoZXJyLCBtYWlsRnJvbSwgbWFpbFRvLCBtaW1lQm9keSkgLT5cbiAgICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgICAgam9iRGljdCA9IHt9XG4gICAgICBqb2JEaWN0ID1cbiAgICAgICAgc2VuZGVyOiBtYWlsRnJvbVxuICAgICAgICByZWNpcGllbnRzOiBtYWlsVG9cbiAgICAgICAgbWltZUJvZHk6IG1pbWVCb2R5XG4gICAgICBwYXlsb2FkID0gSlNPTi5zdHJpbmdpZnkoam9iRGljdClcbiAgICAgIGFzeW5jLnNlcmllcyhbXG4gICAgICAgIChjYWxsYmFjaykgPT4gQG9idGFpbkxpc3RDbGllbnQgKGVycixjbGllbnQpID0+XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycikgaWYgZXJyXG4gICAgICAgICAgY2xpZW50LnJwdXNoKEBsaXN0S2V5KCksIHBheWxvYWQsIGNhbGxiYWNrKVxuICAgICAgICAoY2FsbGJhY2spID0+IEBvYnRhaW5MaXN0Q2xpZW50IChlcnIsY2xpZW50KSA9PlxuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpIGlmIGVyclxuICAgICAgICAgIGNsaWVudC5wdWJsaXNoKEBjaGFubmVsS2V5KCksIHBheWxvYWQsIGNhbGxiYWNrKVxuICAgICAgXSwgKGVycikgLT4gY2IoZXJyKSlcblxuICBlcnJvcjogKGVyciwgY2IpIC0+XG4gICAgY29uc29sZS5sb2cgJ1tFcnJvcl0nLCBlcnIgaWYgZXJyXG4gICAgY2IoKVxuICAgIHJldHVyblxuXG5cbmNsYXNzIE1haWxBZGFwdGVyXG4gIFxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICByZXR1cm5cblxuICBzZW5kTWFpbDogKCkgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IG92ZXJ3cml0ZSBzZW5kTWFpbCNNYWlsQWRhcHRlciBpbiBzdWJjbGFzcycpXG5cbiAgYnVpbGRNYWlsOiAoKSAtPlxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3Qgb3ZlcndyaXRlIGJ1aWxkTWFpbCNNYWlsQWRhcHRlciBpbiBzdWJjbGFzcycpXG5cblxuZXhwb3J0cy5NYWlsQWRhcHRlciA9IE1haWxBZGFwdGVyXG5leHBvcnRzLk1haWxXb3JrZXIgPSBNYWlsV29ya2VyXG4iXX0=