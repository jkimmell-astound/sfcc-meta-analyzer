const fs = require('fs');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();

let results = {};

fs.readFile(__dirname + '/system-objecttype-extensions.xml', function (err, data) {
    parser.parseString(data, function (err, result) {
	if (result.metadata['type-extension']) {
	    result.metadata['type-extension'].forEach((typeExt) => {
		const typeID = typeExt['$']['type-id'];
		const systemAttributesContainer = typeExt['system-attribute-definitions'];
		const customAttributesContainer = typeExt['custom-attribute-definitions'];

		// console.log(customAttributesContainer);

		if (!results[typeID]) {
		    results[typeID] = {
			system: [],
			custom: []
		    };
		}

		if (systemAttributesContainer) {
		    systemAttributesContainer.forEach((systemAttributes) => {
			systemAttributes['attribute-definition'].forEach((systemAttribute) => {
			    const sysAttributeID = systemAttribute['$']['attribute-id'];
			    results[typeID].system.push(sysAttributeID);
			});
		    });
		}

		if (customAttributesContainer) {
		    customAttributesContainer.forEach((customAttributes) => {
			customAttributes['attribute-definition'].forEach((customAttribute) => {
			    let values = [];
			    if (customAttribute['value-definitions']) {
				const valuesToAdd = customAttribute['value-definitions'].pop()['value-definition'];

				valuesToAdd.forEach((value) => {
				    values.push({
					display: value.display.pop(),
					value: value.value.pop()
				    })
				});

				console.log(values);
			    }
			    const customAttrObj = {
				id: customAttribute['$']['attribute-id'],
				name: customAttribute['display-name'].pop()['_'],
				type: customAttribute['type'].pop(),
				localizable: customAttribute['localizable-flag'] ? customAttribute['localizable-flag'].pop() : '',
				mandatory: customAttribute['mandatory-flag'] ? customAttribute['mandatory-flag'].pop() : ''
			    }
			    console.log(customAttribute);
			    console.log(customAttrObj);
			    const customAttributeID = customAttribute['$']['attribute-id'];
			    results[typeID].custom.push(customAttributeID);
			});
		    });
		}
	    });
	}


	// console.log(results);
    });
});