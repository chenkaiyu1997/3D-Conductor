<template>

<rhythm :music="musicUrl" :control-data="controlData" @update-score="onUpdateScore" @update-countdown="onUpdateCountdown" @update-bar="onUpdateBar" @start="onStart" @end="onEnd"></rhythm>

</template>

<script>
import config from '../../../config.json';
import data from '../../data';

import Rhythm from './Rhythm';

export default {
	components: {
		Rhythm,
	},
	data() {
		return {
			music: data.music,
			musicUrl: '',
			controlData: [],
		};
	},
	methods: {
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
			console.log('updateScore', score, level);
		},
		onUpdateCountdown(countdown) {
			console.log('countdown', countdown);
		},
		onUpdateBar(bar) {
			console.log('bar', bar);
		},
		onStart() {
			console.log('start');
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
			this.loadControl()
			.then(() => {
				this.$broadcast('init');
			});
		},
	},
}
</script>

<style>
</style>
