describe('controller: NavBarController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='nav'></div>");
  });

  afterEach(function(){
    $("#nav").remove();
  });

  beforeEach(inject(function($rootScope, $controller, github) {
    this.scope = $rootScope.$new();
    this.github = github;
    this.ctrl  = $controller('NavBarController', {
      $scope: this.scope,
    });
  }));

  it('sets the element width on resize', function(){
    $('#nav').width(5);
    this.scope.$emit('windowResized', 500, 500);
    expect($('#nav').width()).toEqual(500);
  });

  describe('#updateUser', function(){
    it('sets user to the current github service user', function(){
      spyOn(this.github, 'getUser').andCallFake(function(){
        return {login: 'ortuna'};
      });
      this.scope.updateUser();
      expect(this.scope.user).toEqual({login: 'ortuna'});
    });
  });
});
