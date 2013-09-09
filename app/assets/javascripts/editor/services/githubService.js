Application.factory('githubService', function($q, $rootScope) {
  this.getFiles = function(){
    return [
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
      {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    ];
  }
  
  return this;
});
