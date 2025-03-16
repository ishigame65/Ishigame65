/* ブロックつぶしゲーム
	====================================================
	Project Name    : 石亀ブロックつぶしゲーム
	File Name       : blockcrushing.js
	Encoding        : UTF-8
	Creation Date   : 2024/10/03
	Author's email	: moriuchi@ymail.ne.jp

	Copyright © 2024 moriuchi. All rights reserved.
	====================================================
 */
const GameIs = { Init: 'Init', Start: 'Started', Over: 'Over', Stop: 'Stopped' };
const CrusherIs = { Alive: '生存', Dead: '死亡' };
const BlockIs = { Init: '初期状態', Falling: '降下中', Stacked: '積まれた' };

// クラッシャー
class Crusher {

	constructor(){
		// プロパティの初期化
		this.keyRepeat = null;	// キー入力の状態を覚える
		this.x = 0;				// X座標
		this.y = 20;           	// Y座標
		this.blockWidth = 0;	// ブロック幅
		this.blockHeight = 0;	// ブロック高さ
		this.blockStackList = null;	// ブロック積上げ数
		this.step = 3;      	// 移動量
		this.canCrush = false;	// 潰して良いか？
		this.score = 0;	// 潰した数
		this.xpos = 0;			// X位置
		this.status = CrusherIs.Alive;		// 0:初期状態、1:破壊された
		this.leftCount = 0;		// 左移動カウンタ
		this.rightCount = 0;	// 右移動カウンタ
		this.divScore = document.querySelector("#SCORE");
	}

	toString(){
		return "[object Crusher]";
	}

	// モデル（内部管理値）更新
	updateModel(canvas) {
		const bw = this.blockWidth;
		const bh = this.blockHeight;
		const margin = 3;
		const lx = this.x + margin;
		const rx = this.x + bw - 5 - margin;
		const mx = this.x + bw / 2;
		this.xpos = Math.trunc(mx / bw);	// X位置
		let mstack = this.blockStackList[this.xpos].getStackNum();
		const lpos = Math.trunc(lx / bw);
		let lstack = this.blockStackList[lpos].getStackNum();
		const rpos = Math.trunc(rx / bw);
		let rstack = this.blockStackList[rpos].getStackNum();
		const lpos2 = Math.trunc((lx - bw / 2) / bw);
		let lstack2 = 999;
		if (lpos2 >= 0) {
			lstack2 = this.blockStackList[lpos2].getStackNum();
		}
		const rpos2 = Math.trunc((rx + bw / 2) / bw);
		let rstack2 = 999;
		if (rpos2 < this.blockStackList.length) {
			rstack2 = this.blockStackList[rpos2].getStackNum();
		}
		const stack = (lstack > rstack) ? lstack : rstack;
		let lowLimit = canvas.height - stack * bh;
		const keyRepeat = this.keyRepeat;	// キー入力
		const momentumLimit = 20;	// 左右押し出し勢いカウント値
		let isLeftWall = false;
		let isRightWall = false;
		if (keyRepeat.isLeft && this.x > this.step){	// 左キー
			if (lstack >= lstack2) {	// 隣が同じか下の段なら
				this.x -= this.step;
				this.leftCount++;
				this.canCrush = true;
			} else if ((lstack2 - lstack) <= 1) {	// 隣が上の段でも段差が1段以下なら
				if (this.leftCount > momentumLimit && (this.xpos-2) >= 0) {	// 左にブロックを押し出す
					const lstack3 = this.blockStackList[this.xpos-2].getStackNum();
					if (lstack3 == lstack) {
						const block = this.blockStackList[this.xpos-1].pop();
						block.xpos--;
						this.blockStackList[this.xpos-2].push(block);
						this.leftCount = 0;
					}
				}
				isLeftWall = true;
			}
			this.rightCount = 0;
		}
		if (keyRepeat.isRight && this.x < (canvas.width - bw - this.step)){	// 右キー
			if (rstack >= rstack2) {	// 隣が同じか下の段なら
				this.x += this.step;
				this.rightCount++;
				this.canCrush = true;
			} else if ((rstack2 - rstack) <= 1) {	// 隣が上の段でも段差が1段以下なら
				if (this.rightCount > momentumLimit && (this.xpos+2) < this.blockStackList.length) {	// 右にブロックを押し出す
					const rstack3 = this.blockStackList[this.xpos+2].getStackNum();
					if (rstack3 == rstack) {
						const block = this.blockStackList[this.xpos+1].pop();
						block.xpos++;
						this.blockStackList[this.xpos+2].push(block);
						this.rightCount = 0;
					}
				}
				isRightWall = true;
			}
			this.leftCount = 0;
		}
		if (keyRepeat.isUp && this.y > bh){	// 上キー
			if (isLeftWall) {
				if (this.y >= (lowLimit - bh)) {
					this.y -= bh;
					this.x -= bw / 2;
					this.canCrush = true;
				}
			} else if (isRightWall) {
				if (this.y >= (lowLimit - bh)) {
					this.y -= bh;
					this.x += bw / 2;
					this.canCrush = true;
				}
			} else {
				if (this.y >= lowLimit) {
					this.y -= this.step;
				}
			}
			this.leftCount = 0;
			this.rightCount = 0;
			//console.log(`Up> left:${isLeftWall}, right: ${isRightWall}`);
		}
		if (keyRepeat.isDown){	// 下キー
			if (this.blockStackList[this.xpos].getStackNum() > 0) {
				if (this.canCrush) {
					this.blockStackList[this.xpos].pop();
					lowLimit -= bh;
					this.canCrush = false;
					this.score++;
				}
			}
			if (this.y < lowLimit) {
				this.y += this.step;
				//console.log(`Down> left:${isLeftWall}, right: ${isRightWall}`);
			}
			this.leftCount = 0;
			this.rightCount = 0;
		}
		if (this.y < lowLimit) {
			this.y += 4;
		}
		//console.log(`> leftCnt:${this.leftCount}, rightCnt: ${this.rightCount}`);
	}

	// 表示更新（画面動き）
	updateView(ctx){
		//console.log(`blockHeight: ${this.blockHeight}`)
		const koffx = this.blockWidth / 2 - 2;
		const koffy = this.blockHeight / 2 - 2;
		if (CrusherIs.Alive == this.status) {
			ctx.fillText('🐢', this.x - koffx, this.y - koffy);
		} else {
			ctx.fillStyle = "rgb(255, 128, 0)";
			ctx.fillText('✕', this.x, this.y - koffy + 5);	// 位置が変、色も変えるべき
		}
		// for Develop
		//ctx.lineWidth = 1;
		//ctx.beginPath();
		//ctx.rect(this.x, this.y-this.blockHeight, this.blockWidth, this.blockHeight);
		//ctx.stroke();
		//const divScore = document.querySelector("#SCORE");
		this.divScore.innerText = `Score: ${this.score}`;
	}
}

/** 矢印キーの状態を保存するクラス
 */
class KeyRepeat {
	// 矢印キーのキーコード
	static KEY = { RIGHT:39, UP:38, LEFT:37, DOWN:40 };

	constructor(){
		// キーが押されたか？
		this.isRight = false;
		this.isUp = false;
		this.isLeft = false;
		this.isDown = false;
	}

	toString(){
		return "[object KeyRepeat]";
	}

	// キーが押されたイベント
	onkeydown(ev){
		ev.preventDefault();	// デフォルトの動作を禁止。

		const KEY = KeyRepeat.KEY;
		switch(ev.keyCode){
			case KEY.RIGHT:
				this.isRight = true;
				//console.log("→")
				break;
			case KEY.UP:
				this.isUp = true;
				//console.log("↑")
				break;
			case KEY.LEFT:
				this.isLeft= true;
				//console.log("←")
				break;
			case KEY.DOWN:
				this.isDown = true;
				//console.log("↓")
				break;
		}
	}

	// キーが離されたイベント
	onkeyup(ev) {
		ev.preventDefault();	// デフォルトの動作を禁止

		const KEY = KeyRepeat.KEY;
		switch(ev.keyCode){
			case KEY.RIGHT:
				this.isRight = false;
				break;
			case KEY.UP:
				this.isUp = false;
				break;
			case KEY.LEFT:
				this.isLeft = false;
				break;
			case KEY.DOWN:
				this.isDown = false;
				break;
		}
	}
}

class Block {

	constructor(){
		// プロパティの初期化
		this.xpos = 0;      	// ブロックX位置
		this.y = 0;         	// ブロックY位置
		this.speed = 1;   		// 速度
		this.blockWidth = 0;	// ブロック幅
		this.blockHeight = 0;	// ブロック高さ
		this.blockStack = null;	// 積上げブロック
		this.status = BlockIs.Init;	// 状態 0:初期値、1:下降中、2:積上げ、9:接地直後（制御用）
		this.crusher = null;	// クラッシャー
	}

	toString(){
		return "[object Block]";
	}

	updateModel(canvas){
		let stacks = this.blockStack.getStackNum();
		const lowLimit = canvas.height - stacks * this.blockHeight;
		if (this.y < lowLimit){	// ブロックが下限より上つまり下降中
			this.y += this.speed;		// ブロックの位置を更新する
			this.status = BlockIs.Falling;	// 降下中
		} else {	// 地面にある
			if (this.status == BlockIs.Falling) {	// 直前が降下中なら
				this.status = BlockIs.Stacked;	// 積まれた状態
				if (null != this.crusher && this.xpos == this.crusher.xpos) {
					this.crusher.status = CrusherIs.Dead;	// 破壊された
				}
			}
		}
	}

	updateView(ctx){
		ctx.fillText('□', this.xpos * this.blockWidth, this.y)
	}
}

class BlockStack {
	constructor(){
		this.blockStack = [];
	}

	toString(){
		return "[object BlockStack]";
	}

	push(block) {
		this.blockStack.push(block);
	}

	pop(){
		let block = null;
		const len = this.blockStack.length;
		if (len > 0) {
			switch (this.blockStack[len-1].status) {	// 最新ブロック
			case BlockIs.Stacked:
				block = this.blockStack.pop();	// 最後に積まれたブロックを削除				
				break;
			case BlockIs.Falling:
				if (len > 1) {
					const falling_block = this.blockStack.pop();	// 降下中ブロックを退避				
					block = this.blockStack.pop();	// 一つ前のブロックを削除				
					this.blockStack.push(falling_block);	// 降下中ブロックを戻す
				}
				break;
			default:
				console.log('内部エラー(BlockStack.pop)');
			}
		}
		return block;
	}

	getStackNum() {
		let len = this.blockStack.length;
		if (len > 0) {
			if (BlockIs.Falling == this.blockStack[len-1].status) len--;	// 降下中はカウントしない
		}
		return len;
	}
	
	clear(){
		let len = this.blockStack.length;
		while (len-- > 0) {
			this.blockStack.pop();
		}
	}

	updateModel(canvas){
		for (const block of this.blockStack){
			block.updateModel(canvas);	// ブロックモデル更新
		}
		// 積み終わったブロックのY位置を再計算
		const len = this.blockStack.length;
		if (len > 1) {
			let y = canvas.height;
			for (let i = 0; i < (len-1); i++) {
				const block = this.blockStack[i];
				block.y = y;
				y -= block.blockHeight;
			}
		}
	}

	updateView(ctx){
		for (const block of this.blockStack){
			block.updateView(ctx);	// ブロック表示更新
		}
	}
}

let app = null;

class App {

	constructor(){
		// プロパティの初期化
		this.canvas = null;       	// canvas要素
		this.canvasWidth = 400;   	// キャンバス幅
		this.canvasHeight = 160;	// キャンバス高さ
		this.timer = null;        	// タイマー
		this.timerTickness = 20;	// タイマー割り込みの時間間隔、ミリ秒
		this.timerCounter = 0;		// タイマーカウンター
		this.blockWidth = 0;		// ブロック幅
		this.blockHeight = 0;		// ブロック高さ
		this.blockXnum = 0;			// ブロック最大数
		this.blockStackList = null;	// ブロック積上げ数
		this.crusher = null;		// クラッシャー
		this.status = GameIs.Init;	// ゲーム状態
		this.blockInterval = 80;	// ブロック生成間隔
		this.divInterval = null;	// div(INTERVAL)
		this.divHistory = null;		// div(HISTORY)
		this.level = 0.2;			// 難易度レベル
		this.crusherSpeed = 3;		// クラッシャー移動速度
	}

	toString(){
		return "[object App]";
	}
	
	// アプリケーションの初期化
	init(){
		console.log(`#App.init() this=${ this }`);
		const canvas = document.querySelector("#CANVAS1");
		this.canvas = canvas;
		canvas.width = this.canvasWidth;    // canvasサイズ設定
		canvas.height = this.canvasHeight;
		this.divInterval = document.querySelector("#INTERVAL");
		this.divHistory = document.querySelector("#HISTORY");
	}

	// ゴミが残っていたらきれいにする
	clear() {
		if (this.blockStackList != null){
			for (const blockStack of this.blockStackList) {
				blockStack.clear();
			}
			this.blockStackList = null;
		}
		if (this.crusher != null){
			this.crusher = null;
		}
	}

	// 動作開始
	start(){
		const canvas = this.canvas;

		if (this.status == GameIs.Start){	// 動作中なら停止
			this.stop();	// 停止
		}
		if (this.status != GameIs.Init){	// 初期状態でなければ掃除
			this.clear();	// 掃除
		}
		this.blockInterval = 80;	// ブロック生成間隔
		this.divInterval.innerText = `ブロック生成間隔: ${this.blockInterval}`;

		const levelStr = document.querySelector("input[name='LEVEL']:checked").value;	// レベル（難易度）
		this.level = parseFloat(levelStr);		
		const speedStr = document.querySelector("input[name='SPEED']:checked").value;	// クラッシャー移動速度
		this.crusherSpeed = parseInt(speedStr);			// 移動速度

		// Contextブロック設定
		const ctx = canvas.getContext("2d");
		ctx.font = '24px Roboto, medium'
		ctx.shadowColor = "#666";
		ctx.shadowBlur = 4;
		ctx.shadowOffsetX = 3;
		ctx.shadowOffsetY = 2;
		ctx.fillStyle = "rgb(0, 128, 255)";

		// ブロック積上げマップ作成
		const metrics = ctx.measureText('□');
		this.blockWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight  ;	// ブロック幅（widthより妥当な値になる）
		this.blockHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;	// ブロック高さ
		this.blockXnum = Math.trunc(canvas.width / this.blockWidth);	// X方向ブロック数
		this.blockYnum = Math.trunc(canvas.height / this.blockWidth);	// Y方向ブロック数
		//console.log(`blockXnum: ${this.blockXnum}, blockYnum: ${this.blockYnum}`);
		this.blockStackList = new Array(this.blockXnum);		// ブロック積上げ数
		for (let x = 0; x < this.blockXnum; x++) {
			this.blockStackList[x] = new BlockStack();
		}

		// クラッシャー作成
		const keyRepeat = new KeyRepeat();		// キーイベントを付ける
		window.addEventListener("keydown", event => keyRepeat.onkeydown(event));
		window.addEventListener("keyup", event => keyRepeat.onkeyup(event));
		this.crusher = this.createCrusher(keyRepeat,
			canvas.width / 2, canvas.height, this.blockWidth, this.blockHeight, this.blockStackList, this.crusherSpeed);

		// タイマーを回す
		clearInterval(this.timer);
		this.timer = setInterval("app.timerInterrupt()", this.timerTickness);
		
		this.status = GameIs.Start;
	}
	
	// メッセージ表示
	canvasMessage(msg) {
		const canvas = this.canvas;
		const ctx = canvas.getContext("2d");
		ctx.fillText(msg, canvas.width / 3, canvas.height / 2 + this.blockHeight / 2);
	}

	// 停止
	stop(){
		this.status = GameIs.Stop;	// 停止
		this.canvasMessage('Game Stopped');
		clearInterval(this.timer);
		this.outHistory(`${nowDateTimeString()}  Score: ${this.crusher.score}`);
	}

	// タイマー割り込み
	timerInterrupt(){
		this.timerCounter++;
		this.updateView();
	}

	// 表示更新
	updateView(){
		const canvas = this.canvas;	// 繰り返し読ばないようにする

		if (this.status == GameIs.Over) {
			this.canvasMessage('Game Over');
			clearInterval(this.timer);
			this.outHistory(`${nowDateTimeString()}  Score: ${this.crusher.score}`);
			return;
		}
		for (const blockStack of this.blockStackList) {
			blockStack.updateModel(canvas);	// ブロックモデル更新
		}
		this.crusher.updateModel(canvas);	// クラッシャーモデル更新
		//console.log(`stack: ${this.blockStackList.toString()}`);
		
		// ブロック追加
		if (this.timerCounter > this.blockInterval) {
			let xpos = Math.trunc(Math.random() * this.blockXnum);
			let spd = Math.trunc(Math.random() * 2) + 1;
			const block = this.createBlock(xpos, 10, spd, this.blockWidth, this.blockHeight, this.blockStackList[xpos], this.crusher);
			this.blockStackList[xpos].push(block);
			//console.log(`x: ${xpos}, stack: ${this.blockStackList[xpos]}, maxStack: ${this.blockYnum}`);
			if (this.blockStackList[xpos].getStackNum() > this.blockYnum) {
				this.status = GameIs.Over;	// ゲームオーバー
			}
			this.timerCounter = 0;

			if (this.blockInterval > 10) {
				if (Math.random() < this.level) {
					this.blockInterval--;	// ブロック生成間隔を短くする
					this.divInterval.innerText = `ブロック生成間隔: ${this.blockInterval}`;
				}
			}
		}

		// 表示更新
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);	// 画面消去
		for (const blockStack of this.blockStackList) {
			blockStack.updateView(ctx);
		}
		this.crusher.updateView(ctx);	// クラッシャー表示更新

		// クラッシャー死亡判定
		if (CrusherIs.Dead == this.crusher.status) {
			this.status = GameIs.Over;	// ゲームオーバー
		}
	}

	// 履歴に追加出力
	outHistory(s){
		const textarea = this.divHistory;
		textarea.value += s + "\n";
		textarea.scrollTop = textarea.scrollHeight;
	}

	/* ブロック作成 */
	createBlock(xpos, y, speed, blockWidth, blockHeight, blockStack, crusher){
		const block = new Block();
		block.xpos = xpos;
		block.y = y;
		block.speed = speed;
		block.blockWidth = blockWidth;		// ブロック幅
		block.blockHeight = blockHeight;	// ブロック高さ	
		block.blockStack = blockStack;	// 積上げブロック
		block.crusher = crusher;		// クラッシャー
		//console.log(`block> blockWidth: ${blockWidth}, blockHeight: ${blockHeight} `);
		return block;
	}
	
	/* クラッシャー作成 */
	createCrusher(keyRepeat, x, y, blockWidth, blockHeight, blockStackList, crusherSpeed){
		const crusher = new Crusher();
		crusher.keyRepeat = keyRepeat;
		crusher.x = x;
		crusher.y = y;
		crusher.blockWidth = blockWidth;	// ブロック幅
		crusher.blockHeight = blockHeight;	// ブロック高さ
		crusher.blockStackList = blockStackList;	// ブロック積上げ数
		crusher.step = crusherSpeed;	// クラッシャー移動速度
		//console.log(`crusher> blockWidth: ${blockWidth}, blockHeight: ${blockHeight} `);
		return crusher;
	}
}

// 初期化
window.addEventListener("load", event => {
		app = new App();
		app.init();
	}
);

// 現在日時文字列取得
function nowDateTimeString() {
	const dd = new Date();
	const YYYY = dd.getFullYear();
	const MM = ('00' + (dd.getMonth()+1)).slice(-2);
	const DD = ('00' + dd.getDate()).slice(-2);
	const hh = ('00' + dd.getHours()).slice(-2);
	const mm = ('00' + dd.getMinutes()).slice(-2);
	const ss = ('00' + dd.getSeconds()).slice(-2);
	const str = `${YYYY}/${MM}/${DD} ${hh}:${mm}:${ss}`;
	return str;
}
