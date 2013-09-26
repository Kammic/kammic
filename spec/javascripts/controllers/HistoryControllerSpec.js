describe('controller: HistoryController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='history'></div>");
  });

  afterEach(function() {
    $("#history").remove();
  });

  beforeEach(inject(function($rootScope, $controller, github) {
    this.scope  = $rootScope.$new();
    this.github = github;
    this.ctrl   = $controller('HistoryController', {
      $scope: this.scope,
    });
  }));

  describe('$scope.commits', function(){
    it('starts out as empty', function(){
      expect(this.scope.commits).toEqual([]);
    });
  });

  describe('updating history', function(){
    it('#updateHistory', function(){
      var expectedResult = [{test: true}];
      spy_and_return(this.github, 'getCommits', expectedResult);
      this.scope.updateHistory();
      expect(this.scope.commits).toEqual(expectedResult);
    });

    it('#updatesHistory on githubLoaded', function(){
      spy = spyOn(this.scope, 'updateHistory');
      this.scope.$emit('githubLoaded');
      expect(spy).toHaveBeenCalled();
    });

    it('#updatesHistory on updateHistory', function(){
      spy = spyOn(this.scope, 'updateHistory');
      this.scope.$emit('updateHistory');
      expect(spy).toHaveBeenCalled();
    });
  });

});
