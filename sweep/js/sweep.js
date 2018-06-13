var mineArr;
var resMine = 0;
var numFlag = 0;
var timer = null;
var resblock = 0;
var total = 0;
var start = true;
$(function() {
	$('input[name="help"').click(function() {
		$('.help').toggleClass('display');
	});
	$('input[name="define"').click(function() {
		var row = parseInt($('input[name="row"]').val());
		var col = parseInt($('input[name="col"]').val());
		initMine(row, col, Math.ceil(row * col / 10));
		$('.record').fadeIn(500);

	});
	$('input[name="easy"]').click(function() {
		initMine(10, 10, 10);
		$('.record').fadeIn(500);
	});
	$('input[name="normal"]').click(function() {
		initMine(16, 16, 25);
		$('.record').fadeIn(500);
	});
	$('input[name="difficult"]').click(function() {
		initMine(16, 40, 80);
		$('.record').fadeIn(500);
	});

	$('.main').bind('contextmenu', function() {
		return false;
	});

});

function open(y, x) {
	var $click = $("#r" + y + "-c" + x);
	if(mineArr[y][x] == -1) {
		if(!$click.hasClass('flag')) {
			$click.removeClass('hidden').addClass('cbomb');
			end();
			$('.mess').text("你输了！");
			$('.main').unbind('mouseup');
			clearTimeout(timer);
			start = true;
		}
	} else if(mineArr[y][x] > 0) {
		if(!$click.hasClass('flag')) {
			if($click.hasClass('hidden')) {

				$click.removeClass('hidden').removeClass('check').html(mineArr[y][x]).addClass('color' + mineArr[y][x]);
				resblock--;
			}

		}
	} else if(mineArr[y][x] == 0) {

		if($click.hasClass('hidden')) {
			$click.removeClass('hidden');
			resblock--;
			for(var i = -1; i <= 1; i++) {
				for(var j = -1; j <= 1; j++) {
					if(i == 0 && j == 0) continue;
					open(y + i, x + j);
				}
			}
		}

	}

};

function doubleClick(y, x) {
	var count = 0;
	var $click1 = $("#r" + y + "-c" + x);
	if(mineArr[y][x] > 0 && !$click1.hasClass('hidden')) {
		for(var i = -1; i <= 1; i++) {
			for(var j = -1; j <= 1; j++) {
				if(i == 0 && j == 0) continue;
				var $click = $("#r" + (y + i) + "-c" + (x + j));
				if($click.hasClass('flag')) {
					count++;
				}
			}
		}
		if(count >= mineArr[y][x]) {
			for(var i = -1; i <= 1; i++) {
				for(var j = -1; j <= 1; j++) {
					if(i == 0 && j == 0) continue;
					var $click = $("#r" + (y + i) + "-c" + (x + j));
					if($click.hasClass('flag') && mineArr[y + i][x + j] != (-1)) {
						end();
						$('.mess').text("你输了！");
						$('.main').unbind('mouseup');
						clearTimeout(timer);
						start = true;
					} else if(mineArr[y + i][x + j] > 0) {
						if($click.hasClass('hidden')) {

							$click.removeClass('hidden').removeClass('check').html(mineArr[y + i][x + j]).addClass('color' + mineArr[y + i][x + j]);
							resblock--;
						}
					} else if(mineArr[y + i][x + j] == 0) {
						open(y + i, x + j);
					}
				}
			}
		}

	}
}

function mark(y, x) {
	var $click = $("#r" + y + "-c" + x);
	if($click.hasClass('hidden')) {
		if($click.hasClass('flag')) {
			$click.removeClass('flag').addClass('check');
			numFlag--;
			resMine++;
		} else if($click.hasClass('check')) {
			$click.removeClass('check');
		} else {
			$click.addClass('flag');
			numFlag++;
			resMine--;
		}
	}
}

function end() {
	for(var i = 1; i < mineArr.length - 1; i++) {
		for(var j = 1; j < mineArr[0].length - 1; j++) {
			var $click = $("#r" + i + "-c" + j);
			if(mineArr[i][j] == -1) {
				if(!$click.hasClass('cbomb')) {
					$click.removeClass('hidden').addClass('bomb');
				}
			}
			if(mineArr[i][j] > 0) {
				$click.removeClass('hidden').removeClass('check').html(mineArr[i][j]).addClass('color' + mineArr[i][j])
			}
			if(mineArr[i][j] == 0) {
				$click.removeClass('hidden');
			}
		}
	}
}

function win() {
	if(total == resblock || total == (resblock + numFlag)) {
		end();
		$('.mess').text("你赢了！");
		$('#remain').text(0);
		clearTimeout(timer);
		start = true;
	}
}

function initMine(y, x, num) {
	clearTimeout(timer);
	start = true;
	$('.main').unbind('mouseup');
	numFlag = 0;
	$('#userTime').text(0);
	resblock = x * y;
	total = resMine = num;
	mineArr = new Array(y + 2);
	$.each(mineArr, function(n) {
		mineArr[n] = new Array(x + 2);
	})
	for(var i = 0; i < y + 2; i++) {
		for(var j = 0; j < x + 2; j++) {
			mineArr[i][j] = 0;
		}
	}
	while(num > 0) {

		var i = Math.ceil(Math.random() * y);
		var j = Math.ceil(Math.random() * x);
		if(mineArr[i][j] != -1) {
			mineArr[i][j] = -1;
			num--;
		}
	}
	for(var i = 1; i <= y; i++) {
		for(var j = 1; j <= x; j++) {
			if(mineArr[i][j] != -1) {
				if(mineArr[i - 1][j - 1] == -1) {
					mineArr[i][j]++;
				}
				if(mineArr[i - 1][j] == -1) {
					mineArr[i][j]++;
				}
				if(mineArr[i - 1][j + 1] == -1) {
					mineArr[i][j]++;
				}

				if(mineArr[i][j - 1] == -1) {
					mineArr[i][j]++;
				}
				if(mineArr[i][j + 1] == -1) {
					mineArr[i][j]++;
				}

				if(mineArr[i + 1][j - 1] == -1) {
					mineArr[i][j]++;
				}
				if(mineArr[i + 1][j] == -1) {
					mineArr[i][j]++;
				}
				if(mineArr[i + 1][j + 1] == -1) {
					mineArr[i][j]++;
				}

			}

		}
	}
	var panel = "";
	var count = 0;

	for(var i = 1; i <= y; i++) {
		for(var j = 1; j <= x; j++) {
			panel += '<div class="hidden" id="r' + i + '-c' + j + '"></div>';
			count++;
		}
	}
	$('.main').html(panel).width(x * 20).height(y * 20);
	$('#remain').text(resMine);
	$('.mess').text("");

	$('.main').bind('mouseup', function(e) {
		var $div = $(e.target);
		var $id = $div.attr('id');
		var y = parseInt($id.substring(1, $id.indexOf('-')));
		var x = parseInt($id.substring($id.indexOf('c') + 1));
		if(start) {
			var time = 0;
			timer = setInterval(function() {
				time++;
				$('#userTime').text(time);
			}, 1000);
		}
		if(e.which == 1) {
			open(y, x);
		} else if(e.which == 3) {
			mark(y, x);
		}
		if(e.button == 1) {
			doubleClick(y, x);
		}
		start = false;
		$('#remain').text(resMine);
		win();
	});
};