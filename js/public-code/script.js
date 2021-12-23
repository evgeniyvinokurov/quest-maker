jQuery(document).ready(function ($) {
	$(document).ready(function(){

		game.$output = $("#testoutput");
		game.$game = $("#game");

		game.sum = 0;

		game.rendered = [];

		var gameEngine = new engine(), testEngine = new engine(), notEmptyTree = false;

		var start = function(){
			game.recompute();
			
			!game.edit_mode ? (function(){
				gameEngine.got_sum_cbs.push(function(objs){
					objs = colorService.paintObjects(objs);
					game.render_objs(objs);
				})
				gameEngine.check_sums(game.sum);
			})() : (function(){
				testEngine.got_sum_cbs.push(function(objs){
					objs = colorService.paintObjects(objs);
					game.render_objs(objs);
				})
				testEngine.check_sums(game.sum);
			})();
		}

		var fillTree = function(ar) {
			var len = ar.length, result = [];

			for (var i = 0; i < len; i++) {
				var haveSums = []; 

				if (ar[i].sum == 0) {
					for(obj of ar[i].objs) {
						haveSums.push(obj.sum);
						result.push({id: obj.sum, parent: "#", text: obj.name})
					}
				}

				if (haveSums.indexOf(ar[i].sum) != -1) {
					for(obj of ar[i].objs) {
						haveSums.push(obj.sum);
						result.push({id: obj.sum, parent: ar[i].sum, text: obj.name})
					}
				} else {

					if (ar[i].name)
						result.push({id: ar[i].sum, parent: "#", text: ar[i].name});

					if (ar[i].objs)
						for(obj of ar[i].objs) {
							haveSums.push(obj.sum);
							result.push({id: obj.sum, parent: ar[i].sum, text: obj.name})
						}
				}
			}

			if (notEmptyTree) {
	 			$('#using_json_2').jstree("destroy");
	 			notEmptyTree = false;
	 		}

			$('#using_json_2').jstree({'core': {
			    'data' : result
			}}).on('loaded.jstree', function () {
				$('#using_json_2').jstree('open_all');
			});

			notEmptyTree = true;
		}

		var showMenu = function(self) {
			$(self).append("<div class='menu'><div class='select' data-action='select'>select</div><div class='dblselect' data-action='dblselect'>double select</div><div class='unselect' data-action='unselect'>unselect</div></div>")
		}

		var removeMenu = function() {
			var allmenus = $(document).find(".menu");
			allmenus.remove();
		}
		

		$(document).on("click", '[name=new-entity]', function(e){
			e.preventDefault();

			var name = $("[name=name]").val();
			var objs = [{name: name}];

			objs = colorService.paintObjects(objs);
			objs = sumService.countObjects(objs);
			
			game.render_objs(objs);
		})

		$(document).on("click", '[name=load-test]', function(e){
			e.preventDefault();

			gameEngine.load(testEngine.sums);
			$("[name=mode]")[0].checked = false;
			game.edit_mode = false;
			game.edit_mode ? $(".edit_mode_on").show() : $(".edit_mode_on").hide();
			$("input[name=start]").hide();

			start();
		})

		$(document).on("click", '[name=add-group]', function(e){
			e.preventDefault();
			var objs_to_combine = [], objs_sum = 0, common_name = "";

			$.each($(".output .item.selected"), function(i, item){
				var sum = $(item).attr('sum');
				objs_sum += sum*1;

				if (common_name != "")
					common_name += "+";

				common_name += $(item).html();
			});

			$.each($(".output .item.dblselected"), function(i, item){
				var sum = $(item).attr('sum');
				var name = $(item).html();
				var obj = {
					name: name,
					sum: sum
				};

				objs_to_combine.push(obj);
			});

			testEngine.set_sum(objs_sum, objs_to_combine, common_name);
			fillTree(testEngine.sums);
		})

		$(document).on("click", '[name=delete-node]', function(e){
			e.preventDefault();
			var sum_to_delete = $('#using_json_2').jstree('get_selected')[0];
			testEngine.delete_sum(testEngine.sums, sum_to_delete);			
			fillTree(testEngine.sums);
		})

		$(document).on("click", '[name=get-node]', function(e){
			e.preventDefault();
			var sum = $('#using_json_2').jstree('get_selected')[0];
			testEngine.check_sums(sum);
		})



		// ИМПОРТ И ЭКСПОРТ
		$(document).on("click", '[name=import]', function(e){
			e.preventDefault();

			var value_to_parse = $("[name=import-export-json]").val();
			var objs = JSON.parse(value_to_parse);

			var engine = game.edit_mode ? testEngine: gameEngine;			
			engine.load(objs);

			fillTree(engine.sums);
		})

		$(document).on("click", '[name=export]', function(e){
			e.preventDefault();

			$("[name=import-export-json]").val(JSON.stringify(testEngine.sums));
		})



		// РЕЖИМ РАБОТЫ ВЕБ ПРИЛОЖЕНИЯ
		$(document).on("change", '[name=mode]', function(e){
			e.preventDefault();

			game.edit_mode = $("[name=mode]")[0].checked;
			game.edit_mode ? $(".edit_mode_on").show() : $(".edit_mode_on").hide();
		})



		// НЕПОСРЕДСТВЕННО САМА ИГРА
		$(document).on("click", '[name=start]', function(e){
			e.preventDefault();			
			$(this).hide();

			var value_to_parse = $("[name=import-export-json]").val();
			var objs = JSON.parse(value_to_parse);
			
			game.edit_mode ? testEngine.load(objs): (gameEngine.load(objs), $("[name=import-export-json]").parent().remove());
			start();
		})

		$(document).on("click", '[name=unselect-all]', function(e){
			e.preventDefault();
			$.each($(".output .item.selected, .output .item.dblselected"), function(i, item){
				$(item).removeClass("selected");
				$(item).removeClass("dblselected");
			});

		})

		$(document).on("click", '.game .item', function(e){
			e.preventDefault();		

			if (game.edit_mode) {	
				showMenu(this);
			} else {
				$(this).toggleClass("selected");
				game.recompute();	
				game.edit_mode ? testEngine.check_sums(game.sum): gameEngine.check_sums(game.sum);
			}
		})

		$(document).on("click", '.output .item', function(e){
			e.preventDefault();
			showMenu(this);
		})

		$(document).on("click", '.select,.dblselect,.unselect', function(e){
			e.preventDefault();
			e.stopPropagation()

			var self = this;			
			var action = $(self).attr("data-action");

			switch(action){
				case "select":
					$(self).parent().parent().removeClass("dblselected");
					$(self).parent().parent().addClass("selected");
					break;
				case "dblselect":
					$(self).parent().parent().removeClass("selected");
					$(self).parent().parent().addClass("dblselected");
					break;
				case "unselect":
					$(self).parent().parent().removeClass("selected");
					$(self).parent().parent().removeClass("dblselected");
					break;
			}	

			game.recompute();	
			game.edit_mode ? testEngine.check_sums(game.sum): gameEngine.check_sums(game.sum);

		 	removeMenu();
		})

		//$(document).on("dblclick", '.output .item', function(e){
			//e.preventDefault();
			//$(this).toggleClass("dblselected");	
		//})
	});	
});


// Одинарное выделение фиксирует текущую сумму
// Каждый объект имеет сумму
// Двойное выделение фиксирует объекты, которые появляются при текущей сумме. 
// Выделить двойным кликом, нажать адд гроуп - записать действие