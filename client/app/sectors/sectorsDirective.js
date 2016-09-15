'use strict';

angular.module('app.sectors')
    .directive('sectorsDemo', function() {
	return {
	    restrict: 'E',
	    template: '<div>hola</div>',
//	    templateUrl: 'app/sectors/views/sectors.html',
	    replace: true,
	    // controller: function(){
	    // 	console.warn("asdfasfasf");
	    // }
	    controller: 'sectors.SectorsController',
	};
    });
