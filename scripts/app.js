var leefplezierApp = angular.module('leefplezier', ['ngRoute', 'leefplezierControllers']);
var leefplezierControllers = angular.module('leefplezierControllers', []);

leefplezierApp.config(['$routeProvider', 
  function($routeProvider) {
  $routeProvider
    .when('/news', {
      controller:'NewsCtrl',
      templateUrl:'views/news-list.html'
    })
    .when('/publications', {
      controller:'PublicationCtrl',
      templateUrl:'views/publication-list.html'
    })
    .when('/contact', {
      templateUrl:'views/contact.html'
    })
    .when('/researchers', {
      controller:'ResearcherCtrl',
      templateUrl:'views/researcher-list.html'
    })
    .otherwise({
      redirectTo:'/',
      templateUrl:'views/information.html'
    });
    
    // enable html5Mode for pushstate ('#'-less URLs)
    // $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');
}]);
 
