Kammic.directive('buildstatus', function() {
  return {
    scope: {
      id: '=',
    },
    restrict: 'E',
    template: function() {
      return this.id;
    }
  }
});

