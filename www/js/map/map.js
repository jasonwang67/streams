'use strict';

angular.module('main').controller('MapCtrl', function ($scope, $state, $cordovaGeolocation, MapFactory, MediaService) {
  
  $scope.$on("$ionicView.enter", function () {
    $scope.mediaObjects = MediaService.get();
    console.log($scope.mediaObjects)
    MapFactory.drawMap($scope.mediaObjects);

  });


});

