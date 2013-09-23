describe('controller: SaveStatusController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='menu-changes'></div>");
  });

  afterEach(function() {
    $("#menu-changes").remove();
  });
  
  beforeEach(inject(function($rootScope, $controller) {
    this.scope  = $rootScope.$new();
    this.ctrl   = $controller('SaveStatusController', {
      $scope: this.scope,
      $rootScope: this.scope
    });
  }));

  it('has a default class', function(){
    expect(this.scope.class).toBeDefined();
  });

  it('changes class on savedLocal', function(){
    check_emit(this.scope, 'savedLocal');
    this.scope.$emit('savedLocal');
    expect(this.scope.class).toEqual(['glyphicon-warning-sign']);
  });

  it('changes class on clearedLocal', function(){
    check_emit(this.scope, 'clearedLocal');
    this.scope.$emit('clearedLocal');
    expect(this.scope.class).toEqual(['glyphicon-ok-circle']);
  });
});
