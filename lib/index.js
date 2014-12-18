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

//# sourceMappingURL=data:application/json;base64,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UUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQVUsSUFBQSxLQUFBLENBQU0scURBQU4sQ0FBVixDQURRO0VBQUEsQ0FIVixDQUFBOztBQUFBLHdCQU1BLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFVLElBQUEsS0FBQSxDQUFNLHNEQUFOLENBQVYsQ0FEUztFQUFBLENBTlgsQ0FBQTs7cUJBQUE7O0lBNUNGLENBQUE7O0FBc0RBO0FBQUEsS0F0REE7O0FBQUEsT0F3RE8sQ0FBQyxXQUFSLEdBQXNCLFdBeER0QixDQUFBOztBQUFBLE9BeURPLENBQUMsVUFBUixHQUFxQixVQXpEckIsQ0FBQTs7QUFBQSxPQTBETyxDQUFDLGVBQVIsR0FBMEIsZUExRDFCLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJXb3JrZXIgPSByZXF1aXJlKCdyZWRpcy13b3JrZXInKS5Xb3JrZXJcbmVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJylcblxuY3JlYXRlRXJyb3IgPSBlcnJvcnMuY3JlYXRlRXJyb3Jcbk1haWxXb3JrZXJFcnJvciA9IGVycm9ycy5NYWlsV29ya2VyRXJyb3JcblxuXG5jbGFzcyBNYWlsV29ya2VyIGV4dGVuZHMgV29ya2VyXG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgIHtAdXJsLCBAbWFpbEFkYXB0ZXIsIEBtYWlsQnVpbGRlcn0gPSBvcHRpb25zXG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCB1c2UgTWFpbFdvcmtlciB3aXRoIE1haWxBZGFwdGVyJykgdW5sZXNzIEBtYWlsQWRhcHRlclxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgdXNlIE1haWxXb3JrZXIgd2l0aCBNYWlsQnVpbGRlcicpIHVubGVzcyBAbWFpbEJ1aWxkZXJcblxuICBuYW1lOiAoKSAtPlxuICAgICdNYWlsV29ya2VyJ1xuXG4gIHdvcms6IChwYXlsb2FkLCBjYikgLT5cbiAgICBtYWlsID0gSlNPTi5wYXJzZShwYXlsb2FkKVxuICAgIEBtYWlsQWRhcHRlci5zZW5kTWFpbCBtYWlsLnNlbmRlciwgbWFpbC5yZWNpcGllbnRzLCBtYWlsLm1pbWVCb2R5LCAoZXJyKSAtPlxuICAgICAgY2IgY3JlYXRlRXJyb3IoZXJyLCAnU0VORE1BSUwnKVxuXG4gIHB1c2hKb2I6IChqb2JEaWN0LCBjYikgLT5cbiAgICBAbWFpbEJ1aWxkZXIuYnVpbGRNYWlsXG4gICAgICBtYWlsRnJvbTogam9iRGljdC5tYWlsRnJvbVxuICAgICAgbWFpbFRvOiBqb2JEaWN0Lm1haWxUb1xuICAgICAgbWFpbFN1YmplY3Q6IGpvYkRpY3QubWFpbFN1YmplY3RcbiAgICAgIG1haWxUcGw6IGpvYkRpY3QubWFpbFRwbFxuICAgICAgbWFpbERhdGE6IGpvYkRpY3QubWFpbERhdGFcbiAgICAsIChlcnIsIG1haWxGcm9tLCBtYWlsVG8sIG1pbWVCb2R5KSA9PlxuICAgICAgcmV0dXJuIGNiIGNyZWF0ZUVycm9yKGVyciwgJ0JVSUxETUFJTCcpIGlmIGVyclxuICAgICAgam9iRGljdCA9IHt9XG4gICAgICBqb2JEaWN0ID1cbiAgICAgICAgc2VuZGVyOiBtYWlsRnJvbVxuICAgICAgICByZWNpcGllbnRzOiBtYWlsVG9cbiAgICAgICAgbWltZUJvZHk6IG1pbWVCb2R5XG4gICAgICBzdXBlcihqb2JEaWN0LCBjYilcblxuICBlcnJvcjogKGVyciwgdGFzaywgY2IpIC0+XG4gICAgY2IoZXJyKVxuXG5cbmNsYXNzIE1haWxBZGFwdGVyXG5cbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgcmV0dXJuXG5cbiAgc2VuZE1haWw6ICgpIC0+XG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBvdmVyd3JpdGUgc2VuZE1haWwjTWFpbEFkYXB0ZXIgaW4gc3ViY2xhc3MnKVxuXG4gIGJ1aWxkTWFpbDogKCkgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IG92ZXJ3cml0ZSBidWlsZE1haWwjTWFpbEFkYXB0ZXIgaW4gc3ViY2xhc3MnKVxuXG5cbiMjIyAjIyNcbiMgRVhQT1JUU1xuZXhwb3J0cy5NYWlsQWRhcHRlciA9IE1haWxBZGFwdGVyXG5leHBvcnRzLk1haWxXb3JrZXIgPSBNYWlsV29ya2VyXG5leHBvcnRzLk1haWxXb3JrZXJFcnJvciA9IE1haWxXb3JrZXJFcnJvclxuIl19