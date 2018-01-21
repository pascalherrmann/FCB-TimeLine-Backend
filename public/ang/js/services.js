var services = angular.module('fcbAppServices', []);

	services.factory('MatchesFactory', ['$http',function($http) {
		return {
			getAll : function() {
				return $http.get('/matches');
			},
			create : function(todoData) {
				return $http.post('/matches', todoData);
			},
			delete : function(id) {
				return $http.delete('/matches/' + id);
			}
		}
	}]);
