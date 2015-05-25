this.hexU = this.hexU || {};

(function() {
	
	function HexMap(columns, rows, hexDetails, orientation, options) {
		this.columns = columns;
		this.rows = rows;
		this.hexDetails = hexDetails;
		this.orientation = orientation;
		this.options = options;
		
		if (options.debug) {
			console.log("hexu: Create Hexmap with the following hexDetails: " + JSON.stringify(hexDetails));
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
		
		// thanks to http://stackoverflow.com/users/921224/sebastian-troy
		// for the following answer http://stackoverflow.com/questions/7705228/hexagonal-grids-how-do-you-find-which-hexagon-a-point-is-in
		this.coordToHex = function(x, y) {
			var gridHeight = hexDetails.height - hexDetails.c;
			var halfWidth = hexDetails.width / 2;
			var m = hexDetails.c / halfWidth;
			
			var row = Math.floor(y / gridHeight);
			var column;
			var rowIsOdd = row % 2 == 1;
			
			if (rowIsOdd) {// Yes: Offset x to match the indent of the row
				column = Math.floor((x - halfWidth) / hexDetails.width);
			} else {
				column = Math.floor(x / hexDetails.width);
			}
			
			// Work out the position of the point relative to the box it is in
			var relY = y - (row * gridHeight);
			var relX;

			if (rowIsOdd) {
				relX = (x - (column * hexDetails.width)) - halfWidth;
			} else {
				relX = x - (column * hexDetails.width);
			}
			
			// Work out if the point is above either of the hexagon's top edges
			if (relY < (-m * relX) + hexDetails.c) { // LEFT edge
					row--;
					if (!rowIsOdd)
						column--;
				}
			else if (relY < (m * relX) - hexDetails.c) { // RIGHT edge
				row--;
				if (rowIsOdd)
					column++;
			}
				
			return {c: column, r : row};
		}
	}
	
	hexU.HexMap = HexMap;
	
}());