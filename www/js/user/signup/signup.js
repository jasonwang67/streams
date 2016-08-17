'use strict';

angular.module('main')
.controller('SignupCtrl', function ($scope, $state, $log, Auth, UserFactory, $rootScope) {

  $scope.signUp = function(userInfo) {
    var uid;
    $scope.error = null;
    Auth.$createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then(function(userData) {
        uid = userData.uid;
        UserFactory.addUser(userData.uid, userInfo.name, userInfo.email, userInfo.phone);
      })
      .then(function() {
        Auth.$signInWithEmailAndPassword(
            userInfo.email, userInfo.password
        );
      })
      .then(function() {
          $rootScope.loggedIn = true;
          return UserFactory.getUser(uid);

      })
      .then(function(user){
        $rootScope.profile = user;
        $rootScope.profile.uid = uid;
        $state.go('tab.camera');
      })
      .catch(function(error) {
          $scope.error = error;
          console.error("Error: ", error);
      });

  };
});

