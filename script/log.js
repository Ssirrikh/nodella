
let log = {
	buffer: ['[console empty]'],
	elem: (function () {
		let e = document.createElement('div');
		e.style.background = 'transparent';
		e.style.position = 'absolute';
		e.style.display = 'inline-block';
		e.style.whiteSpace = 'pre';
		document.body.appendChild(e);
		return e;
	})(),
	clear: function() { this.buffer = []; },
	addLine: function(str) { this.buffer.push(str); },
	updateElem: function() { this.elem.innerHTML = this.buffer.join('<br>') || '[console empty]'; }
}
log.elem.style.top = log.elem.style.left = '2vh';
log.elem.style.zIndex = '3';
log.elem.style.font = '12px Consolas';
log.elem.style.color = '#88f7fc';