EditorController = function($scope, $rootScope) {
  var editor  = ace.edit("editor");
  var $element = $('#editor');

  editor.setTheme("ace/theme/twilight");
  editor.getSession().setUseWrapMode(true);
  editor.getSession().setMode("ace/mode/markdown");
  editor.on('change', function(e) {
    $scope.$emit('markdownUpdated', editor.getValue());
  });

  $rootScope.$on("windowResized", function(e, width, height){
    $element.width(width);
  });

  $scope.$emit('editorLoaded', editor.getSession().getValue());
}
