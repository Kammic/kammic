describe('controller: MenuPanel', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='menu-panel'></div>");
  });

  afterEach(function(){
    $("#menu-panel").remove();
  });

  beforeEach(inject(function($rootScope, $controller, github) {
    env.auth_token = '1235';
    this.scope  = $rootScope.$new();
    this.github = github;
    this.ctrl   = $controller('MenuPanelController', {
      $scope: this.scope,
    });
  }));

  it('defaults to browser as selected', function(){
    expect(this.scope.selected).toEqual('Browser');
  });

  describe('#isActive', function(){
    it('responds with the active item', function(){
      expect(this.scope.isActive('Browser')).toEqual(true);
      expect(this.scope.isActive('something_else')).toEqual(false);

      this.scope.$emit('menuSelect', 'files');
      expect(this.scope.isActive('files')).toEqual(true);
    });
  });

  describe('Event: menuSelect', function(){
    it('sets selected to the passed in item', function(){
      this.scope.$emit('menuSelect', 'files');
      expect(this.scope.selected).toEqual('files');

      this.scope.$emit('menuSelect', 'other');
      expect(this.scope.selected).toEqual('other');
    });
  });

  describe('Event: toggleMenu', function() {
    it('hides the menu', function() {
      this.scope.visible = false;
      this.scope.$emit('toggleMenu');
      waitsFor(function(){ return this.scope.visible; }, 'toggleMenu', 100);
      expect(this.scope.visible).toEqual(true);
    });

    it('shows the menu', function() {
      this.scope.visible = true;

      this.scope.$emit('toggleMenu');
      waitsFor(function(){ return !(this.scope.visible); }, 'toggleMenu', 100);
      expect(this.scope.visible).toEqual(false);
    });
  });

  describe('Event: showMenu', function(){
    it('shows the menu', function(){
      this.scope.visible = false;
      this.scope.$emit('showMenu');
      waitsFor(function(){ return this.scope.visible; }, 'showMenu', 100);
      expect(this.scope.visible).toEqual(true);
    });

    it('shows the menu at current selected item', function(){
      this.scope.$emit('showMenu', 'Pending');
      waitsFor(function(){ return this.scope.visible; }, 'showMenu', 100);
      expect(this.scope.visible).toEqual(true);
      expect(this.scope.selected).toEqual('Pending');
    });
  });

  describe('Event: hideMenu', function(){
    it('hides the menu', function(){
      this.scope.visible = true;
      this.scope.$emit('hideMenu');
      waitsFor(function(){ return !(this.scope.visible); }, 'hideMenu', 100);
      expect(this.scope.visible).toEqual(false);
    });
  });
});
