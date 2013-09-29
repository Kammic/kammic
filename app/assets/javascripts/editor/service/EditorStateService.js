Application.service('editorState', function(changedFileQueue) {
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

  editorState.changedFiles = function() {
    var changedFiles = changedFileQueue.changedFiles();
    return Object.keys(changedFiles);
  }

  editorState.changedWithContent = function() {
    var changedFiles = editorState.changedFiles();
    var changedFilesWithContent = {}
    for(var i = 0; i < changedFiles.length; i++) {
      changedFilesWithContent[changedFiles[i]] = localStorage.getItem(changedFiles[i]);
    }
    return changedFilesWithContent;
  }

  editorState.resetFile = function(path) {
    changedFileQueue.resetFile(path);
  }

  return editorState;
});
