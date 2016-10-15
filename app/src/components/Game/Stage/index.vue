<template>

<div id="canvas-frame"></div>

</template>

<script>

window.THREE = require('./three.min.js');
window.Stats = require('./stats.min.js');
require('./DDSLoader');
require('./MTLLoader');
require('./OBJLoader');
require('./Detector');
require('./OrbitControls');
const startThree = require('./model');

export default {
	ready() {
		startThree()
		.then(() => {
			this.$dispatch('loaded');
		});
	},
};

</script>

<style>
#canvas-frame {
	width: 1280px;
	height: 720px;
}
</style>
