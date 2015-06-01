this.hexU = this.hexU || {};

(function() {
	
	function HexMap(columns, rows, hexDetails, orientation, options) {
		options = options || {};
		
		var Orientations = { ODD_R : "odd-r" };
		
		var oddR_directions = [
			[ { c:  1,  r: 0 }, { c:  0,  r: -1 }, { c: -1,  r: -1 },
			  { c: -1,  r: 0 }, { c: -1,  r:  1 }, { c:  0,  r:  1 } ],
			[ { c:  1,  r: 0 }, { c:  1,  r: -1 }, { c:  0,  r: -1 },
			  { c: -1,  r: 0 }, { c:  0,  r:  1 }, { c:  1,  r:  1 } ]
		];

		var oddR_diagonals = [
			[ { c:  1,  r: -1 }, { c:  0,  r: -2 }, { c: -2,  r: -1 },
			  { c: -2,  r:  1 }, { c:  0,  r:  2 }, { c:  1,  r:  1 } ],
			[ { c:  2,  r: -1 }, { c:  2,  r:  1 }, { c:  0,  r:  2 },
			  { c: -1,  r:  1 }, { c: -1,  r: -1 }, { c:  0,  r: -2 } ],
		];
	
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
		
		/**
		* Transforms an (x, y) screen coordinate to a matrix position in the hex map.
		*/
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
		
		/**
		* checks if the given (column, row) pair is within the boundaries of the hex map.
		*/
		this.isPosValid = function(c, r) {
			return (c >= 0 && c < columns) && (r >= 0 && r < rows);
		}
		
		/**
		* transforms the given position its cube representation
		*/
		this.toCube = function(c, r) {
			var _x = -1;
			var _y = -1;
			var _z = -1;
			
			if (orientation === Orientations.ODD_R) {
				_x = c - (r - (r & 1)) / 2;
				_z = r;
				_y = -_x - _z;
			}
			
			return { x: _x, y: _y, z: _z};
		}
		
		/**
		* transforms the given cube position to this map's representation
		*/
		this.fromCube = function(x, y, z) {
			var _c = -1;
			var _r = -1;
			
			if (orientation === Orientations.ODD_R) {
				_c = x + (z - (z&1)) / 2;
				_r = z;
			}
			
			return {c: _c, r: _r}
		}
		
		this.getNeighbor = function(c, r, direction) {
			var parity = r & 1;
			
			var dir;
			switch (orientation) {
				case Orientations.ODD_R:
					dir = oddR_directions[parity][direction];
					break;
				default:
					dir = { c: 0, r: 0 };
					if (options.debug)
					console.warn("getNeighbor: Map orientation is not valid or not supported:'" + orientation + "'");
			}
			
			
			return { c: (c + dir.c), r : (r + dir.r) };
		}

		this.getDiagonal = function(c, r, direction) {
			var parity = r & 1;
			
			var dir;
			switch (orientation) {
				case Orientations.ODD_R:
					dir = oddR_diagonals[parity][direction];
					break;
				default:
					dir = { c: 0, r: 0 };
					console.warn("getDiagonal: Map orientation is not valid or not supported:'" + orientation + "'");
			}
			
			return { c: (c + dir.c), r : (r + dir.r) };
		}
	}
	
	hexU.HexMap = HexMap;
	
}());