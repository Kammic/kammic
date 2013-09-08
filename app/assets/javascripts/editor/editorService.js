Application.service('editorService', function($q, $rootScope) {
  this.setup = function($e, $scope) {
    var editor  = ace.edit("editor");
    var shouldUpdatePreview = true;

    $element = $e;
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setMode("ace/mode/markdown");
    editor.on('change', function(e){
      $scope.$emit('markdownUpdated', editor.getValue());
    });
  };

});
