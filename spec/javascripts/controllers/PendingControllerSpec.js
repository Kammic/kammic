describe('controller: PendingController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='pending'></div>");
  });

  afterEach(function() {
    $("#pending").remove();
  });

  beforeEach(inject(function($rootScope, $controller, github, changedFileQueue, editor) {
    this.scope  = $rootScope.$new();
    this.github = github;
    this.changedFileQueue = changedFileQueue;
    this.editor = editor;
    this.ctrl   = $controller('PendingController', {
      $scope: this.scope,
    });
  }));
  
  beforeEach(function() {
    localStorage.clear();
  });

  describe('#saveAll', function() {
    it('calls editorService#saveAllChangedFiles', function() {
      spyOn(this.editor, 'saveAllChangedFiles');
      this.scope.saveAll();
      expect(this.editor.saveAllChangedFiles).toHaveBeenCalled();
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
      this.editor.currentFile({path: 'a.md'});
      check_emit(this.scope, 'fileSelected');
      this.scope.$emit('remove', 'a.md');
    });
  });

  describe('Event: saveAll', function(){
    it('calls scope.saveAll without a save message', function(){
      spyOn(this.editor, 'saveAllChangedFiles');
      this.scope.$emit('saveAll');
      expect(this.editor.saveAllChangedFiles).toHaveBeenCalledWith(undefined);
    });

    it('calls scope.saveAll with the save message', function() {
      this.scope.message = "test commit";

      spyOn(this.editor, 'saveAllChangedFiles');
      this.scope.$emit('saveAll');
      expect(this.editor.saveAllChangedFiles).toHaveBeenCalledWith('test commit');
    });

    it('resets the custom message after saving', function(){
      spyOn(this.editor, 'saveAllChangedFiles');

      this.scope.message = "test commit";
      this.scope.$emit('saveAll');
      expect(this.scope.message).toEqual(null);
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
