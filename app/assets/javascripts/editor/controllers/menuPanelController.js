MenuPanelController = function($scope, $rootScope) {
  $scope.$element = $('#menu-panel');
  $scope.$element.hide();
  $scope.visible  = false;
  $scope.selected = 'Browser';
  $scope.items    = ['Browser', 'Pending', 'History'];

  $scope.isActive = function(item) {
    return $scope.selected == item;
  };

  $rootScope.$on('menuSelect', function(e, item){
    $scope.selected = item;
  });

  $rootScope.$on('toggleMenu', function(e) {
    $scope.visible ? hideMenu() : showMenu();
  });

  $rootScope.$on('showMenu', function(e, selectedItem) {
    if(!$scope.visible) {  showMenu(); }
    if(typeof selectedItem !== 'undefined')
      $scope.selected = selectedItem;
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
    $scope.$element.width(width/2.2);
    $scope.$element.height(height);

    $scope.$element.css('top', 0);
    $scope.$element.css('right', 0);
  });
  $(window).resize();

  $scope.$emit('menuPanelLoaded');
}
