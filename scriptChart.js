var intervalID;

var margin = {top: 105, right: 105, bottom: 105, left: 105},
				width = Math.min(550, window.innerWidth - 10) - margin.left - margin.right,
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
var newAlert = [];
var bande = [];

var radarChartOptions = {   //options for radar
	w: width,
	h: height,
	margin: margin,
	maxValue: 0.5,
	levels: 6,
	roundStrokes: true,  //TODO: a voir ce qu'ils préfèrent
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
					{axis:"Median",value: obj['tabs'][i][3]}   // ,
				//	{axis:"Std",value: obj['tabs'][i][4]},
				//	{axis:"Sum",value: obj['tabs'][i][5]}
				  ] ;
				bande[i] = obj['tabs'][i][6]+"<-->"+obj['tabs'][i][7];
				console.log(bande[i]);
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
			writeHistorique(obj.nbalertes,obj.tabAlertes);
			radarChartOptions.color = d3.scale.ordinal().range(listcolor);
			for(var i=0; i<nbtab; i++){
				//RadarChart(radarChart[i], data[i], radarChartOptions);
				RadarChart(newSpan[i], data[i], radarChartOptions,bande[i]);
			}
			first = false;
			}
	}
req.send(datas);
}

function writeHistorique(nbalertes, tab){
	var i;	
	for(i=0;i<nbalertes;i++){
		newAlert[i] = document.createElement("div");
		var texte = document.createTextNode("Valeur : "+tab[i][0] + "- Le jour n° : "+tab[i][1] +" à : cos_time : "+tab[i][2]+" et sin_time : "+tab[i][3]+"sur la bande :"+tab[i][4]+"-"+tab[i][5]);
		newAlert[i].appendChild(texte);
		var baliseAlertes = document.getElementById("alertes");
		document.body.insertBefore(newAlert[i],baliseAlertes);
		newAlert[i].style.textAlign = "left";
	}
}

function addTitle2(id,bande){
	var svg = d3.select(id).select("svg");
	svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")
		.style("color","white")
        .text("Value vs Date Graph");
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
	removeCharts(newSpan);
	window.clearInterval(intervalID);
	intervalID = window.setInterval(function(){envoieDonnees(bande);}, 4000);
}

function envoieDonnees(bande){
	xml_http_post("frontend.html", bande);
}

function addCharts(nbtab){  //on crée les elements html pour afficher les graphs
	for(var i=0; i<nbtab;i++){
		// crée un nouvel élément span 
		newSpan[i] = document.createElement("span");
		// ajoute le nouvel élément créé dans le doc au niveau de body
		var baliseJournal = document.getElementById("journal");
		document.body.insertBefore(newSpan[i],baliseJournal);
	}
}

function addTitle(bande){
	var newDiv = document.createElement("div");
	var texte = document.createTextNode(bande);
	newDiv.appendChild(texte);
	var baliseJournal = document.getElementById("journal");
	document.body.insertBefore(newDiv,baliseJournal);
}

function removeCharts(tab){ //on efface tous les graphs
	var elem = null;
	var parent = null;
	console.log(tab.length);
	for(var i=0; i<500; i++){   //8 correspond au nombre max de nb_bande
		if(tab[i] != null){
			elem = tab[i];
			parent = document.body;
			parent.removeChild(elem);
			tab[i] = null;
		}
			console.log(tab.length);
	}
}

function clearAlertsFunc(){
	removeCharts(newAlert);
}


document.getElementById("runButton").onclick = function(){runbuttonfunc("400-500");}
document.getElementById("runButton2").onclick = function(){runbuttonfunc("800-900");}
document.getElementById("runButton3").onclick = function(){runbuttonfunc("2400-2500");}
document.getElementById("runButton4").onclick = function(){runbuttonfunc("WiFi");}
document.getElementById("runButton5").onclick = function(){runbuttonfunc("ZigBee");}
document.getElementById("runButton6").onclick = function(){runbuttonfunc("Bluetooth/BLE");}
document.getElementById("ButtonClearAlert").onclick =  function(){clearAlertsFunc();}

