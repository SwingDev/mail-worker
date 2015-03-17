var ErrorHandler, MailWorkerError, WorkerError, createError, errCodes,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ErrorHandler = require.main.require('error-handler');

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
        return new MailWorkerError(null, err);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9ycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxpRUFBQTtFQUFBO2lTQUFBOztBQUFBLFlBQUEsR0FBZSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQWIsQ0FBcUIsZUFBckIsQ0FBZixDQUFBOztBQUFBLFdBQ0EsR0FBYyxPQUFBLENBQVEsY0FBUixDQUF1QixDQUFDLFdBRHRDLENBQUE7O0FBQUEsUUFHQSxHQUFXLENBQUMsVUFBRCxFQUFhLFdBQWIsQ0FIWCxDQUFBOztBQUFBLFdBS0EsR0FBYyxTQUFDLEdBQUQsRUFBTSxPQUFOLEdBQUE7QUFDWixFQUFBLElBQUEsQ0FBQSxHQUFBO0FBQUEsV0FBTyxJQUFQLENBQUE7R0FBQTtBQUVBLEVBQUEsSUFBRyxPQUFIO0FBQ0UsWUFBTyxPQUFQO0FBQUEsV0FDTyxVQURQO0FBRUksZUFBVyxJQUFBLGVBQUEsQ0FBZ0IsK0JBQWhCLEVBQWlELEdBQWpELENBQVgsQ0FGSjtBQUFBLFdBR08sV0FIUDtBQUlJLGVBQVcsSUFBQSxlQUFBLENBQWdCLGdDQUFoQixFQUFrRCxHQUFsRCxDQUFYLENBSko7QUFBQTtBQU1JLGVBQVcsSUFBQSxlQUFBLENBQWdCLElBQWhCLEVBQXNCLEdBQXRCLENBQVgsQ0FOSjtBQUFBLEtBREY7R0FBQSxNQUFBO0FBU0UsV0FBVyxJQUFBLGVBQUEsQ0FBZ0IsSUFBaEIsRUFBc0IsR0FBdEIsQ0FBWCxDQVRGO0dBSFk7QUFBQSxDQUxkLENBQUE7O0FBQUE7QUFzQkUsb0NBQUEsQ0FBQTs7OztHQUFBOztBQUFBLDRCQUFBLElBQUEsR0FBTSxpQkFBTixDQUFBOzt5QkFBQTs7R0FGNEIsWUFwQjlCLENBQUE7O0FBeUJBO0FBQUEsS0F6QkE7O0FBQUEsT0EyQk8sQ0FBQyxlQUFSLEdBQTBCLGVBM0IxQixDQUFBOztBQUFBLE9BNEJPLENBQUMsV0FBUixHQUFzQixXQTVCdEIsQ0FBQSIsImZpbGUiOiJlcnJvcnMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJFcnJvckhhbmRsZXIgPSByZXF1aXJlLm1haW4ucmVxdWlyZSgnZXJyb3ItaGFuZGxlcicpXG5Xb3JrZXJFcnJvciA9IHJlcXVpcmUoJ3JlZGlzLXdvcmtlcicpLldvcmtlckVycm9yXG5cbmVyckNvZGVzID0gWydTRU5ETUFJTCcsICdCVUlMRE1BSUwnXVxuXG5jcmVhdGVFcnJvciA9IChlcnIsIGVyckNvZGUpIC0+XG4gIHJldHVybiBudWxsIHVubGVzcyBlcnJcblxuICBpZiBlcnJDb2RlXG4gICAgc3dpdGNoIGVyckNvZGVcbiAgICAgIHdoZW4gJ1NFTkRNQUlMJ1xuICAgICAgICByZXR1cm4gbmV3IE1haWxXb3JrZXJFcnJvcignU2VuZGluZyBtYWlsIHdhcyB1bnN1Y2Nlc3NmdWwnLCBlcnIpXG4gICAgICB3aGVuICdCVUlMRE1BSUwnXG4gICAgICAgIHJldHVybiBuZXcgTWFpbFdvcmtlckVycm9yKCdCdWlsZGluZyBtYWlsIHdhcyB1bnN1Y2Nlc3NmdWwnLCBlcnIpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBuZXcgTWFpbFdvcmtlckVycm9yKG51bGwsIGVycilcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgTWFpbFdvcmtlckVycm9yKG51bGwsIGVycilcblxuXG5jbGFzcyBNYWlsV29ya2VyRXJyb3IgZXh0ZW5kcyBXb3JrZXJFcnJvclxuXG4gIG5hbWU6ICdNYWlsV29ya2VyRXJyb3InXG5cblxuIyMjICMjI1xuIyBFWFBPUlRTXG5leHBvcnRzLk1haWxXb3JrZXJFcnJvciA9IE1haWxXb3JrZXJFcnJvclxuZXhwb3J0cy5jcmVhdGVFcnJvciA9IGNyZWF0ZUVycm9yXG4iXX0=