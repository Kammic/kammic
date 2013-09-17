EditorController = function($scope, $rootScope, github) {
  var context    = this;
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

  $scope.editor.commands.addCommand({
    name: 'saveFile',
    bindKey: {
      win: 'Ctrl-S',
      mac: 'Command-S',
      sender: 'editor|cli',
      passEvent: true,
    },
    exec: function(){ $scope.$emit('saveFile'); }
  });

  key('command+s, ctrl+s', function(){
    $scope.$emit('saveFile');
    return false;
  });

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
      response.path = selectedFile.path;
      $scope.$emit('loadFile', response);
    });
  });

  $rootScope.$on('saveFile', function(e) {
    github.saveFile($scope.file.path, context.markdown());
  });

  $rootScope.$on('previewLoaded', function(e) {
    $scope.$emit('markdownUpdated', $scope.editor.getValue());
  });

  $scope.$emit('editorLoaded', context.markdown());
};
