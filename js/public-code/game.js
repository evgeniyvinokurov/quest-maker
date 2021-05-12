game = {};


// Пересчитать контрольную сумму отрисованного кэша
game.recompute = function(){
	game.sum = 0;

	if(game.edit_mode)	
	{
		$.each($(".output .item.selected"), function(i, item){
			var sum = $(item).attr('sum');
			game.sum += sum*1;
		});
	}
	else
	{
		$.each($(".game .item.selected"), function(i, item){
			var sum = $(item).attr('sum');
			game.sum += sum*1;
		});
	}
};

/*
// Добавить группу объектов в игровой кэш
game.add_objs = function(objs){
	

	this.render_objs(objs);
};
*/


// Отрисовать группу объектов
game.render_objs = function(objs){
	var self = this;
	var objects_to_render = objs;

	if(game.edit_mode)	
	{
		$.each(objects_to_render, function(i, obj){

			self.$output.append("<div class='item' sum='" + obj.sum + "' style='background-color:" + obj.color + ";'>" + obj.name + "</div>");					

		});
	}
	else
	{
		$.each(objects_to_render, function(i, obj){
			if(game.rendered.indexOf(obj.sum + obj.name) == -1)
			{
				self.$game.append("<div class='item' sum='" + obj.sum + "' style='background-color:" + obj.color + ";'>" + obj.name + "</div>");	

				game.rendered.push(obj.sum + obj.name);
			}
		});
	}	
};

window.game = game;