import Vue from 'vue'

import MusicList from './components/MusicList'
import Stage from './components/Stage'

export default {
	'/': {
		component: MusicList,
	},
	'/stage': {
		component: Stage,
	},
}
