describe('controller: EditorController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='editor'></div>");
  });

  afterEach(function() {
    $("#editor").remove();
  });

  beforeEach(inject(function($rootScope, $controller, github) {
    this.github = github;
    this.scope  = $rootScope.$new();
    this.ctrl   = $controller('EditorController', {
      $scope: this.scope,
      $rootScope: this.scope
    });
  }));

  it('emits hideBrowser when clicked', function(){
    var done = false;
    this.scope.$on('hideBrowser', function(e) {
      done = true;
    });

    waitsFor(function() { return done; }, 'emit hideBrowser on click', 100);
    this.scope.$element.click();
  });

  xdescribe('Keyboard events', function(){
    it('emits saveFile when command+s', function(){
      skip();
      var done = false;
      this.scope.$on('saveFile', function(e) {
        done = true;
      });      
      waitsFor(function() { return done; }, 'emit saveFile on command+s', 100);
      $(".ace_content").simulate('keyboardEvent', 
                                  'keyUp', { metaKey: true, keyCode: 83 });
    });
  });

  describe('Event: windowResized', function() {
    it('resizes the element on windowResized', function() {
      var originalWidth = this.scope.$element.width();
      this.scope.$emit('windowResized', 50, 1);
      expect(this.scope.$element.width()).toNotEqual(originalWidth);
    });
  });

  describe('Event: loadFile', function() {
    it('updates the $scope.file', function(){
      this.scope.file = null;
      this.scope.$emit('loadFile', 'object_as_string');
      expect(this.scope.file).toEqual('object_as_string');
    });

    it('sets the ace editor value to object.content', function() {
      var file = {content: '#title'};
      this.scope.$emit('loadFile', file);

      var editorValue = this.scope.editor.getSession().getValue();
      expect(editorValue).toEqual('#title');
    });
  });

  describe('Event: fileSelected', function() {
    it('emits loadFile with response', function() {
      spy_and_return(this.github, 'getFile', {content: 'test content'});
      check_emit(this.scope, 'loadFile');

      var done = false;
      this.scope.$on('loadFile', function(e, file) {
        expect(file.content).toEqual('test content');
        done = true;
      });

      waitsFor(function(){ return done; }, 'emit loadFile w/ content', 100);
      this.scope.$emit('fileSelected', {path: 'some_remote_path'});
    });
  });

  describe('Event: previewLoaded', function(){
    it('emits markdownUpdated', function(){
      var done = false;
      this.scope.editor.setValue('test content');
      this.scope.$on('markdownUpdated', function(e, content) {
        expect(content).toEqual('test content');
        done = true;
      });

      waitsFor(function(){ return done; }, 'emit markdownUpdated w/ previewLoaded', 100);
      this.scope.$emit('previewLoaded');
    });
  });
});

