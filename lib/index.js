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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLHFFQUFBO0VBQUE7NkJBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxjQUFSLENBQXVCLENBQUMsTUFBakMsQ0FBQTs7QUFBQSxNQUNBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FEVCxDQUFBOztBQUFBLFdBR0EsR0FBYyxNQUFNLENBQUMsV0FIckIsQ0FBQTs7QUFBQSxlQUlBLEdBQWtCLE1BQU0sQ0FBQyxlQUp6QixDQUFBOztBQUFBO0FBU0UsZ0NBQUEsQ0FBQTs7QUFBYSxFQUFBLG9CQUFDLE9BQUQsR0FBQTtBQUNYLElBQUMsSUFBQyxDQUFBLGNBQUEsR0FBRixFQUFPLElBQUMsQ0FBQSxvQkFBQSxTQUFSLEVBQW1CLElBQUMsQ0FBQSxxQkFBQSxVQUFwQixFQUFnQyxJQUFDLENBQUEsc0JBQUEsV0FBakMsRUFBOEMsSUFBQyxDQUFBLHNCQUFBLFdBQS9DLENBQUE7QUFDQSxJQUFBLElBQUEsQ0FBQSxJQUFvRSxDQUFBLFdBQXBFO0FBQUEsWUFBVSxJQUFBLEtBQUEsQ0FBTSwwQ0FBTixDQUFWLENBQUE7S0FEQTtBQUVBLElBQUEsSUFBQSxDQUFBLElBQW9FLENBQUEsV0FBcEU7QUFBQSxZQUFVLElBQUEsS0FBQSxDQUFNLDBDQUFOLENBQVYsQ0FBQTtLQUZBO0FBQUEsSUFHQSw0Q0FBTTtBQUFBLE1BQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxHQUFOO0FBQUEsTUFBVyxTQUFBLEVBQVcsSUFBQyxDQUFBLFNBQXZCO0FBQUEsTUFBa0MsVUFBQSxFQUFZLElBQUMsQ0FBQSxVQUEvQztLQUFOLENBSEEsQ0FEVztFQUFBLENBQWI7O0FBQUEsdUJBTUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtXQUNKLGFBREk7RUFBQSxDQU5OLENBQUE7O0FBQUEsdUJBU0EsSUFBQSxHQUFNLFNBQUMsT0FBRCxFQUFVLEVBQVYsR0FBQTtBQUNKLFFBQUEsSUFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWCxDQUFQLENBQUE7V0FDQSxJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBc0IsSUFBSSxDQUFDLE1BQTNCLEVBQW1DLElBQUksQ0FBQyxVQUF4QyxFQUFvRCxJQUFJLENBQUMsUUFBekQsRUFBbUUsU0FBQyxHQUFELEdBQUE7QUFDakUsTUFBQSxJQUEwQyxHQUExQztBQUFBLGVBQU8sRUFBQSxDQUFHLFdBQUEsQ0FBWSxHQUFaLEVBQWlCLFVBQWpCLENBQUgsQ0FBUCxDQUFBO09BQUE7YUFDQSxFQUFBLENBQUcsSUFBSCxFQUZpRTtJQUFBLENBQW5FLEVBRkk7RUFBQSxDQVROLENBQUE7O0FBQUEsdUJBZUEsT0FBQSxHQUFTLFNBQUMsT0FBRCxFQUFVLEVBQVYsR0FBQTtXQUNQLElBQUMsQ0FBQSxXQUFXLENBQUMsU0FBYixDQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsT0FBTyxDQUFDLFFBQWxCO0FBQUEsTUFDQSxNQUFBLEVBQVEsT0FBTyxDQUFDLE1BRGhCO0FBQUEsTUFFQSxXQUFBLEVBQWEsT0FBTyxDQUFDLFdBRnJCO0FBQUEsTUFHQSxPQUFBLEVBQVMsT0FBTyxDQUFDLE9BSGpCO0FBQUEsTUFJQSxRQUFBLEVBQVUsT0FBTyxDQUFDLFFBSmxCO0FBQUEsTUFLQSxXQUFBLEVBQWEsT0FBTyxDQUFDLFdBTHJCO0tBREYsRUFPRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxHQUFELEVBQU0sUUFBTixFQUFnQixNQUFoQixFQUF3QixRQUF4QixHQUFBO0FBQ0EsUUFBQSxJQUEyQyxHQUEzQztBQUFBLGlCQUFPLEVBQUEsQ0FBRyxXQUFBLENBQVksR0FBWixFQUFpQixXQUFqQixDQUFILENBQVAsQ0FBQTtTQUFBO0FBQUEsUUFDQSxPQUFBLEdBQVUsRUFEVixDQUFBO0FBQUEsUUFFQSxPQUFBLEdBQ0U7QUFBQSxVQUFBLE1BQUEsRUFBUSxRQUFSO0FBQUEsVUFDQSxVQUFBLEVBQVksTUFEWjtBQUFBLFVBRUEsUUFBQSxFQUFVLFFBRlY7U0FIRixDQUFBO2VBTUEseUNBQU0sT0FBTixFQUFlLEVBQWYsRUFQQTtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUEYsRUFETztFQUFBLENBZlQsQ0FBQTs7QUFBQSx1QkFnQ0EsS0FBQSxHQUFPLFNBQUMsR0FBRCxFQUFNLElBQU4sRUFBWSxFQUFaLEdBQUE7V0FDTCxFQUFBLENBQUcsR0FBSCxFQURLO0VBQUEsQ0FoQ1AsQ0FBQTs7b0JBQUE7O0dBRnVCLE9BUHpCLENBQUE7O0FBQUE7QUErQ2UsRUFBQSxxQkFBQSxHQUFBO0FBQ1gsVUFBQSxDQURXO0VBQUEsQ0FBYjs7QUFBQSx3QkFHQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBVSxJQUFBLEtBQUEsQ0FBTSxxREFBTixDQUFWLENBRFE7RUFBQSxDQUhWLENBQUE7O0FBQUEsd0JBTUEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQVUsSUFBQSxLQUFBLENBQU0sc0RBQU4sQ0FBVixDQURTO0VBQUEsQ0FOWCxDQUFBOztxQkFBQTs7SUEvQ0YsQ0FBQTs7QUF5REE7QUFBQSxLQXpEQTs7QUFBQSxPQTJETyxDQUFDLFdBQVIsR0FBc0IsV0EzRHRCLENBQUE7O0FBQUEsT0E0RE8sQ0FBQyxVQUFSLEdBQXFCLFVBNURyQixDQUFBOztBQUFBLE9BNkRPLENBQUMsZUFBUixHQUEwQixlQTdEMUIsQ0FBQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIldvcmtlciA9IHJlcXVpcmUoJ3JlZGlzLXdvcmtlcicpLldvcmtlclxuZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKVxuXG5jcmVhdGVFcnJvciA9IGVycm9ycy5jcmVhdGVFcnJvclxuTWFpbFdvcmtlckVycm9yID0gZXJyb3JzLk1haWxXb3JrZXJFcnJvclxuXG5cbmNsYXNzIE1haWxXb3JrZXIgZXh0ZW5kcyBXb3JrZXJcblxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG4gICAge0B1cmwsIEB0YXNrTGltaXQsIEByZXRyeVRhc2tzLCBAbWFpbEFkYXB0ZXIsIEBtYWlsQnVpbGRlcn0gPSBvcHRpb25zXG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCB1c2UgTWFpbFdvcmtlciB3aXRoIE1haWxBZGFwdGVyJykgdW5sZXNzIEBtYWlsQWRhcHRlclxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgdXNlIE1haWxXb3JrZXIgd2l0aCBNYWlsQnVpbGRlcicpIHVubGVzcyBAbWFpbEJ1aWxkZXJcbiAgICBzdXBlciB1cmw6IEB1cmwsIHRhc2tMaW1pdDogQHRhc2tMaW1pdCwgcmV0cnlUYXNrczogQHJldHJ5VGFza3NcblxuICBuYW1lOiAoKSAtPlxuICAgICdNYWlsV29ya2VyJ1xuXG4gIHdvcms6IChwYXlsb2FkLCBjYikgLT5cbiAgICBtYWlsID0gSlNPTi5wYXJzZShwYXlsb2FkKVxuICAgIEBtYWlsQWRhcHRlci5zZW5kTWFpbCBtYWlsLnNlbmRlciwgbWFpbC5yZWNpcGllbnRzLCBtYWlsLm1pbWVCb2R5LCAoZXJyKSAtPlxuICAgICAgcmV0dXJuIGNiIGNyZWF0ZUVycm9yKGVyciwgJ1NFTkRNQUlMJykgaWYgZXJyXG4gICAgICBjYiBudWxsXG5cbiAgcHVzaEpvYjogKGpvYkRpY3QsIGNiKSAtPlxuICAgIEBtYWlsQnVpbGRlci5idWlsZE1haWxcbiAgICAgIG1haWxGcm9tOiBqb2JEaWN0Lm1haWxGcm9tXG4gICAgICBtYWlsVG86IGpvYkRpY3QubWFpbFRvXG4gICAgICBtYWlsU3ViamVjdDogam9iRGljdC5tYWlsU3ViamVjdFxuICAgICAgbWFpbFRwbDogam9iRGljdC5tYWlsVHBsXG4gICAgICBtYWlsRGF0YTogam9iRGljdC5tYWlsRGF0YVxuICAgICAgbWFpbEhlYWRlcnM6IGpvYkRpY3QubWFpbEhlYWRlcnNcbiAgICAsIChlcnIsIG1haWxGcm9tLCBtYWlsVG8sIG1pbWVCb2R5KSA9PlxuICAgICAgcmV0dXJuIGNiIGNyZWF0ZUVycm9yKGVyciwgJ0JVSUxETUFJTCcpIGlmIGVyclxuICAgICAgam9iRGljdCA9IHt9XG4gICAgICBqb2JEaWN0ID1cbiAgICAgICAgc2VuZGVyOiBtYWlsRnJvbVxuICAgICAgICByZWNpcGllbnRzOiBtYWlsVG9cbiAgICAgICAgbWltZUJvZHk6IG1pbWVCb2R5XG4gICAgICBzdXBlcihqb2JEaWN0LCBjYilcblxuICBlcnJvcjogKGVyciwgdGFzaywgY2IpIC0+XG4gICAgY2IoZXJyKVxuXG5cbmNsYXNzIE1haWxBZGFwdGVyXG5cbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgcmV0dXJuXG5cbiAgc2VuZE1haWw6ICgpIC0+XG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBvdmVyd3JpdGUgc2VuZE1haWwjTWFpbEFkYXB0ZXIgaW4gc3ViY2xhc3MnKVxuXG4gIGJ1aWxkTWFpbDogKCkgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IG92ZXJ3cml0ZSBidWlsZE1haWwjTWFpbEFkYXB0ZXIgaW4gc3ViY2xhc3MnKVxuXG5cbiMjIyAjIyNcbiMgRVhQT1JUU1xuZXhwb3J0cy5NYWlsQWRhcHRlciA9IE1haWxBZGFwdGVyXG5leHBvcnRzLk1haWxXb3JrZXIgPSBNYWlsV29ya2VyXG5leHBvcnRzLk1haWxXb3JrZXJFcnJvciA9IE1haWxXb3JrZXJFcnJvclxuIl19