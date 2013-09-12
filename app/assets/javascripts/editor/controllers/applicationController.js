ApplicationController = function($scope, $rootScope) {
  var context = this;

  this.updatePreview = function(value) {
    $scope.value = this.mdToHTML(value);
  }

  this.mdToHTML = function(md) {
    var mdConverter = new Showdown.converter();
    return mdConverter.makeHtml(md);    
  }

  $scope.$on('previewLoaded', function(e) {
    $(window).resize();
  });

  $scope.$on('editorLoaded', function(e, value) {
    $(window).resize();
    context.updatePreview(value);
  });

  $scope.$on('markdownUpdated', function(e, value) {  
    $scope.$apply(function(){
      context.updatePreview(value);  
    });
  });

  KeyboardJS.on('ctrl + s', function() {
    $scope.$emit('saveFile');
  });


  $(window).resize(function() {
    var width  = $(document).width()/2.05;
    var height = $(document).height();
    $scope.$emit('windowResized', width, height);
  });
};
