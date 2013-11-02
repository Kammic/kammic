Application.service('editor', ["github", "changedFileQueue", function(github, changedFileQueue) {
  var editor = {}
  var currentFile = null;
  var storage     = localStorage;
  var namespace    = '';

  /*
    Gets/Sets the current namespace
  */
  editor.namespace = function(name) {
    if(typeof name === 'undefined')
      return namespace;
    namespace = name;
    changedFileQueue.namespace(name);
  }

  /*
    Returns the current file object
    @return Object
  */
  editor.currentFile = function(file) {
    if(typeof file === 'undefined')
      return currentFile;
    editor.lastEditedFile(file.path);
    currentFile = file;
  }

  /*
    Returns the current files path
    @return String
  */
  editor.currentPath = function() {
    if(typeof currentFile === 'undefined' || currentFile == null)
      return null;
    return editor.currentFile().path;
  }

  /*
    Gets/Sets the lastEditedFile object
    @return Object
  */
  editor.lastEditedFile = function(path) {
    if(typeof path === 'undefined')
      return localStorage.getItem(namespace + '-lastEditedFile');
    localStorage.setItem(namespace + '-lastEditedFile', path);
  };

  /*
    Returns all the files changed in the queue
    @return Array[String]
  */
  editor.changedFiles = function() {
    var changedFiles = changedFileQueue.changedFiles();
    return Object.keys(changedFiles);
  }

  /*
    Returns all the files changed an their content
    @return Array[Object]
  */
  editor.changedWithContent = function() {
    var changedFiles = editor.changedFiles();
    var changedFilesWithContent = {}
    for(var i = 0; i < changedFiles.length; i++) {
      changedFilesWithContent[changedFiles[i]] = storage.getItem(changedFiles[i]);
    }
    return changedFilesWithContent;
  }

  /*
    Remove a file from the changed queue
  */
  editor.resetFile = function(path) {
    changedFileQueue.resetFile(path);
  }

  /*
    Removes all files from the changed queue
  */
  editor.resetAllFiles = function(){
    var changedFiles = editor.changedFiles();
    for(var i = 0; i < changedFiles.length; i++) {
      editor.resetFile(changedFiles[i]);
    }
  }

  /*
    Saves all files in the changed queue
    @return Promise
  */
  editor.saveAllChangedFiles = function(commitMessage) {
    var message = 'Updated pending files';
    if(typeof commitMessage !== 'undefined')
      message = commitMessage;
    return github.saveFiles(editor.changedWithContent(), message);
  }

  /*
    Save a file locally
  */
  editor.localSave = function(path, content) {
    if(typeof path === 'undefined')
      throw('path is required');
    if(typeof content === 'undefined')
      throw('content is required');
    if(path == null)
      return;
    storage.setItem(path, content);
  }

  /*
    Remove a file from localStorage
  */
  editor.localDelete = function(path) {
    if(typeof path === 'undefined')
      throw('path is required');
    storage.removeItem(path);
  }

  /*
    Read a file from localStorage
  */
  editor.localRead = function(path) {
    if(typeof path === 'undefined')
      throw('path is required');
    return storage.getItem(path); 
  }

  editor.formats = {
    'rb':  'ruby',
    'md':  'markdown',
    'yml': 'yaml'
  }

  /*
    Detect a files extension type 
    @return String
  */
  editor.format = function(path) {
    var regEx = /(?:\.([^.]+))?$/
    return editor.formats[regEx.exec(path)[1]];
  }

  return editor;
}]);
