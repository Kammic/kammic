describe('controller: ApplicationController', function() {
  beforeEach(function(){
    module('Application');
  });

  beforeEach(inject(function($rootScope, $controller) {
    this.scope = $rootScope.$new();
    this.ctrl  = $controller('ApplicationController', {
      $scope: this.scope,
    });
  }));

  describe('internal', function(){
    it('load the constant', function(){
      expect(ApplicationController).toBeDefined();
    });

    it('#mdToHTML', function(){
      expect(this.ctrl.mdToHTML('#test')).toEqual('<h1 id="test">test</h1>');
    });

    it('#updatePreview', function(){
      this.ctrl.updatePreview("#test");
      expect(this.scope.value).toEqual('<h1 id="test">test</h1>');
    });
  });

  describe('events', function(){
    it('#updatePreview on #markdownUpdated', function(){
      this.scope.$emit("markdownUpdated", 'xyz');
      expect(this.scope.value).toEqual('<p>xyz</p>');
    });

    it('#updatePreview on #editorLoaded', function(){
      this.scope.$emit("editorLoaded", 'xyz');
      expect(this.scope.value).toEqual('<p>xyz</p>');
    });

    it('emits windowResized on window resize', function(){
      var calledResized = false;
      this.scope.$on('windowResized', function(e, width, height){
        expect(width).toBeGreaterThan(1);
        expect(height).toBeGreaterThan(1);
        calledResized = true;
      });
      
      $(window).resize();
      expect(calledResized).toEqual(true);
    });
  });
});

