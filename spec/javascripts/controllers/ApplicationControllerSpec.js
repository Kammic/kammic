describe('controller: ApplicationController', function() {
  env.auth_token = '1234';

  beforeEach(function() {
    module('Application');
    $("body").append("<div id='preview'></div>");
  });

  afterEach(function(){
    $("#preview").remove();
  });

  beforeEach(inject(function($rootScope, $controller, github) {
    this.scope = $rootScope.$new();
    this.github = github;
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

    describe('Event: githubLoaded', function(){
      beforeEach(function(){
        spy_and_return(this.github, 'init', {});
      });

      it('emits githubLoaded after loading github', function() {
        var done = false;
        this.scope.$on('githubLoaded', function(){ done = true });
        waitsFor(function(){return done;}, 'Emit: githubLoaded', 100);
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
  });
});

