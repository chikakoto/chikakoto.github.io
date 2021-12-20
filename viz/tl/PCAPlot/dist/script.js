d3.csv('https://raw.githubusercontent.com/usersblock/CovidVsFood/main/PCAPlot/PCADATA.csv', function(err, rows){
function unpack(rows, key) {
	return rows.map(function(row)
	{ return row[key]; });}

var italy = [0,39]
var niger = [italy[1],78]
var pakistan = [niger[1],117]
var us = [pakistan[1],156]
var uruguay = [us[1],195]


  
var Italy = {
	x:unpack(rows, 'x').slice(italy[0], italy[1]), y: unpack(rows, 'y').slice(italy[0], italy[1]), z: unpack(rows, 'z').slice(italy[0], italy[1]),
	mode: 'markers',
  name: 'Italy',
	marker: {
		size: 12,
		line: {
		color: 'rgba(217, 217, 217, 0.14)',
		width: 0.5},
		opacity: 0.8},
	type: 'scatter3d'
};

var Pakistan = {
	x:unpack(rows, 'x').slice(pakistan[0], pakistan[1]), y: unpack(rows, 'y').slice(pakistan[0], pakistan[1]), z: unpack(rows, 'z').slice(pakistan[0], pakistan[1]),
	mode: 'markers',
  name: 'Pakistan',
	marker: {
		size: 12,
		line: {
		color: 'rgba(217, 0, 217, 0.14)',
		width: 0.5},
		opacity: 0.8},
	type: 'scatter3d'
};
  
var Us = {
	x:unpack(rows, 'x').slice(us[0], us[1]), y: unpack(rows, 'y').slice(us[0], us[1]), z: unpack(rows, 'z').slice(us[0], us[1]),
	mode: 'markers',
  name: 'United States',
	marker: {
		size: 12,
		line: {
		color: 'rgba(0, 217, 217, 0.14)',
		width: 0.5},
		opacity: 0.8},
	type: 'scatter3d'
};
  
var Niger = {
	x:unpack(rows, 'x').slice(niger[0], niger[1]), y: unpack(rows, 'y').slice(niger[0], niger[1]), z: unpack(rows, 'z').slice(niger[0], niger[1]),
	mode: 'markers',
  name: 'Niger',
	marker: {
		size: 12,
		line: {
		color: 'rgba(217, 217, 0, 0.14)',
		width: 0.5},
		opacity: 0.8},
	type: 'scatter3d'
};
  
var Uruguay = {
	x:unpack(rows, 'x').slice(uruguay[0], uruguay[1]), y: unpack(rows, 'y').slice(uruguay[0], uruguay[1]), z: unpack(rows, 'z').slice(uruguay[0], uruguay[1]),
	mode: 'markers',
  name: 'Uruguay',
	marker: {
		size: 12,
		line: {
		color: 'rgba(217, 0, 0, 0.14)',
		width: 0.5},
		opacity: 0.8},
	type: 'scatter3d'
};

var data = [Italy, Niger, Us, Uruguay, Pakistan];
var layout = {margin: {
	l: 0,
	r: 0,
	b: 0,
	t: 0
  }};
Plotly.newPlot('myDiv', data, layout);
});