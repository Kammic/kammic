EditorController = function($scope, $rootScope) {
  $scope.editor  = ace.edit("editor");
  $scope.$element = $('#editor');

  this.markdown = function() {
    return $scope.editor.getSession().getValue();
  }

  $scope.editor.setTheme("ace/theme/tomorrow_night");
  $scope.editor.getSession().setUseWrapMode(true);
  $scope.editor.getSession().setMode("ace/mode/markdown");
  $scope.editor.on('change', function(e) {
    $scope.$emit('markdownUpdated', $scope.editor.getValue());
  });

  $rootScope.$on('windowResized', function(e, width, height){
    $scope.$element.width(width);
  });

  $rootScope.$on('loadFile', function(e, file) {
    $scope.editor.getSession().setValue(file.content);
  });

  $scope.$emit('editorLoaded', this.markdown());
};
