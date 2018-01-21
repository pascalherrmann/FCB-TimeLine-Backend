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


	services.factory('PinsFactory', ['$http',function($http) {
		return {
			getPinsForMatch : function(matchID) {
				return $http.get('/pins/'+matchID);
			},
			create : function(todoData) {
				return $http.post('/matches', todoData);
			},
			delete : function(id) {
				return $http.delete('/pins/' + id);
			}
		}
	}]);
