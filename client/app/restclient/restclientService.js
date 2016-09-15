(function() {
    'use strict';

    angular
        .module('app.restclient')
        .factory('restclient.restclientService', restclientService);

    restclientService.$inject = [
	'$http',
	'$q',
	'$rootScope',
    ];

    function restclientService($http, $q, $rootScope) {

	var service = {
	    analize: analize,
	}

	function analize() {
	    return $q(function(resolve, reject) {
		$http({
		    method: 'GET',
		    url: '/dummy'
		}).then(function successCallback(response) {
		    console.warn("==== Received response: ", response);
		    resolve(response);
		    // this callback will be called asynchronously
		    // when the response is available
		}, function errorCallback(response) {
		    console.warn("==== error http: ", response);
		    reject(response);
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	    });
	}

	return service;
    }

})();
