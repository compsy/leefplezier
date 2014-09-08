leefplezierControllers.controller('LinksController', function($scope, $location) {
  $scope.active = function(url) {
    if($location.path() === url) return "active"
    return ""
  }
});
