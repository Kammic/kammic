describe('controller: PreviewController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='preview'></div>");
  });

  afterEach(function() {
    $("#preview").remove();
  });

  beforeEach(inject(function($rootScope, $controller) {
    this.scope = $rootScope.$new();
    this.ctrl  = $controller('PreviewController', {
      $scope: this.scope,
    });
  }));

  it('resizes the element on windowResized', function(){
    var originalWidth = this.scope.$element.width();
    this.scope.$emit('windowResized', 50, 1);
    expect(this.scope.$element.width()).toNotEqual(originalWidth);
  });

  it('emits hideBrowser when clicked', function(){
    var done = false;
    this.scope.$on('hideBrowser', function(e) {
      done = true;
    });

    waitsFor(function() { return done; }, 'emit hideBrowser on click', 100);
    this.scope.$element.click();
  });

  describe('Event: markdownUpdated', function(){
    it('updates the preview on markdownUpdated', function(){
      this.scope.preview = 'before update';
      this.scope.$emit('markdownUpdated', 'after update');
      expect(this.scope.preview).toEqual('<p>after update</p>');
    });

    it('converts raw markdown to HTML', function(){
      this.scope.$emit('markdownUpdated', '#title');
      expect(this.scope.preview).toMatch(/<h1 .*>title<\/h1>/);
    });
  });
});

