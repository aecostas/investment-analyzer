var vectorSource = new ol.source.Vector({
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
});

var element = document.getElementById('popup');

var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false
});

$(element).popover({
    'placement': 'top',
    'html': true,
    'content': ''
});

var map = new ol.Map({
    layers: [
	new ol.layer.Tile({
	    source: new ol.source.OSM()
	}),
	vectorLayer
    ],
    target: 'map',
    controls: ol.control.defaults({
	attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
	    collapsible: false
	})
    }),
    view: new ol.View({
	center: [0, 0],
	zoom: 2
    })
});

map.addOverlay(popup);

map.on("click", function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
					    function(feature, layer) {
						return feature;
					    });

    if (feature) {

	var geometry = feature.getGeometry();
	var coord = geometry.getFirstCoordinate();
	popup.setPosition(coord);
	$(element).data('bs.popover').options.content = feature.getProperties().region + "<br />" + feature.getProperties().value
	$(element).popover('show');
    } else {
	$(element).popover('hide');
    }

});

var funds = []
funds.push({
    url:'http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F00000MKIO&tab=3',
    amount: 1000,
    percentage: 20,
})
funds.push({
    url:'http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F00000HLBC&tab=3',
    amount: 1000,
    percentage: 10,
})
funds.push({
    url:'http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F0GBR04SLW&tab=3',
    amount: 3000,
    percentage: 10,
})
funds.push({
    url:'http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F00000HLB6&tab=3',
    amount: 5000,
    percentage: 15,
})
funds.push({
    url:'http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F0GBR04G6K&tab=3',
    amount:2000,
    percentage: 20,
})
funds.push({
    url:'http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F000001AAQ&tab=3',
    amount:1000,
    percentage: 35
})


/**
 * Gets the color that represents how far
 * is the given value (in a range of [0,100])
 * from the threshold resulting from 100/divisions
 *
 * @param {int} value - Value to translate into a color
 * @param {int} divisions - Number of divisions
 * @return {Array<float>} - color [R,G,B, alpha]
 */
function getColorFromRange(value, divisions) {
    var interval = 100/divisions;
    var margin = interval*0.3;

    if ((value > (interval - margin)) &&
	(value < (interval + margin))) {
	color = [0,  255,0, 0.7]

    } else if (value < (interval-margin)) {
	color = [ 0,0, 155, 0.7]
    } else {
	color = [ 255,0, 0, 0.7]
    }

    return color;
} // getColorFromRange


$.ajax({
    type: "POST",
    url: "http://localhost:8000/analysis",
    data: JSON.stringify(funds),
    contentType: "application/json",
    success: function( data ) {
	var features = []
	var arealength =  Object.keys(data.regions).length;

	Object.keys(data.regions).forEach(function(key) {
	    if (data.regions[key].coords.lng !== undefined){
		var style = new ol.style.Style({
		    stroke: new ol.style.Stroke({
			color: '#b30734',
			width: 0
		    }),
		    fill: new ol.style.Fill({
			color: [255, 0, 0, .7]
		    })
		});

		var feature = new ol.Feature()
		feature.setGeometry(new ol.geom.Circle(ol.proj.transform([data.regions[key].coords.lng, data.regions[key].coords.lat] , 'EPSG:4326', 'EPSG:3857'), 800000))

		feature.set("region", key);
		feature.set("value", data.regions[key].value)
		style.getFill().setColor(getColorFromRange(data.regions[key].coords.count, arealength))
		feature.setStyle(style);
    		features.push(feature);
	    } else {
		console.warn("Discarding: " + key);
	    }
	})

	vectorSource.addFeatures(features);
    }
});
