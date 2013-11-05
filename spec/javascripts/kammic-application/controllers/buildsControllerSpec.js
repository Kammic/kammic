describe('Controller: BuildsController', function() {
  beforeEach(module('Kammic'));
  beforeEach(inject(function($httpBackend, $rootScope, $controller) {
    this.$httpBackend = $httpBackend;
    this.$httpBackend.expectGET('/books/1/builds').respond({});
    this.scope = $rootScope.$new();
    this.ctrl  = $controller('BuildsController', {
      $scope: this.scope,
    });
  }));

  it("converts a string to bootstrap HTML label", function() {
    expect(this.scope.statusLabel('completed')).toMatch(/complete/);
    expect(this.scope.statusLabel('created')).toMatch(/created/);
    expect(this.scope.statusLabel('failed')).toMatch(/failed/);
    
    expect(this.scope.statusLabel('completed')).toMatch(/label-success/);
    expect(this.scope.statusLabel('created')).toMatch(/label-warning/);
    expect(this.scope.statusLabel('failed')).toMatch(/label-danger/);
  });

});
