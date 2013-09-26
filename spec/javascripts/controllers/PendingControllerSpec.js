describe('controller: PendingController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='pending'></div>");
  });

  afterEach(function() {
    $("#pending").remove();
  });

  beforeEach(inject(function($rootScope, $controller, changedFileQueue, editorState) {
    this.scope  = $rootScope.$new();
    this.changedFileQueue = changedFileQueue;
    this.editorState = editorState;
    this.ctrl   = $controller('PendingController', {
      $scope: this.scope,
    });
  }));

  beforeEach(function(){
    localStorage.clear();
  });

  describe('#changed', function(){
    it('retrieves the list of changed files', function(){
      this.changedFileQueue.fileChanged('a.md');
      this.changedFileQueue.fileChanged('b.md');
      expect(this.scope.changed())
       .toEqual(['a.md', 'b.md']);
    });
  });

  describe('#saved', function(){
    it('removes file from changedFileQueue', function(){
      this.changedFileQueue.fileChanged('a.md');
      this.changedFileQueue.fileChanged('b.md');

      this.scope.saved('a.md');
      expect(this.scope.changed())
       .toEqual(['b.md']);
    });
  });

  describe('Event: remove', function(){
    it('Removes a file from pending', function() {
      this.changedFileQueue.fileChanged('a.md');
      check_emit(this.scope, 'remove');
      this.scope.$emit('remove', 'a.md');

      expect(this.scope.changed()).toEqual([]);
    });

    it('Clears the file from localStorage', function(){
      localStorage.setItem('a.md', 'example item');
      check_emit(this.scope, 'remove');
      this.scope.$emit('remove', 'a.md');

      expect(localStorage.getItem('a.md')).toEqual(null);
    });

    it('Emits: fileSelected when current file is removed', function(){
      this.editorState.currentFile({path: 'a.md'});
      check_emit(this.scope, 'fileSelected');
      this.scope.$emit('remove', 'a.md');
    });
  });

  describe('Event: saved', function(){
    it('removes the saved file from the queue', function(){
      this.changedFileQueue.fileChanged('a.md');
      this.changedFileQueue.fileChanged('b.md');

      var done = false;
      this.scope.$on('saved', function(path){ done = true; });
      this.scope.$emit('saved', 'a.md');
      
      waitsFor(function(){ return done; }, 'emit saved', 100);
      runs(function(){
        expect(this.scope.changed()).toEqual(['b.md']);
      });
      
    });
  });

});
