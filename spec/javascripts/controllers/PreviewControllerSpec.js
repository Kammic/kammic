describe('controller: EditorController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='preview'></div>");
  });

  afterEach(function(){
    $("#preview").remove();
  });

  beforeEach(inject(function($rootScope, $controller) {
    this.scope = $rootScope.$new();
    this.ctrl  = $controller('PreviewController', {
      $scope: this.scope,
    });
  }));

  it('resizes the element on windowResized', function(){
    this.scope.$emit('windowResized', 50, 1);
    expect(this.scope.$element.width()).toEqual(50);
  });
});

