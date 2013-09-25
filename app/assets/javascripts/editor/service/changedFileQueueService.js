Application.service('changedFileQueue', function() {
  var changedFileQueue = {}

  changedFileQueue.changedFiles = function() {
    var object = JSON.parse(localStorage.getItem('changedFiles'));
    return object ? object : {};
  }

  changedFileQueue.fileChanged = function(path) {
    if(typeof path === 'undefined')
      return;
    var object = changedFileQueue.changedFiles();
    object[path] = true;
    localStorage.setItem('changedFiles', JSON.stringify(object));
  }

  changedFileQueue.resetFile = function(path) {
    if(typeof path === 'undefined')
      return;
    var object = changedFileQueue.changedFiles();
    delete object[path];
    localStorage.setItem('changedFiles', JSON.stringify(object));
  }

  return changedFileQueue;
});
