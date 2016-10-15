<template>

<div id="container">

<h3>Please select music:</h3>

<div id="sort-container">
	<span class="flex"></span>
	<span class="lbl">Sort By:</span>
	<div id="sort" class="btn-group btn-group-block">
		<button class="btn" :class="{ active: sort === 'upload' }" @click="sort = 'upload'">Upload Time</button>
		<button class="btn" :class="{ active: sort === 'play' }" @click="sort = 'play'">Play Number</button>
	</div>
</div>

<table id="music-list" class="table table-striped table-hover">
	<thead>
		<tr>
			<th style="width: 20%">Name</th>
			<th>Description</th>
			<th style="width: 20%">Contributor</th>
		</tr>
	</thead>
	<tbody>
		<tr class="link" v-for="music in list" @click="selectMusic($index)">
			<td>{{music.name}}</td>
			<td>{{music.description}}</td>
			<td>{{music.contributor}}</td>
		</tr>
	</tbody>
</table>

</div>

</template>

<script>

const config = require('../../config.json');
const data = require('../data');

export default {
	data() {
		return {
			sort: 'play',
			list: [],
		};
	},
	route: {
		activate() {
			return this.reload();;
		}
	},
	methods: {
		reload() {
			return fetch(`${config.server}/music?sort=${this.sort}`, {
				method: 'GET',
				credentials: 'include',
			}).then((resp) => {
				return resp.json();
			}).then((data) => {
				this.list = data;
			})
		},
		selectMusic(idx) {
			data.music = JSON.parse(JSON.stringify(this.list[idx]));
			this.$route.router.go('game');
		},
	},
	watch: {
		sort() {
			this.reload();
		},
	},
}
</script>

<style scoped>
.link {
	cursor: pointer;
}
.flex {
	flex: 1 1;
}
#container {
	width: 60%;
	min-width: 500px;
	margin: 0 auto;
}
#sort-container {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}
#sort-container>.lbl {
	padding-right: 10px;
}
#sort>button {
	flex: 0 0 50px;
}
</style>
