if (typeof UI !== 'undefined') {
	UI.registerHelper('$eq', function(a, b) {
		return (a === b); //Only text, numbers, boolean - not array & objects
	});

	UI.registerHelper('$eq', function(a, b) {
		return (a === b);  
	});
  
	UI.registerHelper('$active', function(a, b) {
		return (a === b) ? 'active' : '';
	});

  UI.registerHelper('$exists', function (a) {
    return ( a !== undefined);
  });

  UI.registerHelper('$lt', function (a, b) {
    return (a < b);
  });

  UI.registerHelper('$gt', function (a, b) {
    return (a > b);
  });

  UI.registerHelper('$lte', function (a, b) {
    return (a <= b);
  });

  UI.registerHelper('$gte', function (a, b) {
    return (a >= b);
  });

  UI.registerHelper('$and', function (a, b) {
    return (a && b);
  });

  UI.registerHelper('$or', function (a, b) {
    return (a || b);
  });

  UI.registerHelper('$not', function (a) {
    return (!a);
  });
  
	UI.registerHelper('$', function() {
		return Helpers.superScope;
	});

	UI.registerHelper("$mapped", function(arr) {
		if (!Array.isArray(arr)) {
			try {
				arr = arr.fetch()
			} catch (e) {
				console.log("Error in $mapped: perhaps you aren't sending in a collection or array.")
				return [];
			}
		}

		var $length = arr.length;

		var mappedArray = arr.map(function(item, index) {
			if (typeof(item) != 'object') {
				var temp = item;
				item = {};
				item.$this = temp;
			}

			item.$length = $length;
			item.$index = index;
			item.$first = index === 0;
			item.$last = index === $length - 1;
			return item;
		});

		return mappedArray || [];
	});
}