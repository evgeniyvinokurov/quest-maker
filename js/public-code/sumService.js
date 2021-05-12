var sumService = function(){
	/**
	 * Calculate a 32 bit FNV-1a hash
	 * Found here: https://gist.github.com/vaiorabbit/5657561
	 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
	 *
	 * @param {string} str the input value
	 * @param {boolean} [asString=false] set to true to return the hash value as 
	 *     8-digit hex string instead of an integer
	 * @param {integer} [seed] optionally pass the hash of the previous chunk
	 * @returns {integer | string}
	 */
	function hashFnv32a(str, asString, seed) {
	    /*jshint bitwise:false */
	    var i, l,
	        hval = (seed === undefined) ? 0x811c9dc5 : seed;

	    for (i = 0, l = str.length; i < l; i++) {
	        hval ^= str.charCodeAt(i);
	        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
	    }

	    if (asString) {
	        // Convert to 8 digit hex string
	        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
	    }

	    return hval >>> 0;
	}

	this.countObject = function(objs) {
		var obj = objs;

		if (typeof(obj.sum) == "undefined") {
			obj.sum = this.get_sum(obj.name);
		}

		return obj;
	};

	this.countObjects = function(objs) {
		var objs_to_add = [];
		var self = this;

		$.each(objs, function(i, obj){			
			var obj_to_add = obj;
			obj_to_add = self.countObject(obj_to_add)
			objs_to_add.push(obj);
		})

		return objs_to_add;
	};

	this.get_sum = function(name){
		return 1*hashFnv32a(name + new Date() + Math.random());
	}
}

window.sumService = new sumService();