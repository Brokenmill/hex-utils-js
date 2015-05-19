this.hexU = this.hexU || {};

(function() {
	
	function HexMap(columns, rows, hexDetails, orientation, options) {
		if (options.debug) {
			console.log("Create Hexmap with the following hexDetails:");
			console.log(hexDetails);
		}
		
		this.getTiles = function() {
			var rowArray = [];
			var _x, _y;
			for (var i = 0; i < rows; i++) {
				_y = i * (hexDetails.height - hexDetails.c);
		
				// on odd iterations, we start with an offset of 1 half of hex's height
				if (i % 2 != 0) {
					_x = hexDetails.width / 2;
				} else {
					_x = 0;
				}
				var columnArray = [];
				for (var j = 0; j < columns; j++) {
					columnArray.push( { x: _x, y: _y} );
					_x += hexDetails.width;
				}
				rowArray.push(columnArray);
			}
			return rowArray;
		}
	}
	
	hexU.HexMap = HexMap;
	
}());