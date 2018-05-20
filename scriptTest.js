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
var newSpan = [];

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
				 //prepareChart(nbtab);
				addCharts(nbtab);
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
				listcolor.unshift(rgb);
				updateColor();
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
				//RadarChart(radarChart[i], data[i], radarChartOptions);
				RadarChart(newSpan[i], data[i], radarChartOptions);
			}
			first = false;
			}
	}
req.send(datas);
}

function resetColor(){
	compteur = 0;
	r = 5;
	g = 0;
	b = 255;
	rgb = "rgb("+r+","+g+","+b+")";
}

function updateColor(){
	r = r+35;
	g = g+35;
	rgb = "rgb("+r+","+g+","+b+")";
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
	resetColor();
	removeCharts();
	window.clearInterval(intervalID);
	intervalID = window.setInterval(function(){envoieDonnees(bande);}, 1000);
}

function envoieDonnees(bande){
	xml_http_post("frontend.html", bande);
}

function printtest(){
	document.getElementById("test").innerHTML = document.getElementById("content").innerHTML
}

function addCharts(nbtab){  //on crée les elements html pour afficher les graphs
	for(var i=0; i<nbtab;i++){
		// crée un nouvel élément span 
		newSpan[i] = document.createElement("span");
		// ajoute le nouvel élément créé dans le doc au niveau de body
		document.body.appendChild(newSpan[i]);
	}
}

function removeCharts(){ //on efface tous les graphs
	var elem = null;
	var parent = null;
	for(var i=0; i<8; i++){   //8 correspond au nombre max de nb_bande
		if(newSpan[i] != null){
			elem = newSpan[i];
			parent = document.body;
			parent.removeChild(elem);
			newSpan[i] = null;
		}
	}
}


document.getElementById("runButton").onclick = function(){runbuttonfunc("400-500");}
document.getElementById("runButton2").onclick = function(){runbuttonfunc("800-900");}
document.getElementById("runButton3").onclick = function(){runbuttonfunc("2400-2500");}
document.getElementById("runButton4").onclick = function(){runbuttonfunc("WiFi");}
document.getElementById("runButton5").onclick = function(){runbuttonfunc("ZigBee");}
document.getElementById("runButton6").onclick = function(){runbuttonfunc("Bluetooth/BLE");}

