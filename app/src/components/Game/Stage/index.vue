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
		startThree();
	},
};

</script>

<style>
#canvas-frame {
	width: 1000px;
	height: 800px;
}
</style>
