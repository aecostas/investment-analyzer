/*jshint  latedef:false*/

(function() {
    'use strict';
    angular.module('app.sectors')
        .controller('sectors.SectorsController', SectorsController);
         
    SectorsController.$inject = [
	'$scope',
	'restclient.restclientService'
    ];
    
    function SectorsController($scope, restClient)
    {
	console.warn("Running sectors controller");
	restClient.analize().then(function(response) {
	    console.warn("Promise success: ", response);
	}, function(response) {
	    console.warn("Promise error: ", response);
	});
    }

})();
