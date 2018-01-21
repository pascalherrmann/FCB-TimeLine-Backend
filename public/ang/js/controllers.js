var controllers = angular.module('fcbAppControllers', []);

controllers.controller('NavigationController', function ($scope, $http, $location, ToDoFactory) {

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

});

controllers.controller('StartController', function ($scope, $http, MatchesFactory) {

    $scope.test = "hi"

    $scope.isCollapsedHorizontal = true

        MatchesFactory.getAll()
        .success(function (data) {
            $scope.matches = data;
            $scope.loading = false;
        });


            $scope.deleteMatch = function (id) {
                console.log(id)
                MatchesFactory.delete(id)
            }

        $scope.sendMatch = function () {

            MatchesFactory.create($scope.match)
            .success(function (data) {
                $scope.loading = false;
                $scope.formData = {};
                $scope.todos = data;
            });
        }



    //
    // test
    //

      $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.options = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.options.minDate = $scope.options.minDate ? null : new Date();
  };

  $scope.toggleMin();

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }

});
