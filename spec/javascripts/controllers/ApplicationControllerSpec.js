describe('controller: ApplicationController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='preview'></div>");
  });

  beforeEach(inject(function($rootScope, $controller) {
    this.scope = $rootScope.$new();
    this.ctrl  = $controller('ApplicationController', {
      $scope: this.scope,
    });
  }));

  describe('Notifications', function(){
    describe('Event: notify', function(){
      it('shows notifications when notify is emitted', function(){
        this.scope.$emit('notify', 'some message');
        waitsFor(function(){
          return $('.bootstrap-growl').length > 0
        }, 100);
      });

      it('shows the correct message', function(){
        this.scope.$emit('notify', 'my_message');
        waitsFor(function(){
          return $('.bootstrap-growl').length > 0
        }, 100);

        expect($('.bootstrap-growl').text()).toMatch(/my_message/);
      });
    });
  });

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

