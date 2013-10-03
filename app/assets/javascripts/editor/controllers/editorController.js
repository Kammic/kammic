EditorController = function($scope, $rootScope, github, changedFileQueue, editor)
{
  var context         = this;
  $scope.editor       = ace.edit("editor");
  $scope.$element     = $('#editor');

  this.markdown = function() {
    return $scope.editor.getSession().getValue();
  }

  $scope.$element.click(function() {
    $scope.$emit('hideMenu');
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
    $scope.$emit('saveLocalFile');
    $scope.$emit('markdownUpdated', $scope.editor.getValue());
  });

  $rootScope.$on('saveLocalFile', function(e){
    if(typeof $scope.timer !== 'undefined')
      clearTimeout($scope.timer);

    $scope.timer = setTimeout(function() {
      editor.localSave(editor.currentPath(), context.markdown());
      changedFileQueue.fileChanged(editor.currentPath());
      $rootScope.$emit('savedLocal');
    }, env.localStorageCoolDownTime);
  });

  $rootScope.$on('windowResized', function(e, width, height) {
    $scope.$element.width(width/2.05);
  });

  $rootScope.$on('loadFile', function(e, file) {
    editor.currentFile(file);
    var content = "";
    if(editor.localRead(file.path))
      content = editor.localRead(file.path);
    else
      content = file.content;
    $scope.editor.getSession().setValue(content);

    var format = editor.format(file.path);
    if(typeof format == 'undefined')
      format = 'markdown';
    $scope.editor.getSession().setMode("ace/mode/" + format);
  });
  
  $rootScope.$on('fileSelected', function(e, selectedFile) {
    github.getFile(selectedFile.path).then(function(response) {
      response.path = selectedFile.path;
      $scope.$emit('loadFile', response);
    });
  });

  $rootScope.$on('saveFile', function(e) {
    github.saveFile(editor.currentPath(), context.markdown()).then(function() {
      editor.localDelete(editor.currentPath());
      $rootScope.$emit('clearedLocal');
      $rootScope.$emit('notify', "Saved " + editor.currentPath());
      $rootScope.$emit('saved', editor.currentPath());
    });
  });

  $rootScope.$on('previewLoaded', function(e) {
    $scope.$emit('markdownUpdated', $scope.editor.getValue());
  });

  $scope.$emit('editorLoaded', context.markdown());
};
