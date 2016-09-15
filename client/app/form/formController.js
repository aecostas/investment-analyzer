/*jshint  latedef:false*/

(function() {
    'use strict';
    angular.module('app.form')
        .controller('form.FormController', FormController);
         
    FormController.$inject = [
	'$scope',
	'restclient.restclientService'
    ];
    
    function FormController($scope, restClient)
    {
	restClient.analize().then(function(response) {
	    console.warn("Promise success: ", response);
	}, function(response) {
	    console.warn("Promise error: ", response);
	});
    }

})();
