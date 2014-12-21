require('sylvester');

module.exports = function (stylecow) {

	stylecow.addTask({
		forBrowsersLowerThan: {
			explorer: 9.0
		},
		filter: {
			type: 'Declaration',
			name: 'transform'
		},
		fn: function (declaration) {
			var block = declaration.parent({type: 'Block'});
			var matrix = [];

			declaration.search({type: 'Function'}).forEach(function (fn) {
				var args = fn.toArray();

				switch (fn.name) {
					case "rotate":
						if (args[0].indexOf('deg') !== -1) {
							var deg = parseInt(args[0], 10);

							if (deg < 0) {
								deg += 360;
							}

							switch (deg) {
								case 90:
									stylecow.utils.addMsFilter(block, 'progid:DXImageTransform.Microsoft.BasicImage(rotation=1)');
									break;

								case 180:
									stylecow.utils.addMsFilter(block, 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)');
									break;

								case 270:
									stylecow.utils.addMsFilter(block, 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)');
									break;

								case 360:
									stylecow.utils.addMsFilter(block, 'progid:DXImageTransform.Microsoft.BasicImage(rotation=4)');
									break;

								default:
									matrix.push(getMatrix(fn.name, args));
							}
						} else {
							matrix.push(getMatrix(fn.name, args));
						}
						break;

					case "scaleX":
						if (args[0] == -1) {
							stylecow.utils.addMsFilter(block, 'flipH');
						} else {
							matrix.push(getMatrix(fn.name, args));
						}
						break;

					case "scaleY":
						if (args[0] == -1) {
							stylecow.utils.addMsFilter(block, 'flipV');
						} else {
							matrix.push(getMatrix(fn.name, args));
						}
						break;
	
					case "scale":
						if (args[0] == -1 && args[1] == -1) {
							stylecow.utils.addMsFilter(block, 'flipH, flipV');
						} else {
							matrix.push(getMatrix(fn.name, args));
						}
						break;

					case "matrix":
					case "skew":
					case "skewX":
					case "skewY":
						matrix.push(getMatrix(fn.name, args));
						break;
					}
			});


			if (matrix.length) {
				var m = matrix[0];

				for (var k = 0; k < matrix.length; k++) {
					if (matrix[k+1]) {
						m = m.x(matrix[k+1]);
					}
				}

				stylecow.utils.addMsFilter(block, 'progid:DXImageTransform.Microsoft.Matrix(sizingMethod="auto expand", M11 = ' + m.elements[0][0] + ', M12 = ' + m.elements[0][1] + ', M21 = ' + m.elements[1][0] + ', M22 = ' + m.elements[1][1] + ')');
			}
			
		}
	});
};

function toRadian (value) {
	if (value.indexOf('deg') !== -1) {
		return parseFloat(value, 10) * (Math.PI * 2 / 360);
	}

	if (value.indexOf('grad') !== -1) {
		return parseFloat(value, 10) * (Math.PI/200);
	}

	return parseFloat(value, 10);
};

function getMatrix (fnName, values) {
	var a;

	switch(fnName) {
		case 'matrix':
			return $M([
				[values[0], values[2], 0],
				[values[1], values[3], 0],
				[0, 0, 1]
			]);

		case 'rotate':
			a = toRadian(values[0]);

			return $M([
				[Math.cos(a), -Math.sin(a), 0],
				[Math.sin(a), Math.cos(a), 0],
				[0, 0, 1]
			]);

		case 'scale':
			return $M([
				[values[0], 0, 0],
				[0, values[0], 0],
				[0, 0, 1]
			]);

		case 'scaleX':
			return $M([
				[values[0], 0, 0],
				[0, 1, 0],
				[0, 0, 1]
			]);

		case 'scaleY':
			return $M([
				[1, 0, 0],
				[0, values[0], 0],
				[0, 0, 1]
			]);

		case 'skew':
			a = toRadian(values[0]);

			return $M([
				[1, 0, 0],
				[Math.tan(a), 1, 0],
				[0, 0, 1]
			]);

		case 'skewX':
			a = toRadian(values[0]);

			return $M([
				[1, Math.tan(a), 0],
				[0, 1, 0],
				[0, 0, 1]
			]);

		case 'skewY':
			a = toRadian(values[0]);

			return $M([
				[1, 0, 0],
				[Math.tan(a), 1, 0],
				[0, 0, 1]
			]);
	}
};
