//--------------------------signup----------------------------//
var app = angular.module('loginapp', []);
app.controller('signupController', function($scope,$http,$window){

  $scope.signup = function(reg){
  	$http({
  		method : 'POST',
  		url : 'postsignup',
  		data : $scope.reg
  	}).then(function success(response){
      //alert('Registered Successfully');
      $scope.reg = {};
       $window.location.href='/'
  	},function error(response){
      alert('Registration Failed, Please try again');
  	});
  }
});


//------------------------login---------------------------------//
app.controller('loginController', function($scope,$http,$window){

  $scope.login = function(log){
    $http({
      method : 'POST',
      url : 'postlogin',
      data : $scope.log
    }).then(function success(response){
      //alert('Registered Successfully');

      window.location.href='/home'
    },function error(response){
      alert('Registration Failed, Please try again');
      $scope.log={};
    });
  }
});