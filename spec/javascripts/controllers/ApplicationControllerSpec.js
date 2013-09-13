describe('controller: ApplicationController', function() {
  beforeEach(function() {
    module('Application');
  });

  beforeEach(inject(function($rootScope, $controller) {
    this.scope = $rootScope.$new();
    this.ctrl  = $controller('ApplicationController', {
      $scope: this.scope,
    });
  }));

  describe('Events: previewLoaded, editorLoaded', function(){
    it('calls window resize on previewLoaded', function(){
      var done = false;
      $(window).resize(function(){ done = true; });
      this.scope.$emit('previewLoaded');
      waitsFor(function(){ return done; }, 100);
    });

    it('calls window resize on editorLoaded', function(){
      var done = false;
      $(window).resize(function(){ done = true; });
      this.scope.$emit('editorLoaded');
      waitsFor(function(){ return done; }, 100);
    });
  });
});

