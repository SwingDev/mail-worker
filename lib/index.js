var MailAdapter, MailWorker, Worker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Worker = require('redisworker');

MailWorker = (function(_super) {
  __extends(MailWorker, _super);

  function MailWorker(options) {
    this.url = options.url, this.mailAdapter = options.mailAdapter;
    if (!this.mailAdapter) {
      throw new Error('You must use MailWorker with mailAdapter');
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

  return MailAdapter;

})();

exports.MailAdapter = MailAdapter;

exports.MailWorker = MailWorker;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLCtCQUFBO0VBQUE7aVNBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxhQUFSLENBQVQsQ0FBQTs7QUFBQTtBQUtFLCtCQUFBLENBQUE7O0FBQWEsRUFBQSxvQkFBQyxPQUFELEdBQUE7QUFDWCxJQUFDLElBQUMsQ0FBQSxjQUFBLEdBQUYsRUFBTyxJQUFDLENBQUEsc0JBQUEsV0FBUixDQUFBO0FBQ0EsSUFBQSxJQUFBLENBQUEsSUFBb0UsQ0FBQSxXQUFwRTtBQUFBLFlBQVUsSUFBQSxLQUFBLENBQU0sMENBQU4sQ0FBVixDQUFBO0tBRlc7RUFBQSxDQUFiOztBQUFBLHVCQUlBLElBQUEsR0FBTSxTQUFBLEdBQUE7V0FDSixhQURJO0VBQUEsQ0FKTixDQUFBOztBQUFBLHVCQU9BLElBQUEsR0FBTSxTQUFDLE9BQUQsRUFBVSxFQUFWLEdBQUE7QUFDSixRQUFBLElBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLE9BQVgsQ0FBUCxDQUFBO1dBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQXNCLElBQUksQ0FBQyxNQUEzQixFQUFtQyxJQUFJLENBQUMsVUFBeEMsRUFBb0QsSUFBSSxDQUFDLFFBQXpELEVBQW1FLFNBQUMsR0FBRCxHQUFBO2FBQ2pFLEVBQUEsQ0FBRyxHQUFILEVBRGlFO0lBQUEsQ0FBbkUsRUFGSTtFQUFBLENBUE4sQ0FBQTs7QUFBQSx1QkFZQSxLQUFBLEdBQU8sU0FBQyxHQUFELEVBQU0sRUFBTixHQUFBO0FBQ0wsSUFBQSxJQUE4QixHQUE5QjtBQUFBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLEdBQXZCLENBQUEsQ0FBQTtLQUFBO0FBQUEsSUFDQSxFQUFBLENBQUEsQ0FEQSxDQURLO0VBQUEsQ0FaUCxDQUFBOztvQkFBQTs7R0FGdUIsT0FIekIsQ0FBQTs7QUFBQTtBQXlCZSxFQUFBLHFCQUFBLEdBQUE7QUFDWCxVQUFBLENBRFc7RUFBQSxDQUFiOztBQUFBLHdCQUdBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFVLElBQUEsS0FBQSxDQUFNLHFEQUFOLENBQVYsQ0FEUTtFQUFBLENBSFYsQ0FBQTs7cUJBQUE7O0lBekJGLENBQUE7O0FBQUEsT0FnQ08sQ0FBQyxXQUFSLEdBQXNCLFdBaEN0QixDQUFBOztBQUFBLE9BaUNPLENBQUMsVUFBUixHQUFxQixVQWpDckIsQ0FBQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIldvcmtlciA9IHJlcXVpcmUoJ3JlZGlzd29ya2VyJylcblxuXG5jbGFzcyBNYWlsV29ya2VyIGV4dGVuZHMgV29ya2VyXG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgIHtAdXJsLCBAbWFpbEFkYXB0ZXJ9ID0gb3B0aW9uc1xuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgdXNlIE1haWxXb3JrZXIgd2l0aCBtYWlsQWRhcHRlcicpIHVubGVzcyBAbWFpbEFkYXB0ZXJcblxuICBuYW1lOiAoKSAtPlxuICAgICdNYWlsV29ya2VyJ1xuXG4gIHdvcms6IChwYXlsb2FkLCBjYikgLT5cbiAgICBtYWlsID0gSlNPTi5wYXJzZShwYXlsb2FkKVxuICAgIEBtYWlsQWRhcHRlci5zZW5kTWFpbCBtYWlsLnNlbmRlciwgbWFpbC5yZWNpcGllbnRzLCBtYWlsLm1pbWVCb2R5LCAoZXJyKSAtPlxuICAgICAgY2IoZXJyKVxuXG4gIGVycm9yOiAoZXJyLCBjYikgLT5cbiAgICBjb25zb2xlLmxvZyAnW0Vycm9yXScsIGVyciBpZiBlcnJcbiAgICBjYigpXG4gICAgcmV0dXJuXG5cblxuY2xhc3MgTWFpbEFkYXB0ZXJcbiAgXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIHJldHVyblxuXG4gIHNlbmRNYWlsOiAoKSAtPlxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3Qgb3ZlcndyaXRlIHNlbmRNYWlsI01haWxBZGFwdGVyIGluIHN1YmNsYXNzJylcblxuXG5leHBvcnRzLk1haWxBZGFwdGVyID0gTWFpbEFkYXB0ZXJcbmV4cG9ydHMuTWFpbFdvcmtlciA9IE1haWxXb3JrZXJcbiJdfQ==