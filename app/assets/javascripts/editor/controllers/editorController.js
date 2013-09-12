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
    $scope.file = file;
    $scope.editor.getSession().setValue(file.content);
  });

  $rootScope.$on('saveFile', function(e) {
    var contents = $scope.editor.getSession().getValue();
    $rootScope.branch.write($scope.file.path, contents, "Updated " + $scope.file.path).done(function() {
      console.debug("Done saving!");
    });
  });

  $scope.$emit('editorLoaded', this.markdown());
};
