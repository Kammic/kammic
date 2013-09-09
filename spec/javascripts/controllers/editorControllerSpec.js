describe('controller: EditorController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='editor'></div>");
  });

  afterEach(function(){
    $("#editor").remove();
  });

  beforeEach(inject(function($rootScope, $controller) {
    this.scope = $rootScope.$new();
    this.ctrl  = $controller('EditorController', {
      $scope: this.scope,
    });
  }));

  it('creates the ace editor', function(){
    expect(this.scope.editor).toBeDefined();
  });

  it('updates the elements width on #windowResized', function(){
    this.scope.$emit('windowResized', 50, 50);
    expect(this.scope.$element.width()).toEqual(50);
  });

  it('emits #markdownUpdated on editor change', function(){
    var emitted = false;
    this.scope.$on('markdownUpdated', function(e, value) {
      expect(value).toEqual('some markdown');
      emitted = true;
    });
    
    this.scope.editor.setValue('some markdown');
    expect(emitted).toEqual(true);
    
  });

  it("#markdown gets the current markdown", function(){
    this.scope.editor.setValue('#title');
    var markdown = this.ctrl.markdown();
    expect(markdown).toBe('#title');
  });
});

