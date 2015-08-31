var ErrorHandler, MailWorkerError, WorkerError, createError, errCodes,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ErrorHandler = require('error-handler');

WorkerError = require('redis-worker').WorkerError;

errCodes = ['SENDMAIL', 'BUILDMAIL'];

createError = function(err, errCode) {
  if (!err) {
    return null;
  }
  if (errCode) {
    switch (errCode) {
      case 'SENDMAIL':
        return new MailWorkerError('Sending mail was unsuccessful', err);
      case 'BUILDMAIL':
        return new MailWorkerError('Building mail was unsuccessful', err);
      default:
        return new MailWorkerError(errCode, err);
    }
  } else {
    return new MailWorkerError(null, err);
  }
};

MailWorkerError = (function(superClass) {
  extend(MailWorkerError, superClass);

  function MailWorkerError() {
    return MailWorkerError.__super__.constructor.apply(this, arguments);
  }

  MailWorkerError.prototype.name = 'MailWorkerError';

  return MailWorkerError;

})(WorkerError);


/* */

exports.MailWorkerError = MailWorkerError;

exports.createError = createError;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9ycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxpRUFBQTtFQUFBOzs7QUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGVBQVI7O0FBQ2YsV0FBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSLENBQXVCLENBQUM7O0FBRXRDLFFBQUEsR0FBVyxDQUFDLFVBQUQsRUFBYSxXQUFiOztBQUVYLFdBQUEsR0FBYyxTQUFDLEdBQUQsRUFBTSxPQUFOO0VBQ1osSUFBQSxDQUFtQixHQUFuQjtBQUFBLFdBQU8sS0FBUDs7RUFFQSxJQUFHLE9BQUg7QUFDRSxZQUFPLE9BQVA7QUFBQSxXQUNPLFVBRFA7QUFFSSxlQUFXLElBQUEsZUFBQSxDQUFnQiwrQkFBaEIsRUFBaUQsR0FBakQ7QUFGZixXQUdPLFdBSFA7QUFJSSxlQUFXLElBQUEsZUFBQSxDQUFnQixnQ0FBaEIsRUFBa0QsR0FBbEQ7QUFKZjtBQU1JLGVBQVcsSUFBQSxlQUFBLENBQWdCLE9BQWhCLEVBQXlCLEdBQXpCO0FBTmYsS0FERjtHQUFBLE1BQUE7QUFTRSxXQUFXLElBQUEsZUFBQSxDQUFnQixJQUFoQixFQUFzQixHQUF0QixFQVRiOztBQUhZOztBQWVSOzs7Ozs7OzRCQUVKLElBQUEsR0FBTTs7OztHQUZzQjs7O0FBSzlCOztBQUVBLE9BQU8sQ0FBQyxlQUFSLEdBQTBCOztBQUMxQixPQUFPLENBQUMsV0FBUixHQUFzQiIsImZpbGUiOiJlcnJvcnMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJFcnJvckhhbmRsZXIgPSByZXF1aXJlKCdlcnJvci1oYW5kbGVyJylcbldvcmtlckVycm9yID0gcmVxdWlyZSgncmVkaXMtd29ya2VyJykuV29ya2VyRXJyb3JcblxuZXJyQ29kZXMgPSBbJ1NFTkRNQUlMJywgJ0JVSUxETUFJTCddXG5cbmNyZWF0ZUVycm9yID0gKGVyciwgZXJyQ29kZSkgLT5cbiAgcmV0dXJuIG51bGwgdW5sZXNzIGVyclxuXG4gIGlmIGVyckNvZGVcbiAgICBzd2l0Y2ggZXJyQ29kZVxuICAgICAgd2hlbiAnU0VORE1BSUwnXG4gICAgICAgIHJldHVybiBuZXcgTWFpbFdvcmtlckVycm9yKCdTZW5kaW5nIG1haWwgd2FzIHVuc3VjY2Vzc2Z1bCcsIGVycilcbiAgICAgIHdoZW4gJ0JVSUxETUFJTCdcbiAgICAgICAgcmV0dXJuIG5ldyBNYWlsV29ya2VyRXJyb3IoJ0J1aWxkaW5nIG1haWwgd2FzIHVuc3VjY2Vzc2Z1bCcsIGVycilcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIG5ldyBNYWlsV29ya2VyRXJyb3IoZXJyQ29kZSwgZXJyKVxuICBlbHNlXG4gICAgcmV0dXJuIG5ldyBNYWlsV29ya2VyRXJyb3IobnVsbCwgZXJyKVxuXG5cbmNsYXNzIE1haWxXb3JrZXJFcnJvciBleHRlbmRzIFdvcmtlckVycm9yXG5cbiAgbmFtZTogJ01haWxXb3JrZXJFcnJvcidcblxuXG4jIyMgIyMjXG4jIEVYUE9SVFNcbmV4cG9ydHMuTWFpbFdvcmtlckVycm9yID0gTWFpbFdvcmtlckVycm9yXG5leHBvcnRzLmNyZWF0ZUVycm9yID0gY3JlYXRlRXJyb3JcbiJdfQ==