engine = function(){

	this.sums = [];
	this.got_sum_cbs = [];

	this.got_sum = function(objs) {
		$.each(this.got_sum_cbs, function(i, cb) {
			cb(objs);
		})
	}

	// Загрузить объекты
	this.load = function(imports){
		this.sums = [];
		var self = this;

		$.each(imports, function(i, imports_item){
			self.set_sum(imports_item.sum, imports_item.objs, imports_item.name);
		})
	}

	// Задать контрольную сумму для группы объектов
	this.set_sum = function(sum, objs, common_name){
		this.sums.push({
			sum: sum,
			objs: objs,
			name: common_name
		});
	}

	// Проверить контрольные суммы и подобрать следующие объекты 
	this.check_sums = function(sum){
		var self = this;

		$.each(this.sums, function(i, sum_obj){
			if(sum_obj.sum == sum)
			{
				self.got_sum(sum_obj.objs);
				//game.add_objs(sum_obj.objs);
			}
		});
	}

	this.delete_sum = function(objs, sum){
		var self = this, j = null;

		$.each(objs, function(i, sum_obj){
			if(sum_obj.sum == sum){
				j = i;
			}

			if (sum_obj.objs){
				self.delete_sum(sum_obj.objs, sum);
			}
		});		

		if (j != null)
			objs.splice(j, 1);
	}
}

window.engine = engine;