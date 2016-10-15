import Vue from 'vue'

import MusicList from './components/MusicList'
import Game from './components/Game'

export default {
	'/': {
		component: MusicList,
	},
	'/game': {
		component: Game,
	},
}
