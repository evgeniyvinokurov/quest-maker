colorService = {};

colorService.get_color = function() {
    /*var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }*/
    return 'white';
};

colorService.paintObject = function(obj) {
	var obj = obj;

	if (typeof(obj.color) == "undefined") {
		obj.color = this.get_color();
	}

	return obj;
};

colorService.paintObjects = function(objs) {
	var objs_to_add = [];
	var self = this;

	$.each(objs, function(i, obj) {
		var obj_to_add = obj;
		obj_to_add = self.paintObject(obj_to_add)
		objs_to_add.push(obj);
	})

	return objs_to_add;
};

window.colorService = colorService;
