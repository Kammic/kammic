Kammic = angular.module("kammic", [])

$(document).on('ready page:load', function(){
  angular.bootstrap(document, ['kammic']);
});


Kammic.directive('time', function(){
  return {
    restrict: 'E',
    template: function(){
      var time = moment($(this).attr('datetime'));
      return time.fromNow();
    }
  }
});

