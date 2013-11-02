Application.service('changedFileQueue', [function() {
  var service   = {}
  var namespace = '';

  service.namespace = function(ns) {
    if(typeof ns === 'undefined')
      return namespace;
    namespace = ns;
  }

  service.changedFiles = function() {
    var object = JSON.parse(localStorage.getItem(namespace + 'changedFiles'));
    return object ? object : {};
  }

  service.fileChanged = function(path) {
    if(typeof path === 'undefined')
      return;
    var object = service.changedFiles();
    object[path] = true;
    localStorage.setItem(namespace + 'changedFiles', JSON.stringify(object));
  }

  service.resetFile = function(path) {
    if(typeof path === 'undefined')
      return;
    var object = service.changedFiles();
    delete object[path];
    localStorage.setItem(namespace + 'changedFiles', JSON.stringify(object));
  }

  return service;
}]);
