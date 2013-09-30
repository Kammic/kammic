github_user = 'ortuna';

var mock_ajax = function(url, response, type) {
  if(typeof type == 'undefined')
    type = 'GET'
  $.mockjax({url: url, type: type, responseText: response, responseTime: 50});
}

var start_mocking = function() {
  mock_ajax('*/user', {login: github_user});
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

  var fake_contents_list = [{
      "mode": "100644",
      "type": "file",
      "sha": "aaf0286669d6a1ac51889b757071aa5bb78761e7",
      "path": "manifest.yml",
      "name": "manifest.yml",
      "size": 489,
    },
    { "mode": "100644",
      "type": "dir",
      "sha": "aaf0286669d6a1ac51889b757071aa5bb78761e8",
      "path": "some_dir",
      "name": "some_dir",
      "size": 489,
    }];

    var fake_contents_list2 = [{
        "mode": "100644",
        "type": "file",
        "sha": "aaf0286669d6a1ac51889b757071aa5bb78761e7",
        "path": "manifest2.yml",
        "name": "manifest2.yml",
        "size": 489,
      },
      { "mode": "100644",
        "type": "dir",
        "sha": "aaf0286669d6a1ac51889b757071aa5bb78761e8",
        "path": "some_dir2",
        "name": "some_dir2",
        "size": 489,
      }];

  var fake_repo    = {
    "id": 11242128,
    "name": "progit-bana",
    "full_name": "Ortuna/progit-bana",
    "default_branch": "master",
    "master_branch": "master",
  };
  var fake_content =  {
    "sha": "aaf0286669d6a1ac51889b757071aa5bb78761e7",
    "length": 9,
    "content": "dGVzdA==",
    "encoding": "base64"
  };

  mock_ajax(/progit-bana$/, fake_repo);
  mock_ajax(/trees/, fake_tree);
  mock_ajax(/some_dir/, fake_contents_list2);
  mock_ajax(/contents/, fake_contents_list);
  mock_ajax(/blobs/, fake_content);
}

start_mocking();

