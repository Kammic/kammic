Application.service('editorState', function() {
  var editorState = {}
  var currentFile = null;

  editorState.currentFile = function(path) {
    if(typeof path === 'undefined')
      return currentFile;

    currentFile = path;  
  }

  return editorState;
});
