EditorController = ["$scope", "$rootScope", "github", "changedFileQueue", "editor", function($scope, $rootScope, github, changedFileQueue, editor) {
  var context         = this;
  $scope.editor       = ace.edit("editor");
  $scope.$element     = $('#editor');
  $scope.loading      = false;

  this.markdown = function() {
    return $scope.editor.getSession().getValue();
  }

  $scope.$element.click(function() {
    $scope.$emit('hideMenu');
  });

  $scope.editor.setTheme("ace/theme/tomorrow_night_bright");
  $scope.editor.setReadOnly(true);
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
    if(!$scope.loading)
      $scope.$emit('saveLocalFile');
    if(typeof $scope.previewUpdateTimer !== 'undefined')
      clearTimeout($scope.previewUpdateTimer);

    $scope.previewUpdateTimer = setTimeout(function() {
      $scope.$emit('markdownUpdated', $scope.editor.getValue());
    }, env.previewUpdateCoolDownTime);

  });

  $rootScope.$on('showLoading', function() {
    $scope.loading = true;
  });

  $rootScope.$on('hideLoading', function() {
    $scope.loading = false;
  });

  $rootScope.$on('saveLocalFile', function(e) {
    if(typeof $scope.timer !== 'undefined') { clearTimeout($scope.timer); }

    $scope.timer = setTimeout(function() {
      editor.localSave(editor.currentPath(), context.markdown());
      changedFileQueue.fileChanged(editor.currentPath());
      $rootScope.$emit('savedLocal');
    }, env.localStorageCoolDownTime);
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
    $scope.editor.setReadOnly(false);
  });

  $rootScope.$on('fileSelected', function(e, selectedFile) {
    $scope.$emit('showLoading');
    github.getFile(selectedFile.path).then(function(response) {
      response.path = selectedFile.path;
      $scope.$emit('loadFile', response);
      $scope.$emit('hideLoading');
    });
  });

  $rootScope.$on('saveFile', function(e) {
    $scope.$emit('showLoading');
    github.saveFile(editor.currentPath(), context.markdown()).then(function() {
      editor.localDelete(editor.currentPath());
      $scope.$emit('clearedLocal');
      $scope.$emit('notify', "Saved " + editor.currentPath());
      $scope.$emit('saved', editor.currentPath());
      $scope.$emit('hideLoading');
    });
  });

  $rootScope.$on('previewLoaded', function(e) {
    $scope.$emit('markdownUpdated', $scope.editor.getValue());
  });

  $scope.$emit('editorLoaded', context.markdown());
}];
