<template>
	<canvas v-el:display-canvas-right class="right-hand"></canvas>
	<canvas v-el:display-canvas-left class="left-hand"></canvas>

	<div style="display: none">
		<audio v-el:music></audio>
		<canvas v-el:canvas width="800" height="800"></canvas>
		<canvas v-el:canvas2></canvas>
		<canvas v-el:canvas3></canvas>
		<canvas v-el:canvas4></canvas>
		<img v-el:image>
	</div>
</template>

<script>
import co from 'co';
import path from 'path';
import './leap';

let canvas,canvas2,canvas3,canvas4;
let ctx,ctx2,ctx3,ctx4;
let introductorP;
let displayT, scoreT, resultT;
let displayCanvasRight;
let displayCTXRight;
let displayCanvasLeft;
let displayCTXLeft;
let imgElement;
let audio;

let controlData;
let count = 0;
let flag = 1;
let maxX,maxY,minX,minY;
const X = [0,0,230,200,200];
const Y = [0,0,85,200,200];
const P = [0,0,6,4,4];
const Q = [0,0,2,4,4];
const perfect = [0,0,400,470,540];
const good = [0,0,465,520,590];
const color = ["#FF0000","#0000FF","#00FF00","#0000FF"];
let strstd = [];
let countDownFlag;
const img = [];
let normalized = [0,1];
let handPosition;

let self;

function getSimiliarity(cStr1,cStr2) {
	const len1 = cStr1.length;
	const len2 = cStr2.length;
	const ans = [];
	for(let i = 0;i <= len1;i++) {
		ans[i] = [i];
	}
	for(let j = 0;j <= len2;j++) {
		ans[0][j] = j;
	}
	for(let i = 1;i <= len1;i++) {
		const char1 = cStr1.charAt(i - 1);
		for(let j = 1;j <= len2;j++) {
			const char2 = cStr2.charAt(j - 1)
			const cost = char1 === char2 ? 0 : 1;
			ans[i][j] = Math.min(ans[i - 1][j] + 1,ans[i][j - 1] + 1,ans[i - 1][j - 1] + cost * 10);
		}
	}
	return ans[len1][len2];

}

function convertImgData(imgData) {
	for (let i=0;i<imgData.data.length;i+=4) {
		if (imgData.data[i] <= 20 && imgData.data[i+1] <=20 && imgData.data[i+2] <= 20) {
			imgData.data[i]=0;
			imgData.data[i+1]=0;
			imgData.data[i+2]=0;
		}
		else  {
			const max = Math.max(imgData.data[i], imgData.data[i+1], imgData.data[i+2]);
			if (imgData.data[i] == max) {imgData.data[i]=255;imgData.data[i+1]=0;imgData.data[i+2]=0;};
			if (imgData.data[i+1] == max) {imgData.data[i]=0;imgData.data[i+1]=255;imgData.data[i+2]=0;};
			if (imgData.data[i+2] == max) {imgData.data[i]=0;imgData.data[i+1]=0;imgData.data[i+2]=255;};
		}
	}
}
function saveImage(t) {
	if(minX >= maxX) {
		maxX = 800;
		minX = 0;
	}
	if(minY >= maxY) {
		maxY = 800;
		minY = 0;
	}
	minX = Math.floor(minX);
	maxX = Math.ceil(maxX);
	minY = Math.floor(minY);
	maxY = Math.ceil(maxY);
	const imgData = ctx.getImageData(minX,minY,maxX - minX, maxY - minY);
	if(imgData) {
		let total = 0;
		canvas2.width = maxX - minX;
		canvas2.height = maxY - minY;
		ctx2.putImageData(imgData,0,0);
		const image=canvas2.toDataURL("image/jpeg");
		imgElement.setAttribute("src",image);
		canvas2.width = X[t];
		canvas2.height = Y[t];
		imgElement.onload=function() {
			 ctx2.drawImage(imgElement,0,0,X[t],Y[t]);
			 const imgData2 = ctx2.getImageData(0,0,X[t],Y[t]);

			 convertImgData(imgData2);
			 for (let i = 0; i < Math.floor(Y[t]/Q[t]); i++) {
			 	let str = "";
				for (let j = 0; j < Math.floor(X[t]/P[t]); j++) {
					 let r= 0,g= 0,b=0;
					 let k = i*Q[t]*X[t]*4+j*4*P[t];
					 let record = k;
					 for (let i1=0;i1<Q[t];i1++) {
						for (let j1=0;j1<P[t];j1++) {
							 if (imgData2.data[k] !== 0 || imgData2.data[k+1] !== 0 || imgData2.data[k+2] !== 0) {
								 if (imgData2.data[k] == 255) r=1;
								 if (imgData2.data[k+1] == 255) g=1;
								 if (imgData2.data[k+2] == 255) b=1;
							 }
							 k+=4;
						 }
						 record += X[t]*4;
						 k = record;
					 }
					 const h = (r<<2)+(g<<1)+b;
					 str=str+h;
 				 }
 				 const comStr = strstd[t].substring(i * Math.floor(X[t]/P[t]),(i + 1) * Math.floor(X[t]/P[t]));
 				 total = total + getSimiliarity(comStr,str);
 		   	}
			 let level;
			 if (total <= perfect[t]) {
			 	level = "perfect";
			 } else if (total <= good[t]) {
			 	level = "good";
			 } else {
			 	level = "bad";
			 }
			 self.$dispatch('update-score', total, level);
		 }
	}
	minX = minY = 800;
	maxX = maxY = 0;
}		

function getstr(t,imgData) {
	let str1="";
	for (let i = 0; i < Math.floor(Y[t]/Q[t]); i++)
		for (let j = 0; j < Math.floor(X[t]/P[t]); j++) {
			let r= 0,g= 0,b=0;
			let k = i*Q[t]*X[t]*4+j*4*P[t];
			let record = k;
			for (let i1=0;i1<Q[t];i1++) {
				for (let j1=0;j1<P[t];j1++) {
					if (imgData.data[k] !== 0 || imgData.data[k+1] !== 0 || imgData.data[k+2] !== 0) {
						if (imgData.data[k] == 255) r=1;
						if (imgData.data[k+1] == 255) g=1;
						if (imgData.data[k+2] == 255) b=1;
					}
					k+=4;
				}
				record+=X[t]*4;
				k=record;
			}
			const h = (r<<2)+(g<<1)+b;
			str1=str1+h;
		}
	return str1;
}

function loadImage(filename, i) {
	return new Promise(function (resolve, reject) {
		img[i] = new Image();
		img[i].src = path.join('file://', path.resolve('app/assets/images', filename));
		img[i].onload = function() {
			canvas4.width = X[i];
			canvas4.height = Y[i];
			ctx4.drawImage(img[i], 0, 0, X[i], Y[i]);
			const imgData = ctx4.getImageData(0, 0, X[i], Y[i]);
			convertImgData(imgData);
			strstd[i] = getstr(i, imgData);
			resolve();
		}
		img.onerror = reject;
	});
}

const loadImages = co.wrap(function*() {
	for (let i = 2; i <= 4; i++) {
		yield loadImage(`pat${i}.jpeg`, i);
	}
});

function PaintCanvas() {
	let x, y, stx, sty;
	let posin = 0;
	let righthand = null;
	let lefthand = null;
	let lefthandDir;
	let posout = 1;

	displayCTXRight.beginPath();
	displayCTXLeft.beginPath();
	flag = 0;
	minX = ctx.canvas.width;
	minY = ctx.canvas.height;
	maxX = maxY = 0;
	countDownFlag = 0;
	let currentTap;
	let currentValue;
	audio.play();

	Leap.loop({
		frameEventName: "animationFrame",
	}, (frame) => {
		if(posin < count && audio.currentTime > self.controlData[posin].start) {
			currentTap = 0;
			if(flag == 0) flag = 1;
			if(posin == 1) {
				ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
			}
			if(posin > 1) {
				if(righthand != null) {
					ctx.lineTo(stx,sty);
					ctx.stroke();
				}
				saveImage(self.controlData[posin - 1].rhythm);
				ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
				ctx.closePath();
				flag = 1;
			}
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = color[currentTap];
			if(posin == 1) {
				countDownFlag = 1;
				self.$dispatch('start');
			}
			++posin;
			self.$dispatch('update-bar', self.controlData[posin]);
			const num = self.controlData[posin-1].rhythm;
			canvas3.width = X[num];
			canvas3.height = Y[num];
			ctx3.drawImage(img[num], 0, 0, X[num], Y[num]);
			if(posin >= count) {
				ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
				ctx.closePath();
				self.$dispatch('end');
			}
			if(!countDownFlag) {
				self.$dispatch('update-countdown', self.controlData[posin - 1].rhythm - currentTap);
			}
		}
		if(posin > 0 && posin < count) {
			currentValue = self.controlData[posin - 1].start + (self.controlData[posin].start - self.controlData[posin - 1].start) / self.controlData[posin - 1].rhythm * (currentTap + 1);
			if(currentTap < self.controlData[posin - 1].rhythm - 1 && audio.currentTime > currentValue) {
				++currentTap;
				ctx.closePath();
				ctx.beginPath();
				ctx.lineTo(x,y);
				ctx.strokeStyle = color[currentTap];
				if(!countDownFlag) {
					self.$dispatch('update-countdown', self.controlData[posin - 1].rhythm - currentTap);
				}
			}
		}

		lefthandDir = 0;
		righthand = lefthand = null;
		for(let i = 0;i < frame.hands.length;i++) {
			if(frame.hands[i].type == "right") righthand = frame.hands[i];
			if(frame.hands[i].type == "left") lefthand = frame.hands[i];

		}
		if(righthand == null) displayCTXRight.clearRect(0,0,displayCTXRight.canvas.width,displayCTXRight.canvas.height);
		if(lefthand == null) displayCTXLeft.clearRect(0,0,displayCTXLeft.canvas.width,displayCTXLeft.canvas.height);
		if(righthand != null) {
			handPosition = righthand.palmPosition;
			normalized = frame.interactionBox.normalizePoint(handPosition);
			normalized[0] = normalized[0] * 0.6;
			normalized[1] = normalized[1] * 0.6;
			if (normalized[0] > 1) normalized[0] = 1;
			if (normalized[0] < 0) normalized[0] = 0;
			if (normalized[1] > 1) normalized[1] = 1;
			if (normalized[1] < 0) normalized[1] = 0;
			x = ctx.canvas.width * normalized[0];
			y = ctx.canvas.height * (1 - normalized[1]);
			maxX = Math.max(x,maxX);	
			maxY = Math.max(y,maxY);
			minX = Math.min(x,minX);
			minY = Math.min(y,minY);
			displayCTXRight.clearRect(0,0,displayCTXRight.canvas.width,displayCTXRight.canvas.height);
			displayCTXRight.closePath();
			displayCTXRight.beginPath();
			displayCTXRight.fillStyle = "#FF0000";	
		
			displayCTXRight.arc(displayCTXRight.canvas.width * normalized[0],displayCTXRight.canvas.height * (1 - normalized[1]),5,0,2 * Math.PI);
			displayCTXRight.fill();

			if(flag) {
				if(flag == 1) {
					flag = 2;
					stx = x;sty = y;
				}
				ctx.lineTo(x,y);
				ctx.stroke();
			}
		}
		if(lefthand != null) {
			handPosition = lefthand.palmPosition;
			normalized = frame.interactionBox.normalizePoint(handPosition);
			normalized[0] *= 2;
			normalized[1] *= 2;
			if (normalized[0] > 1) normalized[0] = 1;
			if (normalized[0] < 0) normalized[0] = 0;
			if (normalized[1] > 1) normalized[1] = 1;
			if (normalized[1] < 0) normalized[1] = 0;
			displayCTXLeft.clearRect(0,0,displayCTXLeft.canvas.width,displayCTXLeft.canvas.height);
			displayCTXLeft.closePath();
			displayCTXLeft.beginPath();
			displayCTXLeft.fillStyle = "#00FF00";
			displayCTXLeft.arc(displayCTXLeft.canvas.width * normalized[0],displayCTXLeft.canvas.height * (1 - normalized[1]),5,0,2 * Math.PI);
			displayCTXLeft.fill();
			lefthandDir = lefthand.palmNormal[1] < 0 ? -1 : 1;
		}
	});
}

/*

[{
    "start": 0.0,
    "end": 0.1,
    "rhythm": 2,
    "part": 0,
    "direction": 0
}]

*/

export default {
	props: {
		controlData: {
			type: Array,
			required: true,
		},
		music: {
			type: String,
			required: true,
		},
	},
	events: {
		init() {
			self = this;
			this.controlData.unshift({
				start: this.controlData[0].start * 2 - this.controlData[1].start,
				end: this.controlData[0].start,
				rhythm: this.controlData[0].rhythm,
				part: this.controlData[0].part,
				direction: this.controlData[0].direction,
			});
			count = this.controlData.length;
			this.$els.music.src = this.music;
			audio = this.$els.music;
			canvas = this.$els.canvas;
			ctx = canvas.getContext("2d");
			introductorP = this.$els.introductor;
			displayT = this.$els.displayTime;
			scoreT = this.$els.score;
			resultT = this.$els.result;
			displayCanvasRight = this.$els.displayCanvasRight;
			displayCTXRight = displayCanvasRight.getContext("2d");
			displayCanvasLeft = this.$els.displayCanvasLeft;
			displayCTXLeft = displayCanvasLeft.getContext("2d");
			canvas2 = this.$els.canvas2;
			ctx2 = canvas2.getContext("2d");
			canvas3 = this.$els.canvas3;
			ctx3 = canvas3.getContext("2d");
			canvas4 = this.$els.canvas4;
			ctx4 = canvas4.getContext("2d");
			imgElement = this.$els.image;
			loadImages()
			.then(() => {
				PaintCanvas();
			});
		},
	},
};
</script>
