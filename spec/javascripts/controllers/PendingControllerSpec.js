describe('controller: PendingController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='pending'></div>");
  });

  afterEach(function() {
    $("#pending").remove();
  });

  beforeEach(inject(function($rootScope, $controller, changedFileQueue) {
    this.scope  = $rootScope.$new();
    this.changedFileQueue = changedFileQueue;
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
