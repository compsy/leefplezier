leefplezierControllers.controller('ResearcherCtrl', function($scope, $http) {
  $http({method:'GET', url: 'content/researchers.json'}).success(function(data){
    $scope.researchers = data;
    $scope.distribution = 12/data.length;
    });
});
