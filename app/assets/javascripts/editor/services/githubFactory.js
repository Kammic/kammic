Application.factory('githubFactory', function($q, $rootScope) {
  var factory = {}

  factory.github  = new Octokit({token: auth_token});
  factory.getUser = function() {
    return this.github.getUser();
  };

  factory.getRepos = function(){
    return this.getUser().getRepos();
  }
  return factory;
});
