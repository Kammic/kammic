EditorController = function($scope, $rootScope) {
  $scope.editor  = ace.edit("editor");
  $scope.$element = $('#editor');

  $scope.editor.setTheme("ace/theme/tomorrow_night");
  $scope.editor.getSession().setUseWrapMode(true);
  $scope.editor.getSession().setMode("ace/mode/markdown");
  $scope.editor.on('change', function(e) {
    $scope.$emit('markdownUpdated', $scope.editor.getValue());
  });

  $rootScope.$on("windowResized", function(e, width, height){
    $scope.$element.width(width);
  });

  $scope.$emit('editorLoaded', $scope.editor.getSession().getValue());
};
