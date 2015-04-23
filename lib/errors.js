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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9ycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxpRUFBQTtFQUFBOzZCQUFBOztBQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUixDQUFmLENBQUE7O0FBQUEsV0FDQSxHQUFjLE9BQUEsQ0FBUSxjQUFSLENBQXVCLENBQUMsV0FEdEMsQ0FBQTs7QUFBQSxRQUdBLEdBQVcsQ0FBQyxVQUFELEVBQWEsV0FBYixDQUhYLENBQUE7O0FBQUEsV0FLQSxHQUFjLFNBQUMsR0FBRCxFQUFNLE9BQU4sR0FBQTtBQUNaLEVBQUEsSUFBQSxDQUFBLEdBQUE7QUFBQSxXQUFPLElBQVAsQ0FBQTtHQUFBO0FBRUEsRUFBQSxJQUFHLE9BQUg7QUFDRSxZQUFPLE9BQVA7QUFBQSxXQUNPLFVBRFA7QUFFSSxlQUFXLElBQUEsZUFBQSxDQUFnQiwrQkFBaEIsRUFBaUQsR0FBakQsQ0FBWCxDQUZKO0FBQUEsV0FHTyxXQUhQO0FBSUksZUFBVyxJQUFBLGVBQUEsQ0FBZ0IsZ0NBQWhCLEVBQWtELEdBQWxELENBQVgsQ0FKSjtBQUFBO0FBTUksZUFBVyxJQUFBLGVBQUEsQ0FBZ0IsT0FBaEIsRUFBeUIsR0FBekIsQ0FBWCxDQU5KO0FBQUEsS0FERjtHQUFBLE1BQUE7QUFTRSxXQUFXLElBQUEsZUFBQSxDQUFnQixJQUFoQixFQUFzQixHQUF0QixDQUFYLENBVEY7R0FIWTtBQUFBLENBTGQsQ0FBQTs7QUFBQTtBQXNCRSxxQ0FBQSxDQUFBOzs7O0dBQUE7O0FBQUEsNEJBQUEsSUFBQSxHQUFNLGlCQUFOLENBQUE7O3lCQUFBOztHQUY0QixZQXBCOUIsQ0FBQTs7QUF5QkE7QUFBQSxLQXpCQTs7QUFBQSxPQTJCTyxDQUFDLGVBQVIsR0FBMEIsZUEzQjFCLENBQUE7O0FBQUEsT0E0Qk8sQ0FBQyxXQUFSLEdBQXNCLFdBNUJ0QixDQUFBIiwiZmlsZSI6ImVycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIkVycm9ySGFuZGxlciA9IHJlcXVpcmUoJ2Vycm9yLWhhbmRsZXInKVxuV29ya2VyRXJyb3IgPSByZXF1aXJlKCdyZWRpcy13b3JrZXInKS5Xb3JrZXJFcnJvclxuXG5lcnJDb2RlcyA9IFsnU0VORE1BSUwnLCAnQlVJTERNQUlMJ11cblxuY3JlYXRlRXJyb3IgPSAoZXJyLCBlcnJDb2RlKSAtPlxuICByZXR1cm4gbnVsbCB1bmxlc3MgZXJyXG5cbiAgaWYgZXJyQ29kZVxuICAgIHN3aXRjaCBlcnJDb2RlXG4gICAgICB3aGVuICdTRU5ETUFJTCdcbiAgICAgICAgcmV0dXJuIG5ldyBNYWlsV29ya2VyRXJyb3IoJ1NlbmRpbmcgbWFpbCB3YXMgdW5zdWNjZXNzZnVsJywgZXJyKVxuICAgICAgd2hlbiAnQlVJTERNQUlMJ1xuICAgICAgICByZXR1cm4gbmV3IE1haWxXb3JrZXJFcnJvcignQnVpbGRpbmcgbWFpbCB3YXMgdW5zdWNjZXNzZnVsJywgZXJyKVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gbmV3IE1haWxXb3JrZXJFcnJvcihlcnJDb2RlLCBlcnIpXG4gIGVsc2VcbiAgICByZXR1cm4gbmV3IE1haWxXb3JrZXJFcnJvcihudWxsLCBlcnIpXG5cblxuY2xhc3MgTWFpbFdvcmtlckVycm9yIGV4dGVuZHMgV29ya2VyRXJyb3JcblxuICBuYW1lOiAnTWFpbFdvcmtlckVycm9yJ1xuXG5cbiMjIyAjIyNcbiMgRVhQT1JUU1xuZXhwb3J0cy5NYWlsV29ya2VyRXJyb3IgPSBNYWlsV29ya2VyRXJyb3JcbmV4cG9ydHMuY3JlYXRlRXJyb3IgPSBjcmVhdGVFcnJvclxuIl19