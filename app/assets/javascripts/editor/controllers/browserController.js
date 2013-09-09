BrowserController = function($scope, $rootScope) {
  $scope.$element = $('#browser');
  $scope.$element.hide();
  $scope.visible  = false;

  $rootScope.$on('toggleBrowser', function(e) {
    if($scope.visible) {
      $scope.visible = false;
      $scope.$element.fadeOut(250);
    } else {
      $scope.visible = true;
      $scope.$element.fadeIn(250);
    }
  });

  $rootScope.$on('fileSelected', function(e, file) {
    
  });

  $scope.files = [
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
    {name: 'file1.md', size: '1 MB', updated: 'Aug 1, 2013 12:00PM'},
  ];
  
  $(window).resize(function() {
    var width  = $(document).width()/2.05;
    var height = $(document).height()/2.05;
    $scope.$element.width(width);
    $scope.$element.height(height);

    $scope.$element.css('top', height/2);
    $scope.$element.css('left', width/2);
  });
  $(window).resize();
  $scope.$emit('browserLoaded');
}
