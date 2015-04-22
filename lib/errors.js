var ErrorHandler, MailWorkerError, WorkerError, createError, errCodes,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ErrorHandler = require('error-handler');

WorkerError = require('redis-worker').WorkerError;

errCodes = ['SENDMAIL', 'BUILDMAIL'];

createError = function(err, errCode) {
  if (!(err || errCode)) {
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

MailWorkerError = (function(_super) {
  __extends(MailWorkerError, _super);

  function MailWorkerError() {
    return MailWorkerError.__super__.constructor.apply(this, arguments);
  }

  MailWorkerError.prototype.name = 'MailWorkerError';

  return MailWorkerError;

})(WorkerError);


/* */

exports.MailWorkerError = MailWorkerError;

exports.createError = createError;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9ycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxpRUFBQTtFQUFBO2lTQUFBOztBQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUixDQUFmLENBQUE7O0FBQUEsV0FDQSxHQUFjLE9BQUEsQ0FBUSxjQUFSLENBQXVCLENBQUMsV0FEdEMsQ0FBQTs7QUFBQSxRQUdBLEdBQVcsQ0FBQyxVQUFELEVBQWEsV0FBYixDQUhYLENBQUE7O0FBQUEsV0FLQSxHQUFjLFNBQUMsR0FBRCxFQUFNLE9BQU4sR0FBQTtBQUNaLEVBQUEsSUFBQSxDQUFBLENBQW1CLEdBQUEsSUFBTyxPQUExQixDQUFBO0FBQUEsV0FBTyxJQUFQLENBQUE7R0FBQTtBQUVBLEVBQUEsSUFBRyxPQUFIO0FBQ0UsWUFBTyxPQUFQO0FBQUEsV0FDTyxVQURQO0FBRUksZUFBVyxJQUFBLGVBQUEsQ0FBZ0IsK0JBQWhCLEVBQWlELEdBQWpELENBQVgsQ0FGSjtBQUFBLFdBR08sV0FIUDtBQUlJLGVBQVcsSUFBQSxlQUFBLENBQWdCLGdDQUFoQixFQUFrRCxHQUFsRCxDQUFYLENBSko7QUFBQTtBQU1JLGVBQVcsSUFBQSxlQUFBLENBQWdCLE9BQWhCLEVBQXlCLEdBQXpCLENBQVgsQ0FOSjtBQUFBLEtBREY7R0FBQSxNQUFBO0FBU0UsV0FBVyxJQUFBLGVBQUEsQ0FBZ0IsSUFBaEIsRUFBc0IsR0FBdEIsQ0FBWCxDQVRGO0dBSFk7QUFBQSxDQUxkLENBQUE7O0FBQUE7QUFzQkUsb0NBQUEsQ0FBQTs7OztHQUFBOztBQUFBLDRCQUFBLElBQUEsR0FBTSxpQkFBTixDQUFBOzt5QkFBQTs7R0FGNEIsWUFwQjlCLENBQUE7O0FBeUJBO0FBQUEsS0F6QkE7O0FBQUEsT0EyQk8sQ0FBQyxlQUFSLEdBQTBCLGVBM0IxQixDQUFBOztBQUFBLE9BNEJPLENBQUMsV0FBUixHQUFzQixXQTVCdEIsQ0FBQSIsImZpbGUiOiJlcnJvcnMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJFcnJvckhhbmRsZXIgPSByZXF1aXJlKCdlcnJvci1oYW5kbGVyJylcbldvcmtlckVycm9yID0gcmVxdWlyZSgncmVkaXMtd29ya2VyJykuV29ya2VyRXJyb3JcblxuZXJyQ29kZXMgPSBbJ1NFTkRNQUlMJywgJ0JVSUxETUFJTCddXG5cbmNyZWF0ZUVycm9yID0gKGVyciwgZXJyQ29kZSkgLT5cbiAgcmV0dXJuIG51bGwgdW5sZXNzIGVyciBvciBlcnJDb2RlXG5cbiAgaWYgZXJyQ29kZVxuICAgIHN3aXRjaCBlcnJDb2RlXG4gICAgICB3aGVuICdTRU5ETUFJTCdcbiAgICAgICAgcmV0dXJuIG5ldyBNYWlsV29ya2VyRXJyb3IoJ1NlbmRpbmcgbWFpbCB3YXMgdW5zdWNjZXNzZnVsJywgZXJyKVxuICAgICAgd2hlbiAnQlVJTERNQUlMJ1xuICAgICAgICByZXR1cm4gbmV3IE1haWxXb3JrZXJFcnJvcignQnVpbGRpbmcgbWFpbCB3YXMgdW5zdWNjZXNzZnVsJywgZXJyKVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gbmV3IE1haWxXb3JrZXJFcnJvcihlcnJDb2RlLCBlcnIpXG4gIGVsc2VcbiAgICByZXR1cm4gbmV3IE1haWxXb3JrZXJFcnJvcihudWxsLCBlcnIpXG5cblxuY2xhc3MgTWFpbFdvcmtlckVycm9yIGV4dGVuZHMgV29ya2VyRXJyb3JcblxuICBuYW1lOiAnTWFpbFdvcmtlckVycm9yJ1xuXG5cbiMjIyAjIyNcbiMgRVhQT1JUU1xuZXhwb3J0cy5NYWlsV29ya2VyRXJyb3IgPSBNYWlsV29ya2VyRXJyb3JcbmV4cG9ydHMuY3JlYXRlRXJyb3IgPSBjcmVhdGVFcnJvclxuIl19