describe('controller: BrowserController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='browser'></div>");
  });

  afterEach(function(){
    $("#browser").remove();
  });

  beforeEach(inject(function($rootScope, $controller, github) {
    env.auth_token = '1235';
    this.scope  = $rootScope.$new();
    this.github = github;
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
    xit('hides the browser when a file is selected', function(){
      var done = false;
      this.scope.$on('hideMenu', function(){
        done = true;
      });
      this.scope.$emit('fileSelected');
      waitsFor(function(){ return done; }, 'emit hideMenu', 100);
    });
  });

});

