Application.service('editorState', function() {
  var editorState = {}
  var currentFile = null;

  editorState.currentFile = function(path) {
    if(typeof path === 'undefined')
      return currentFile;
    currentFile = path;  
  }

  editorState.currentPath = function() {
    if(typeof currentFile === 'undefined' || currentFile == null)
      return null;
    return editorState.currentFile().path;
  }

  return editorState;
});
