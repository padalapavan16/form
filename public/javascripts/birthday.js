var app = angular.module('birthdayApp',[]);
app.controller('birthdayController',['$scope','$http' ,function($scope,$http){
	

$http({
	method:'GET',
	url:'/getbirth',
}).then(function success(response){
	//alert('hi');
	//console.log(response.data);
	$scope.user=response.data;
},function error(response){
	alert("error occured")
})



$scope.sendmail=function(birth){
      $http({
      method:'POST',
      url:'/postbirthday',
      data:$scope.birth
	}).then(function success(response){
		//alert('sent')
		$scope.user.push(response.data);
		$scope.birth={};
	},function error(response){
		alert('failed')
	})
}
}]);