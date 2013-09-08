describe('controller: PreviewController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='browser'></div>");
  });

  afterEach(function(){
    $("#browser").remove();
  });

  beforeEach(inject(function($rootScope, $controller) {
    this.scope = $rootScope.$new();
    this.ctrl  = $controller('BrowserController', {
      $scope: this.scope,
    });
  }));

  it('is hidden by default', function(){
    expect(this.scope.visible).toBe(false);
    expect(this.scope.$element.css('display')).toEqual('none');
  });

  it('#toggleBrowser', function(){
    expect(this.scope.visible).toBe(false);
    expect(this.scope.$element.css('display')).toEqual('none');
    this.scope.$emit('toggleBrowser');
    expect(this.scope.visible).toBe(true);
    expect(this.scope.$element.css('display')).toNotEqual('none');
  });

  it('sets the list of files on scope', function(){
    // expect(this.scope.files).toEqual(['file1.md', 'file2.md']);
  });
});

