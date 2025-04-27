// 初期化処理
window.onload = () => {
	const app = new App();
	app.init();
};

class App {

	constructor(){
		this.canvas = null;         // canvas
		this.ctx = null;            // canvasコンテキスト
		this.isMouseDown = false;   // {Boolean} マウスボタンを押しているか？
	}
	
	init(){
		this.canvas = document.querySelector("#EYECANVAS");
		this.ctx = this.canvas.getContext("2d");
		window.addEventListener("mousemove", event => this.mousemove(event));
		this.canvas.addEventListener("mousedown", event => this.mouseclick(event));
	}

	// eyes => passwd
	mouseclick(e) {
		const canvas = this.canvas;
		const ctx = this.ctx;
		const bdr = canvas.getBoundingClientRect();
		const ex = e.clientX - bdr.left;
		const ey = e.clientY - bdr.top;
		//console.log(`pos> ${ex}, ${ey}`);
		const lmin = canvas.width/4 - canvas.width/5 + 2;
		const lmax = canvas.width/4 + canvas.width/5 - 2;
		if (ex > lmin && ex < lmax) {	// Left Eye
			//console.log('left');
			this.passwd_gate()
		}
	}

	// passwd
	passwd_gate(){
	   const input = prompt("合言葉を入力して下さい","");
	   if (/\W+/g.test(input)) {
		  alert("半角英数字とアンダーバーのみを入力して下さい");
	   }
	   else if (input != null) {
		  location.href = input + ".html";
	   }
	}

	// eyes
	mousemove(e) {
		const canvas = this.canvas;
		const ctx = this.ctx;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.lineWidth = 4;
		const bdr = canvas.getBoundingClientRect();
		const ex = e.clientX - bdr.left;
		const ey = e.clientY - bdr.top;
		const xr = canvas.width/5;
		const yr = canvas.height*0.45;
		this.drawEye(xr, yr, ex, ey, canvas.width/4, canvas.height/2);
		this.drawEye(xr, yr, ex, ey, canvas.width*3/4, canvas.height/2);
	}

	// eyes
	drawArc(cx, cy, xr, yr, c) {
		const ctx = this.ctx;
		ctx.beginPath ();
		if( ctx.ellipse == null ) ctx.arc(cx, cy, xr, 0, Math.PI*2, true);
		else ctx.ellipse(cx, cy, xr, yr, 0, 0, Math.PI*2, true);
		ctx.fillStyle  = c;
		ctx.fill();
	}

	// eyes
	drawEye(xr, yr, ex, ey, cx, cy) {
		const ctx = this.ctx;
		const r = Math.atan2(ey-cy, ex-cx);
		let c = (xr*yr) / Math.sqrt(
			Math.pow(xr,2)*Math.pow(Math.sin(r),2)+Math.pow(yr,2)*Math.pow(Math.cos(r),2)
		);
		let d = Math.sqrt(Math.pow(ex-cx, 2) + Math.pow(ey-cy, 2));
		if (d < c) c = d;
		//
		this.drawArc(cx, cy, xr, yr, 'white');
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.save();
		ctx.clip();
		const x2 = cx + Math.cos(r) * (c-xr*0.42);
		const y2 = cy + Math.sin(r) * (c-xr*0.42);
		this.drawArc(x2, y2, xr*0.34, yr*0.3, 'black');
		ctx.restore();
	}
}