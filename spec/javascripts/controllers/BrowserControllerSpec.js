describe('controller: BrowserController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='browser'></div>");
  });

  afterEach(function(){
    $("#browser").remove();
  });

  repo_name  = 'progit-bana';

  beforeEach(inject(function($rootScope, $controller, github, editor) {
    this.scope  = $rootScope.$new();
    this.github = github;
    this.editor = editor;
    this.ctrl   = $controller('BrowserController', {
      $scope: this.scope,
    });
  }));

  beforeEach(function() {
    spy_and_return(this.github, 'init', {});
  });

  it('should init the github service', function() {
    expect(this.github.api).toBeDefined();
  });

  describe('Event: githubLoaded', function() {
    beforeEach(function(){
      spy_and_return(this.github,
                     'getFile',
                     {path:'test.md', content:'content'});
      spyOn(this.github, 'setRepo').andReturn({});
      spyOn(this.scope,  'browseToDirectory').andReturn({});
      this.editor.namespace(repo_name);
    });

    it('Emits fileSelected w/ last opened file', function() {
      var done = false;
      this.editor.lastEditedFile('test.md');
      this.scope.$on('fileSelected', function(e, file){
        expect(file.path).toEqual('test.md');
        done = true;
      });

      waitsFor(function(){ return done; }, 'emit fileSelected', 200);
      this.scope.$emit('githubLoaded');
    });

    it('sets the github repo to repo_name', function(){
      spyOn(this.editor, 'namespace');
      this.scope.$emit('githubLoaded');
      expect(this.editor.namespace).toHaveBeenCalledWith('progit-bana');
    });
  });


  describe('#createFile', function() {
    beforeEach(function(){
      var dfd = new jQuery.Deferred();
      dfd.resolve({});
      spyOn(this.github, 'getTree').andReturn(dfd);
      spyOn(this.github, 'saveFile').andReturn(dfd);
    });

    it('can\'t be called without path', function(){
      var context = this;
      expect(function(){
        context.scope.createFile();
      }).toThrow('path is required');
    });

    it('calls saveFile on github service', function(){
      this.scope.createFile('new_file.md');
      expect(this.github.saveFile).toHaveBeenCalledWith('new_file.md', '');
    });

    it('creates a file at the current path', function(){
      this.scope.currentPath = ['example', 'sub_dir'];

      this.scope.createFile('new_file.md');
      expect(this.github.saveFile)
        .toHaveBeenCalledWith('example/sub_dir/new_file.md', '');
    });
  });

  describe('#updateFileList', function() {
    it('updates the file list to value', function() {
      this.scope.updateFilesList([1,2,3]);
      expect(this.scope.files).toEqual([1,2,3]);
    });
  });

  describe('#setLoading', function() {
    it('sets loading to value',function(){
      this.scope.setLoading(true);
      expect(this.scope.loading).toEqual(true);

      this.scope.setLoading(false);
      expect(this.scope.loading).toEqual(false);
    });
  });

  describe('loading', function() {
    it('sets $scope.loading when browsing directory', function(){
      this.scope.loading = true;
      spy_and_return(this.github, 'getTree', [{}]);
      this.scope.$emit('dirSelected', {path: 'test'});
      expect(this.scope.loading).toEqual(false);
    });
  });

  describe('Event: dirSelected', function() {
    it('sets the current path correctly', function() {
      spy_and_return(this.github, 'getTree', [{}]);
      this.scope.$emit('dirSelected', {path: 'test'});
      expect(this.scope.currentPath).toEqual(['test']);
    });
  });

  describe('Event: parentSelected', function() {
    it('sets the current path correctly', function() {
      this.scope.currentPath = ['test'];
      spy_and_return(this.github, 'getTree', [{}]);
      this.scope.$emit('parentSelected');
      expect(this.scope.currentPath).toEqual([]);
    });
  });
  describe('Event: deleteFile', function(){
    it('deletes a the file', function(){
      spyOn(this.scope, 'browseToDirectory');
      spy_and_return(this.github, 'deleteFile', {});
      this.scope.$emit('deleteFile', 'test.md');
      expect(this.scope.browseToDirectory).toHaveBeenCalled();
    });
  });

  describe('Event: fileSelected', function() {
    it('hides the browser when a file is selected', function(){
      check_emit(this.scope, 'hideMenu');
      this.scope.$emit('fileSelected');
    });
  });

});

