Kammic.directive('time', function() {
  return {
    restrict: 'E',
    template: function() {
      var time = moment($(this).attr('datetime'));
      return time.fromNow();
    }
  }
});


