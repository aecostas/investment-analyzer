var regionCodes = {};
var sectorCodes = {};

regionCodes['Estados Unidos'] = 'USA';
regionCodes['Iberoamérica'] = 'LATAM';
regionCodes['Reino Unido'] = 'GB';
regionCodes['Canadá'] = 'CANADA';
regionCodes['Zona Euro'] = 'EUROZONE';
regionCodes['Europe - ex Euro'] = 'EUROEXEURO';
regionCodes['África'] = 'AFRICA';
regionCodes['Oriente Medio'] = 'MIDDLEEAST';
regionCodes['Japón'] = 'JAPAN';
regionCodes['Australasia'] = 'AUSTRALASIA';
regionCodes['Asia - Desarrollada'] = 'ASIADEVELOPED';
regionCodes['Asia - Emergente'] = 'ASIAEMERGING';
regionCodes['Europe emergente'] = 'EUROEMERGING';

sectorCodes['Materiales Básicos'] = 'BASICMATERIALS';
sectorCodes['Consumo Cíclico'] = 'CYCLICALCONSUMER';
sectorCodes['Servicios Financieros'] = 'FINANCIAL';
sectorCodes['Inmobiliario'] = 'INMO';
sectorCodes['Consumo Defensivo'] = 'DEFENSIVE';
sectorCodes['Salud'] = 'HEALTH';
sectorCodes['Servicios Públicos'] = 'PUBLICSERVICES';
sectorCodes['Servicios de Comunicación'] = 'COM';
sectorCodes['Energía'] = 'ENERGY';
sectorCodes['Industria'] = 'INDUSTRY';
sectorCodes['Tecnología'] = 'TECHNOLOGY';


module.exports = {
    /**
     * Translates the given string into 
     * an internal code representing
     * a sector
     *
     * @param {string} sector - Parsed sector
     * @return {string} Translated string
     */
    getRegionCode: function(region) {
	if (regionCodes[region]) {
	    return regionCodes[region];
	} else {
	    return region;
	}
    },

    /**
     * Translates the given string into 
     * an internal code representing
     * a sector
     *
     * @param {string} sector - Parsed sector
     * @return {string} Translated string
     */
    getSectorCode: function(sector) {
	if (sectorCodes[sector]) {
	    return sectorCodes[sector];
	} else {
	    return sector;
	}
    },
};// module.exports
