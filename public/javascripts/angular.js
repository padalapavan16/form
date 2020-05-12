var app = angular.module('myApp',[]);
app.controller('myController',['$scope','$http' ,function($scope,$http){
//$scope.user=[];

$http({
	method:'GET',
	url:'/getuser',
}).then(function success(response){
	//console.log(response.data);
	$scope.user=response.data;
},function error(response){
	alert("error occured")
})



$scope.saveData=function(users){
//$scope.user.push(users);
//console.log($scope.user);
//$scope.users={};

$http({
	method:'POST',
	url:'/postuser',
	data:$scope.users
}).then(function success(response){
	//alert("hi");
	$scope.user.push(response.data);
	$scope.users={};
},function error(response){
	alert("error");
})
}


$scope.removeData=function(users){
	//console.log(users._id)
$http({
	method:'DELETE',
	url:'/deleteuser'+users._id
}).then (function success(response){
   alert("removed")
   var index=$scope.user.indexOf(users);
   $scope.user.splice(index,1);
},function error(response){
  alert("error")
})	
}

//$scope.editData=function(){
	//$scope.edituser=true;
	
$scope.updateData=function(users){
	//console.log(users);
$scope.edituser=false;
$http({
	method:'PUT',
	url:'/edituser'+users._id,
	data:users
}).then(function success(response){
	//alert("hi");
},function error(response){
	alert("error")
}

)}



}])