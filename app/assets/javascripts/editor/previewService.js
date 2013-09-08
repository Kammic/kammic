Application.service('previewService', function($q, $rootScope) {
  var $element = null;
  this.updatePreview = function(value) {
    $element.html(value);
  };

  this.setup = function($e, $scope) {
    $element = $e;
  };
});
