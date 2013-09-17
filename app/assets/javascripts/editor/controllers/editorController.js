EditorController = function($scope, $rootScope, github) {
  $scope.editor  = ace.edit("editor");
  $scope.$element = $('#editor');

  this.markdown = function() {
    return $scope.editor.getSession().getValue();
  }

  $scope.$element.click(function() {
    $scope.$emit('hideBrowser');
  });

  $scope.editor.setTheme("ace/theme/tomorrow_night");
  $scope.editor.getSession().setUseWrapMode(true);
  $scope.editor.getSession().setMode("ace/mode/markdown");
  $scope.editor.on('change', function(e) {
    $scope.$emit('markdownUpdated', $scope.editor.getValue());
  });

  $rootScope.$on('windowResized', function(e, width, height) {
    $scope.$element.width(width/2.05);
  });

  $rootScope.$on('loadFile', function(e, file) {
    $scope.file = file;
    $scope.editor.getSession().setValue(file.content);
  });
  
  $rootScope.$on('fileSelected', function(e, selectedFile) {
    github.getFile(selectedFile.path).then(function(response) {
      $scope.$emit('loadFile', response);
    });
  });

  $rootScope.$on('saveFile', function(e) {
    console.debug('here');
    // var contents = $scope.editor.getSession().getValue();
    // $rootScope.branch.write(
    //   $scope.file.path, contents, "Updated " + $scope.file.path)
    //   .done(function() {
    //     console.debug("Done saving!");
    //   });
  });

  $rootScope.$on('previewLoaded', function(e) {
    $scope.$emit('markdownUpdated', $scope.editor.getValue());
  });

  $scope.$emit('editorLoaded', this.markdown());
};
