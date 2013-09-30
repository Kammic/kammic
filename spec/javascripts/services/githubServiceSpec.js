describe('service: github', function() {
  beforeEach(module('Application'));
  beforeEach(inject(function(github) {
    subject = github;
  }));

  afterEach(function(){
    $.mockjaxClear();
  });

  var repoName   = 'progit-bana';
  // var auth_token = 'a17157d31accc9155e12f01825c8fc13fbf6137d';
  var auth_token  = 'some_auth_token';
  var github_user = 'ortuna';

  var mock_ajax = function(url, response) {
    $.mockjax({url: url, responseText: response, responseTime: 50});
  }

  describe('#init', function() {
    it('Can not be initialized without a token', function() {
      expect(function(){
        subject.init();
      }).toThrow('auth_token is required');
    });

    it('Returns a promise', function(){
      mock_ajax('*/user', {login: github_user});
      var done = false;
      subject.init(auth_token).then(function(){
        done = true;
      });
      waitsFor(function() { return done; }, 'init promise', 500);
    });

    it('Can be initialized with token', function() {
      mock_ajax('*/user', {login: github_user});
      subject.init(auth_token);
      expect(subject.api).toBeDefined();
      expect(subject.api).toNotEqual(null);
    });

    it('Knows the user and login', function(){
      mock_ajax('*/user', {login: github_user, id: '1245'});
      subject.init(auth_token);

      waitsFor(function() { return subject.user; }, 'subject.user', 500);
      runs(function(){
        expect(subject.user).toBeDefined();
        expect(subject.user.login).toBeDefined();
      });
    });
  });

  describe('#getUser', function(){
    it('Can return the current user after init', function(){
      mock_ajax('*/user', {login: github_user});
      var done = false;
      subject.init(auth_token).then(function(){
        done = true;
      });
      waitsFor(function() { return done; }, 'init promise', 500);
      runs(function(){
        expect(subject.getUser()).toEqual({login: github_user});
      });
    });

    it('Should return null when no user is present', function(){
      expect(subject.getUser()).toEqual(null);
    });
  });

  describe('#setRepo', function() {
    beforeEach(function(){
      $.mockjaxClear();
      mock_ajax('*/user', {login: github_user, id: '1245'});
      subject.init(auth_token);
      waitsFor(function() { return subject.user; }, 'subject init', 500);
    });

    it('can set the current repo with #setRepo', function(){
      subject.setRepo(repoName);
      expect(subject.repo).toBeDefined();
    });

    it('can not set the current repo without the name', function(){
      expect(function(){
        subject.setRepo();
      }).toThrow('repo is required');
    });

    it('sets the default branch', function(){
      subject.setRepo(repoName);
      expect(subject.branch).toBeDefined();
    });
  });

  describe('#getTree', function(){
    beforeEach(function(){
      $.mockjaxClear();
      mock_ajax('*/user', {login: github_user, id: '1245'});
      subject.init(auth_token);
      waitsFor(function() { return subject.user; }, 'subject init', 500);
      runs(function(){
        subject.setRepo(repoName);
        $.mockjaxClear();
      });
    });

    it('returns the main tree by default', function(){      
      var done = false;
      var expected_tree =   {
        "name": "01-introduction", "path": "01-introduction",
        "sha": "7627a212fa8e54ad535e3cf74b546bf10582a293", "size": null,
        "url": "xyz","html_url": "xyz", "git_url": "xyz", "type": "dir",
        "_links": { "self": "xyz", "git": "xyz", "html": "xyz" }
      };

      mock_ajax('*/repos/*', expected_tree);
      subject.getTree().then(function(tree) {
        expect(tree).toEqual(expected_tree);
        done = true;
      });

      waitsFor(function() { return done; }, 'getTree', 500);
    });

    it('returns a tree with the path', function(){
      var done = false;
      var expected_tree = {};

      mock_ajax('*', expected_tree);
      subject.getTree('01-introduction').then(function(tree) {
        expect(tree).toEqual(expected_tree);
        done = true;
      });

      waitsFor(function() { return done; }, 'getTree', 500);
    });
  });

  describe('#getFile', function(){
    beforeEach(function(){
      $.mockjaxClear();
      mock_ajax('*/user', {login: github_user, id: '1245'});
      subject.init(auth_token);
      waitsFor(function() { return subject.user; }, 'subject init', 500);
      runs(function(){
        subject.setRepo(repoName);
      });
    });
    
    it('fails without a file path', function(){
      expect(function() {
        subject.getFile();
      }).toThrow('path is required');
    });

    it('fetches a file', function(){
      var done = false;
      var fake_tree    =   {
        tree: [    {
          "mode": "100644",
          "type": "blob",
          "sha": "aaf0286669d6a1ac51889b757071aa5bb78761e7",
          "path": "manifest.yml",
          "size": 489,
        }]
      };
      var fake_repo    = {
        "id": 11242128,
        "name": "progit-bana",
        "full_name": "Ortuna/progit-bana",
        "default_branch": "master",
        "master_branch": "master",
      };
      var fake_content =  '{"sha": "aaf0286669d6a1ac51889b757071aa5bb78761e7","length": 9,"content": "dGVzdA==","encoding": "base64"}';

      $.mockjaxClear();
      mock_ajax(/progit-bana$/, fake_repo);
      mock_ajax(/trees/, fake_tree);
      mock_ajax(/blobs/, fake_content);

      subject.getFile('manifest.yml').then(function(response) {
        expect(Base64.decode(response.content.content)).toEqual('test');
        done = true;
      });

      waitsFor(function() { return done; }, 'getFile', 500);
    });
  });

  describe('#saveFiles', function(){
    beforeEach(function() {
      $.mockjaxClear();
      mock_ajax('*/user', {login: github_user, id: '1245'});
      subject.init(auth_token);
      waitsFor(function() { return subject.user; }, 'subject init', 500);
      runs(function(){
        subject.setRepo(repoName);
      });
    });

    it('does not save without files', function(){
      expect(function(){
        subject.saveFiles();
      }).toThrow('files are required');
    });

    it('sends content to github', function(){
      var done = false;
      var fake_head = {
        "ref": "refs/heads/master",
        "url": "https://api.github.com/repos/Ortuna/progit-bana/git/refs/heads/master",
        "object": {
          "sha": "d1e3e6208ecb1eff116a6046bc863cffbe70076a",
          "type": "commit",
          "url": "https://api.github.com/repos/Ortuna/progit-bana/git/commits/d1e3e6208ecb1eff116a6046bc863cffbe70076a"
        }
      }

      mock_ajax(/heads|repos/, fake_head);
      files  = [{'manifest.yml':'content'},{'manifest2.yml':'content2'} ]
      subject.saveFiles(files, 'some message').then(function() { done = true; });
      waitsFor(function() { return done; }, 'saveFiles', 500);
    });
  });

  describe('#saveFile', function(){
    beforeEach(function() {
      $.mockjaxClear();
      mock_ajax('*/user', {login: github_user, id: '1245'});
      subject.init(auth_token);
      waitsFor(function() { return subject.user; }, 'subject init', 500);
      runs(function(){
        subject.setRepo(repoName);
      });
    });

    it('does not save without a path', function(){
      expect(function(){
        subject.saveFile();
      }).toThrow('path is required');
    });

    it('sends content to github', function(){
      var done = false;
      var fake_head = {
        "ref": "refs/heads/master",
        "url": "https://api.github.com/repos/Ortuna/progit-bana/git/refs/heads/master",
        "object": {
          "sha": "d1e3e6208ecb1eff116a6046bc863cffbe70076a",
          "type": "commit",
          "url": "https://api.github.com/repos/Ortuna/progit-bana/git/commits/d1e3e6208ecb1eff116a6046bc863cffbe70076a"
        }
      }

      mock_ajax(/heads|repos/, fake_head);
      subject.saveFile('manifest.yml', 'content').then(function() {
        done = true;
      });

      waitsFor(function() { return done; }, 'saveFile', 500);
    });
  });

  describe('#getCommits', function(){
    beforeEach(function(){
      $.mockjaxClear();
      mock_ajax('*/user', {login: github_user, id: '1245'});
      subject.init(auth_token);
      waitsFor(function() { return subject.user; }, 'subject init', 500);
      runs(function(){
        subject.setRepo(repoName);
        $.mockjaxClear();
      });
    });

    it('returns the repos commits', function(){
      mock_ajax(/commits/, [{'test':true}]);
      subject.getCommits().then(function(commits){
        expect(commits).toEqual([{'test':true}]);
      });
    });
  });

  describe('#deleteFile', function() {
    beforeEach(function(){
      $.mockjaxClear();
      mock_ajax('*/user', {login: github_user, id: '1245'});
      subject.init(auth_token);
      waitsFor(function() { return subject.user; }, 'subject init', 500);
      runs(function(){
        subject.setRepo(repoName);
        $.mockjaxClear();
      });
    });

    it('requires a path', function() {
      expect(function(){
        subject.deleteFile()
      }).toThrow('path is required');
    });

    it('deletes the file', function() {
      spyOn(subject.branch, 'remove');
      subject.deleteFile('xyz.md');
      expect(subject.branch.remove).toHaveBeenCalled();
    });

  });

});
