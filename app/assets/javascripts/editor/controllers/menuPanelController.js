MenuPanelController = function($scope, $rootScope) {
  $scope.$element = $('#menu-panel');
  $scope.$element.hide();
  $scope.visible  = false;
  $scope.selected = 'Browser';
  $scope.items    = ['Browser', 'Pending', 'History', 'Assets'];

  $scope.isActive = function(item) {
    return $scope.selected == item;
  };

  $rootScope.$on('menuSelect', function(e, item){
    $scope.selected = item;
  });

  $rootScope.$on('toggleMenu', function(e) {
    $scope.visible ? hideMenu() : showMenu();
  });

  $rootScope.$on('showMenu', function(e) {
    if(!$scope.visible) {  showMenu(); }
  });

  $rootScope.$on('hideMenu', function(e){
    if($scope.visible) { hideMenu(); }
  });

  var hideMenu = function() {
    $scope.visible = false;
    $scope.$element.fadeOut(env.menuFadeOutTime);
  }

  var showMenu = function() {
    $scope.visible = true;
    $scope.$element.fadeIn(env.menuFadeInTime);
  }

  $rootScope.$on('windowResized', function(e, width, height){
    $scope.$element.width(width/2.05);
    $scope.$element.height(height/2.05);

    $scope.$element.css('top', height/4.05);
    $scope.$element.css('left', width/4.05);
  });
  $(window).resize();

  $scope.$emit('menuPanelLoaded');
}
