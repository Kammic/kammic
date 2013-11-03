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

  describe('showLoading/hideLoading', function() {
    it('calls #setLoading(true) on showLoading', function() {
      spyOn(this.scope, 'setLoading');
      this.scope.$emit('showLoading');
      expect(this.scope.setLoading).toHaveBeenCalledWith(true);
    });
  });

  describe('#setLoading', function() {
    it('sets loading to true/false', function() {
      this.scope.setLoading(true);
      expect(this.scope.loading).toEqual(true);

      this.scope.setLoading(false);
      expect(this.scope.loading).toEqual(false);
      var context = this;
      expect(function(){ context.scope.setLoading(); }).toThrow('value is required');
    });
  });

  describe('#updateUser', function(){
    beforeEach(function(){
      spyOn(this.github, 'getUser').andReturn({login: 'ortuna', avatar_url: 'tmp'});
    });

    it('sets the users avatar', function() {
      this.scope.updateUser();
      expect(this.scope.avatar).toEqual('tmp');
    });

    it('sets user to the current github service user', function(){
      this.scope.updateUser();
      expect(this.scope.user.login).toEqual('ortuna');
    });
  });
});
