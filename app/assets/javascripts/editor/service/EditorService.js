Application.service('editor', function(github, changedFileQueue) {
  var editor = {}
  var currentFile = null;

  editor.currentFile = function(path) {
    if(typeof path === 'undefined')
      return currentFile;
    currentFile = path;  
  }

  editor.currentPath = function() {
    if(typeof currentFile === 'undefined' || currentFile == null)
      return null;
    return editor.currentFile().path;
  }

  editor.changedFiles = function() {
    var changedFiles = changedFileQueue.changedFiles();
    return Object.keys(changedFiles);
  }

  editor.changedWithContent = function() {
    var changedFiles = editor.changedFiles();
    var changedFilesWithContent = {}
    for(var i = 0; i < changedFiles.length; i++) {
      changedFilesWithContent[changedFiles[i]] = localStorage.getItem(changedFiles[i]);
    }
    return changedFilesWithContent;
  }

  editor.resetFile = function(path) {
    changedFileQueue.resetFile(path);
  }

  editor.saveAllChangedFiles = function() {
    var files = editor.changedWithContent();
    var changedFiles = editor.changedFiles();
    for(var i = 0; i < changedFiles.length; i++) {
      editor.resetFile(changedFiles[i]);
    }
    return github.saveFiles(files, 'Updated pending files');
  }

  return editor;
});
