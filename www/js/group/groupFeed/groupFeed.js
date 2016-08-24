'use strict';

angular.module('main').controller('GroupFeedCtrl',['$scope', '$stateParams', 'GroupFactory', 'MediaService', '$ionicNavBarDelegate', 'GroupService', "MessageFactory", '$ionicScrollDelegate', '$timeout', function ($scope, $stateParams, GroupFactory, MediaService, $ionicNavBarDelegate, GroupService, MessageFactory, $ionicScrollDelegate, $timeout) {

  function filter () {
    var media = MediaService.get();
    if ($scope.view == 'chat') {
      media = media.map(function(el){
        if (el.mediaType !== 'message') {
          el.body = 'Sent a ' + el.mediaType
        }
        return el;
      })
    }
    MediaService.set(media);
  }

  var unbindGroup;
  var unbindMedia;
  $scope.$on("$ionicView.enter", function () {
   // potential bug
   $(document).ready(function(){
      $ionicScrollDelegate.scrollBottom();
   })
   $scope.newMessage = {};
   $scope.view = 'chat';
   $scope.groupCode = $stateParams.groupCode;

   if($scope.group){
    if($scope.group.groupCode === $stateParams.groupCode) return;
    else {
      unbindGroup();
      unbindMedia();
    }
   }

    GroupService.getGroup($stateParams.groupCode)
    .then(function(group){
      return group.$bindTo($scope, 'group');
    })
    .then(function(ub){
      unbindGroup = ub;
      return GroupService.getGroupMembers($stateParams.groupCode)
    })
    .then(function(members){
      $scope.members = members;
      return GroupService.getGroupCollage($stateParams.groupCode);
    })
    .then(function(groupCollage){
      return groupCollage.$bindTo($scope, 'mediaObjects');
    })
    .then(function(ub){
      unbindMedia = ub;
      var mediaArr = [];
      for (var media in $scope.mediaObjects) {
         if ($scope.mediaObjects[media] && $scope.mediaObjects[media].mediaType && media !== '$id' && media !== '$priority')
         mediaArr.push($scope.mediaObjects[media]);
      }

       MediaService.set(mediaArr);
       filter();
    })
    .catch(function(err){
      console.error(err);
    });

  });

  $scope.createNewMessage = function () {
    if ($scope.newMessage.body.length < 1) {
      return;
    }
    $scope.newMessage.timeStamp = Date.now()
    MessageFactory.createNewMessage($scope.newMessage, $scope.groupCode);
    $timeout(function(){
      $scope.newMessage.body = "";
    })
  }

  $scope.$watch('mediaObjects', function(){
    $ionicScrollDelegate.scrollBottom()
  })

  $scope.toggleView = function(view){
    $scope.view = view;
  }

}]);

