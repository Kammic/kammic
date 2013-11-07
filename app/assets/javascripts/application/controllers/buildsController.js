BuildsController = ["$scope", "$http", function($scope, $http) {
  $scope.statusLabel = function(status) {
    var spinner = false;
    var label   = "label-success";

    switch(status) {
      case "completed":
        spinner = false;
        label   = "label-success";
        break;
      case "building":
        spinner = true;
        label   = "label-info";
        break;
      case "failed":
        spinner = false;
        label   = "label-danger";
        break;
      case "created":
        spinner = true;
        label   = "label-warning";
        break;
    }
    output  = '<span class=\"label ' + label + '\">';
    if(spinner)
      output += '<i class=\"fa fa-spinner fa-spin\"></i> ';
    output += status + '</span>'
    return output;
  }

  $scope.updateBuilds = function() {
    if(typeof $scope.id === 'undefined')
      return
    $http({method: 'GET', url: '/books/' + $scope.id +'/builds'}).
      success(function(data, status, headers, config) {
        $scope.builds = data;
      }).
      error(function(data, status, headers, config) {});
  }

  $scope.builds = [];

  $scope.updateBuilds();
  setInterval(function(){
    $scope.updateBuilds();
  }, 3000);
}];
