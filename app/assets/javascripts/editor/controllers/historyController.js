HistoryController = ["$scope", "$rootScope", "github", function($scope, $rootScope, github) {
  var context         = this;
  $scope.$element     = $('#history');
  $scope.commits      = [];

  $scope.updateHistory = function() {
    github.getCommits().then(function(commits){
      $scope.commits = commits;
    });    
  }

  $rootScope.$on('updateHistory', function(){ $scope.updateHistory(); });
  $rootScope.$on('githubLoaded', function(){ $scope.updateHistory(); });
}];
