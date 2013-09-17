Application.service('github', function() {
  var github = {}

  github.api = null;
  github.init = function(auth_token) {
    if(typeof auth_token === 'undefined')
      throw 'auth_token is required';

    var api   = new Octokit({ token: auth_token});
    var defer = $.Deferred();
    api.getUser().getInfo().done(function(user){
      github.user = user;
      defer.resolve();
    });
    github.api = api;
    return defer;
  }

  github.setRepo = function(repo) {
    if(typeof repo === 'undefined')
      throw 'repo is required';
    github.repo   = github.api.getRepo(github.user.login, repo);
    github.branch = github.repo.getDefaultBranch();
  }

  github.getTree = function(path) {
    if(typeof path === 'undefined')
      path = ''
    return github.repo.contents('master', path);
  }

  github.getFile = function(path) {
    if(typeof path === 'undefined')
      throw 'path is required';
    return github.branch.read(path);
  }

  github.saveFile = function(path, content) {
    if(typeof path === 'undefined')
      throw 'path is required';
    return github.branch.write(path, content, "Updated " + path);
  }

  return github;
});
