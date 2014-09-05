leefplezierControllers.controller('PublicationCtrl', function($scope, $http) {
  $http({method:'GET', url: 'content/publications.json'}).success(function(data){
    $scope.publications = data;
  });
})
