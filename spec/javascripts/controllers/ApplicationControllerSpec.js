describe('ApplicationController', function() {
  var $scope = null;
  var ctrl   = null;
  
  beforeEach(function(){
    angular.module('Application');
  });

  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    ctrl = $controller('ApplicationController', {
      $scope: $scope,
    });
  }));

  it('load the constant', function(){
    expect(ApplicationController).toBeDefined();
  });

  it('can convert markdown to html', function(){

  });
});

