describe('controller: PendingController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='pending'></div>");
  });

  afterEach(function() {
    $("#pending").remove();
  });

  beforeEach(inject(function($rootScope, $controller, github, changedFileQueue, editorState) {
    this.scope  = $rootScope.$new();
    this.github = github;
    this.changedFileQueue = changedFileQueue;
    this.editorState = editorState;
    this.ctrl   = $controller('PendingController', {
      $scope: this.scope,
    });
  }));

  describe('#saveAll', function(){
    it('saves all files from the queue', function() {
      this.changedFileQueue.fileChanged('a.md');
      this.changedFileQueue.fileChanged('b.md');
      spy_and_return(this.github, 'saveFiles', {done: true});
      var done = false;
      this.scope.saveAll().then(function(status){
        done = true;
      });
      waitsFor(function(){return done;}, 'saveAll', 100);
      expect(this.scope.changed()).toEqual([]);
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
