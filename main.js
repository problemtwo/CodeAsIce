window.onload = function() {
	var canvas = document.getElementById('input');
	var context = canvas.getContext('2d');

	var fontSize = 20;

	var keys = {
		'capsLock':false,
		'shift':false,
		'ctrl':false,
		'alt':false,
		'meta':false
	};

	var text = '';
	var cursor = 0;
	var selection = -1;

	var keywords = {
		'c':[
			'auto','break','case',
			'const','continue','default','do',
			'else','enum','extern',
			'for','goto','if',
			'long','register','return',
			'short','signed','sizeof','static',
			'switch','typedef','union',
			'unsigned','void','volatile','while'
		],
		'c-special':[
			'char','double','float',
			'int','struct'
		]
	}

	var language = 'c';

	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	/*document.getElementById('fontSize').onkeydown = function(evt) {
		if(evt.keyCode === 13) {
			evt.preventDefault();
			fontSize = parseInt(document.getElementById('fontSize').value) || 20;
			context.font = fontSize+'px Anonymous Pro';
		}
	}

	document.getElementById('language').onkeydown = function(evt) {
		if(evt.keyCode === 13) {
			evt.preventDefault();
			language = document.getElementById('language').trim();
		}
	}*/

	function insert(c) {
		if(selection !== -1) {
			var a = Math.min(cursor,selection);
			var b = Math.max(cursor,selection);
			var start = text.substring(0,a);
			var end = text.substring(b+1);
			text = start + c + end;
			selection = -1;
		}
		else {
			text = text.substring(0,cursor) + c + text.substring(cursor);
		}
		cursor++;
	}

	function keyup(e) {
		if(e.keyCode === 16) {
			keys.shift = false;
		}
		else if(e.keyCode === 17) {
			keys.ctrl = false;
		}
		else if(e.keyCode === 18) {
			keys.alt = false;
		}
		else if(e.keyCode === 20) {
			keys.capsLock = !keys.capsLock;
		}
		else if(e.keyCode === 91) {
			keys.meta = false;
		}
	}

	function keydown(e) {
		var _shift = false;
		if(keys.capsLock || keys.shift) {
			_shift = true;
			if(selection === -1) {
				selection = cursor;
			}
		}
		if(37 <= e.keyCode && e.keyCode <= 40) {
			if(!_shift && selection !== -1) {
				selection = -1;
			}
		}

		if(e.keyCode === 8) {
			if(selection !== -1) {
				var a = Math.min(cursor,selection);
				var b = Math.max(cursor,selection);
				text = text.substring(0,a) + text.substring(b);
				selection = -1;
			}
			else {
				text = text.substring(0,cursor-1) + text.substring(cursor);
				cursor--;
			}
		}
		else if(e.keyCode === 9) {
			e.preventDefault();
			insert('\t');
		}
		else if(e.keyCode === 13) {
			insert('\n');
		}
		else if(e.keyCode === 16) {
			keys.shift = true;
		}
		else if(e.keyCode === 17) {
			keys.ctrl = true;
		}
		else if(e.keyCode === 18) {
			keys.alt = true;
		}
		else if(e.keyCode === 20) {
			keys.capsLock = !keys.capsLock;
		}
		else if(e.keyCode === 32) {
			insert(' ');
		}
		else if(e.keyCode === 37) {
			if(cursor - 1 >= 0 && text[cursor - 1] !== '\n') {
				cursor--;
			}
		}
		else if(e.keyCode === 38) {
			// get current line
			// get previous line
			// compare line lengths
			// figure out where the cursor should be placed

			var i = 0;
			var lineno = 0;
			while(i < cursor) {
				if(text[i] === '\n') { lineno++; }
				i++;
			}
			var lines = text.split('\n');
			if(lineno - 1 >= 0 && lineno < lines.length) {
				var startCursor = cursor;

				var current = lines[lineno];
				var prev = lines[lineno-1];
				while(cursor >= 0 && text[cursor] !== '\n') { cursor--; }
				if(current.length >= prev.length) {
					cursor--;
				}
				else {
					cursor -= (prev.length - current.length);
				}
			}
		}
		else if(e.keyCode === 39) {
			if(cursor + 1 <= text.length && text[cursor] !== '\n') {
				cursor++;
			}
		}
		else if(e.keyCode === 40) {
			// get current line 
			// get next line
			// compare line lengths
			// figure out where the cursor should be placed

			var i = 0;
			var lineno = 0;
			while(i < cursor) {
				if(text[i] === '\n') { lineno++; }
				i++;
			}
			var lines = text.split('\n');
			if(lineno >= 0 && lineno + 1 < lines.length) {
				var startCursor = cursor;

				var current = lines[lineno];
				var next = lines[lineno+1];
				while(cursor < text.length && text[cursor] !== '\n') { cursor++; }
				if(current.length >= next.length) {
					cursor += next.length + 1;
				}
				else if(next.length > current.length) {
					cursor += current.length + 1;
				}
			}
		}
		else if(48 <= e.keyCode && e.keyCode <= 57) {
			if(_shift) {
				insert(")!@#$%^&*("[e.keyCode - 48]);
			}
			else {
				insert((e.keyCode - 48).toString());
			}
		}
		else if(65 <= e.keyCode && e.keyCode <= 90) {
			if(keys.ctrl) {
				if(e.keyCode === 79) {
					e.preventDefault();
					return;
				}
				else if(e.keyCode === 83) {
					e.preventDefault();
					return;
				}
			}
			var value = String.fromCharCode(e.keyCode);
			if(_shift) { insert(value); }
			else { insert(value.toLowerCase()); }
		}
		else if(e.keyCode === 91) {
			keys.meta = true;
		}
		else if(e.keyCode === 186) {
			if(_shift) { insert(':'); }
			else { insert(';'); }
		}
		else if(e.keyCode === 187) {
			if(_shift) {
				insert('+');
			}
			else {
				insert('=');
			}
		}
		else if(e.keyCode === 188) {
			if(_shift) { insert('<'); }
			else { insert(','); }
		}
		else if(e.keyCode === 189) {
			if(_shift) {
				insert('_');
			}
			else {
				insert('-');
			}
		}
		else if(e.keyCode === 190) {
			if(_shift) { insert('>'); }
			else { insert('.'); }
		}
		else if(e.keyCode === 191) {
			if(_shift) { insert('?'); }
			else { insert('/'); }
		}
		else if(e.keyCode === 192) {
			if(_shift) {
				insert('~');
			}
			else {
				insert('`');
			}
		}
		else if(e.keyCode === 219) {
			if(_shift) { insert('{'); }
			else { insert('['); }
		}
		else if(e.keyCode === 220) {
			if(_shift) { insert('|'); }
			else { insert('\\'); }
		}
		else if(e.keyCode === 221) {
			if(_shift) { insert('}'); }
			else { insert(']'); }
		}
		else if(e.keyCode === 222) {
			if(_shift) { insert('\"'); }
			else { insert('\''); }
		}
	}

	function tick() {
		context.fillStyle = '#2a2a2c';
		context.fillRect(0,0,canvas.width,canvas.height);

		var textWidth = context.measureText('A').width;

		context.fillStyle = '#c6c6c6';
		for(var i=0;i+fontSize<canvas.height;i+=fontSize) {
			context.fillText(Math.floor(i/fontSize)+1,canvas.width*0.025,i);
		}

		var lines = text.split('\n');
		var chr = 0;
		for(var i=0;i<lines.length;i++) {
			if(selection !== -1){
				var a = Math.min(cursor,selection);
				var b = Math.max(cursor,selection);
				context.fillStyle = '#0B6E4F';
				for(var j=chr;j<chr+lines[i].length;j++) {
					if(a <= j && j < b) {
						context.fillRect(canvas.width * 0.10 + textWidth * (j - chr), i * fontSize, textWidth, fontSize);
					}
				}
			}

			var processed = lines[i].replace(/\t/g,'    ');

			var keywordPlaces = [];
			if(typeof keywords[language] !== 'undefined') {
				for(var j=0;j<keywords[language].length;j++){
					var prevIndex = 0;
					if(processed.indexOf(keywords[language][j],prevIndex) !== -1){
						var prevIndex = processed.indexOf(keywords[language][j],prevIndex);
						keywordPlaces.push([prevIndex,prevIndex+keywords[language][j].length]);
					}
				}
			}
			if(typeof keywords[language + '-special'] !== 'undefined') {
				for(var j=0;j<keywords[language + '-special'].length;j++){
					var prevIndex = 0;
					if(processed.indexOf(keywords[language + '-special'][j],prevIndex) !== -1){
						var prevIndex = processed.indexOf(keywords[language + '-special'][j],prevIndex);
						keywordPlaces.push([prevIndex,prevIndex+keywords[language + '-special'][j].length,'special']);
					}
				}
			}

			var inString = false;
			var justGotOutOfString = false;
			var inKeyword;
			var specialKeyword;

			for(var j=0;j<processed.length;j++) {
				inKeyword = false;
				specialKeyword = false;
				if('\'\"`'.includes(processed[j])) {
					if(inString) { inString = false; justGotOutOfString = true; }
					else { inString = true; }
				}

				for(var k=0;k<keywordPlaces.length;k++) {
					if(keywordPlaces[k][0] <= j && keywordPlaces[k][1] > j) {
						inKeyword = true;
						if(keywordPlaces[k].length > 2) { specialKeyword = true; }
					}
				}

				if(inKeyword) {
					if(specialKeyword) {
						context.fillStyle = '#406E8E';
					}
					else {
						context.fillStyle = '#922D50';
					}
				}
				else if(inString) {
					context.fillStyle = '#DDB771';
				}
				else if(justGotOutOfString) {
					context.fillStyle = '#DDB771';
					justGotOutOfString = false;
				}
				else {
					context.fillStyle = '#c6c6c6';
				}
				context.fillText(processed[j],canvas.width * 0.10 + j * textWidth,i * fontSize);
			}
			chr += lines[i].length + 1;
		}

		var x = 0;
		var y = 0;

		for(var i=0;i<cursor;i++) {
			if(text[i] === '\n') {
				x = 0;
				y += fontSize;
			}
			else if(text[i] === '\t') {
				x += textWidth * 4;
			}
			else {
				x += textWidth;
			}
		}

		context.fillRect(canvas.width*0.10+x,y,textWidth*0.20,fontSize);

		window.requestAnimationFrame(tick);
	}

	function start() {
		resize();

		canvas.tabIndex = 1000;
		canvas.style.outline = 'none';

		canvas.addEventListener('keyup',keyup);
		canvas.addEventListener('keydown',keydown);
		window.onresize = resize;

		context.imageSmoothingEnabled = false;
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;

		context.font = fontSize+'px Anonymous Pro';
		context.textBaseline = 'top';

		tick();
	}

	start();
};
