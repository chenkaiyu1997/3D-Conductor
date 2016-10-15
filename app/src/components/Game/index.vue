<template>
<div class="game-container">
	<stage class="stage" @loaded="onLoaded"></stage>

	<rhythm :music="musicUrl" :control-data="controlData" @update-score="onUpdateScore" @update-countdown="onUpdateCountdown" @update-bar="onUpdateBar" @start="onStart" @end="onEnd"></rhythm>

	<div class="info">
		<dl>
			<dt>Score:</dt>
			<dd>{{score}} {{level}}</dd>
			<dt>Next Bar:</dt>
			<dd>{{nextBar.rhythm}}</dd>
		</dl>
	</div>
</div>
</template>

<script>
import config from '../../../config.json';
import data from '../../data';

import Stage from './Stage';
import Rhythm from './Rhythm';

export default {
	components: {
		Stage,
		Rhythm,
	},
	data() {
		return {
			music: data.music,
			musicUrl: '',
			controlData: [],
			score: 0,
			level: '',
			started: false,
			nextBar: {},
		};
	},
	methods: {
		onLoaded() {
			this.$broadcast('init');
		},
		loadControl() {
			return fetch(`${config.server}/music/${this.music.id}/control.json`, {
				method: 'GET',
				credentials: 'include',
			}).then((resp) => {
				return resp.json();
			}).then((data) => {
				this.controlData = data;
			})
		},
		onUpdateScore(score, level) {
			this.score = score;
			this.level = level;
		},
		onUpdateCountdown(countdown) {
			this.countdown = countdown;
		},
		onUpdateBar(bar) {
			this.nextBar = bar;
		},
		onStart() {
			this.started = true;
		},
		onEnd() {
			console.log('end');
		},
	},
	route: {
		canActivate(transition) {
			if (!data.music) {
				transition.abort();
			} else {
				transition.next();
			}
		},
		activate() {
			this.musicUrl = `${config.server}/music/${this.music.id}/music.mp3`;
			this.loadControl();
		},
	},
}
</script>

<style>

.game-container {
	float: left;
}

.stage {
	
}

.left-hand {
	position: absolute;
	left: 0;
	top: 0;
	width: 950px;
	height: 720px;
	z-index: 5;
}

.right-hand {
	position: absolute;
	left: 950px;
	top: 500px;
	width: 330px;
	height: 220px;
	border: 1px solid #000;
	box-sizing: border-box;
}

.info {
	position: absolute;
	left: 950px;
	top: 0;
	width: 330px;
	height: 500px;
	border: 1px solid #000;
	box-sizing: border-box;
}

</style>
