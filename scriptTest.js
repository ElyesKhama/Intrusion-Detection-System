var intervalID;

var margin = {top: 100, right: 100, bottom: 100, left: 100},
				width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
				height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

var data = [];
var listcolor = [];
var r = 5;
var g = 0;
var b = 255;
var rgb = "rgb("+r+","+g+","+b+")";
var nbMax = 50;
var compteur = 0;
var color = d3.scale.ordinal().range([rgb]);
var selectButton = 0;
var first;
var radarChart = [];


var radarChartOptions = {   //options for radar
	w: width,
	h: height,
	margin: margin,
	maxValue: 0.5,
	levels: 10,
	roundStrokes: true,
	color: color
};
			//Call function to draw the Radar chart

// TODO: Faire plusieurs graphiques : celui que j'ai deja fait, un de probabilités sur les axes (comme prévu) + change de couleur en fonction de la probabilité

function xml_http_post(url, datas) {
	var req = new XMLHttpRequest();
	req.open("POST", url, true);
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			document.getElementById("content").innerHTML=req.responseText;  //pour le test d'affichage dans balise
			var jsonRecu = req.responseText;				//tout ce qu'on reçoit : le json
			obj = JSON.parse(jsonRecu);
			var nbtab = obj.nbtab;			//ici je recupere le nombre de tableaux qui vont devenir différents graphiques
			var listobjet = [];
			if(first == true){
				 prepareData(nbtab);
				 prepareChart(nbtab);
			}
			for(var i=0;i<nbtab;i++){
				listobjet[i] = [
					{axis:"Max",value: obj['tabs'][i][0]},
					{axis:"Min",value: obj['tabs'][i][1]},
					{axis:"Mean",value: obj['tabs'][i][2]},
					{axis:"Median",value: obj['tabs'][i][3]},
					{axis:"Std",value: obj['tabs'][i][4]},
					{axis:"Sum",value: obj['tabs'][i][5]}
				  ] ;
			}
			if (compteur < 10){
				for(var i=0;i<nbtab;i++){
					data[i].push(listobjet[i]);
				}
				/*data.push(listobjet);
				data2.push(listobjet2);*/
				listcolor.unshift(rgb);
				r = r+35;
				g = g+35;
				rgb = "rgb("+r+","+g+","+b+")";
				compteur++;
			}
			else{
				for(var i=0;i<nbtab;i++){
					data[i].shift();
					data[i].push(listobjet[i]);
				}
			}
			radarChartOptions.color = d3.scale.ordinal().range(listcolor);
			for(var i=0; i<nbtab; i++){
				RadarChart(radarChart[i], data[i], radarChartOptions);
			}
			first = false;
			}
	}
req.send(datas);
}

function prepareData(nbtab){
	for(var i=0;i<nbtab;i++){
		data[i] = [];
	}
}

function prepareChart(nbtab){   
	for(var i=0;i<nbtab;i++){
		radarChart[i] = ".radarChart"+i;
	}
}

function runbuttonfunc(bande) {		//clique du bouton
	first = true;
	window.clearInterval(intervalID);
	intervalID = window.setInterval(function(){envoieDonnees(bande);}, 3000);
}

function envoieDonnees(bande){
	xml_http_post("frontend.html", bande);
}

function printtest(){
	document.getElementById("test").innerHTML = document.getElementById("content").innerHTML
}

document.getElementById("runButton").onclick = function(){runbuttonfunc("400-500");}
document.getElementById("runButton2").onclick = function(){runbuttonfunc("800-900");}
document.getElementById("runButton3").onclick = function(){runbuttonfunc("2400-2500");}

