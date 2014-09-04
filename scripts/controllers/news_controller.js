leefplezierControllers.controller('NewsCtrl', function($scope) {
  $scope.save = function() {
      Projects.$add($scope.project).then(function(data) {
          $location.path('/');
      });
  };
})
