Application.service('editor', function(github, changedFileQueue) {
  var editor = {}
  var currentFile = null;
  var storage     = localStorage;

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
      changedFilesWithContent[changedFiles[i]] = storage.getItem(changedFiles[i]);
    }
    return changedFilesWithContent;
  }

  editor.resetFile = function(path) {
    changedFileQueue.resetFile(path);
  }

  editor.resetAllFiles = function(){
    var changedFiles = editor.changedFiles();
    for(var i = 0; i < changedFiles.length; i++) {
      editor.resetFile(changedFiles[i]);
    }
  }

  editor.saveAllChangedFiles = function() {
    editor.resetAllFiles();
    return github.saveFiles(editor.changedWithContent(), 'Updated pending files');
  }

  editor.localSave = function(path, content) {
    if(typeof path === 'undefined')
      throw('path is required');
    if(typeof content === 'undefined')
      throw('content is required');
    storage.setItem(path, content);
  }

  editor.localDelete = function(path) {
    if(typeof path === 'undefined')
      throw('path is required');
    storage.removeItem(path);
  }

  editor.localRead = function(path) {
    if(typeof path === 'undefined')
      throw('path is required');
    return storage.getItem(path); 
  }
  return editor;
});
