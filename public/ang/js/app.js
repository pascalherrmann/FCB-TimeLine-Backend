'use strict';

//Module
var toDoApp = angular.module('fcbApp', [
    // App-Module
    'fcbAppControllers',
    'fcbAppFilters',
    'fcbAppServices',
    'fcbAppDirectives',
    // Angular-Erweiterungen/Frameworks
    'ngRoute',
    'ngCookies',
    //weitere
    'ui.bootstrap'
]);

// Routing
toDoApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'html/start.html',
            controller: 'StartController'
        }).
        when('/match/:ID', {
            templateUrl: 'html/match.html',
            controller: 'MatchController'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);
