var directives = angular.module('fcbAppDirectives', []);

directives.directive('navigation', function () {
    return {
        restrict: "E",
        templateUrl: "html/navigation-directive.tpl.html"
    };
});
