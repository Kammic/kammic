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

  describe('Event: toggleBrowser', function(){
    it('hides the browser', function() {
      this.scope.visible = false;
      this.scope.$emit('toggleBrowser');
      waitsFor(function(){ return this.scope.visible; }, 'toggleBrowser', 100);
      expect(this.scope.visible).toEqual(true);
    });

    it('shows the browser', function() {
      this.scope.visible = true;

      this.scope.$emit('toggleBrowser');
      waitsFor(function(){ return !(this.scope.visible); }, 'toggleBrowser', 100);
      expect(this.scope.visible).toEqual(false);
    });
  });

});

