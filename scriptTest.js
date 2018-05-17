var margin = {top: 100, right: 100, bottom: 100, left: 100},
				width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
				height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

var data = [];
var listcolor = [];
var r = 5;
var g = 0;
var b = 255;
var rgb = "rgb("+r+","+g+","+b+")";
var tabRequest = [];
var nbMax = 50;
var compteur = 0;

var color = d3.scale.ordinal().range([rgb]);

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
	var tabRecu = req.responseText;
	obj = JSON.parse(tabRecu);
//	document.getElementById("test").innerHTML= obj.tab[0];
	if (compteur < 10){
		var jsonRecu = req.responseText;
		obj = JSON.parse(jsonRecu);
		var tabRecu = obj.tab;
		tabRequest[compteur] = tabRecu;
		document.getElementById("test").innerHTML= tabRecu[0];
		var listobjet = [
					{axis:"Puissance actuelle",value: tabRecu[0]},
					{axis:"Moyenne",value:tabRecu[1]},
					{axis:"Ecart Type",value:tabRecu[2]},
					{axis:"Variance",value:tabRecu[3]}
				  ] ;
		data.push(listobjet);
		listcolor.unshift(rgb);
		r = r+35;
		g = g+35;
		rgb = "rgb("+r+","+g+","+b+")";
		compteur++;
	}
else{
	tabRequest.shift();
	var jsonRecu = req.responseText;
	obj = JSON.parse(jsonRecu);
	var tabRecu = obj.tab;
	tabRequest.push(tabRecu);
	var listobjet = [
					{axis:"Puissance actuelle",value: tabRecu[0]},
					{axis:"Moyenne",value:tabRecu[1]},
					{axis:"Ecart Type",value:tabRecu[2]},
					{axis:"Variance",value:tabRecu[3]}
				  ] ;
	data.shift();
	data.push(listobjet);
}
	//document.getElementById("test").innerHTML=parseInt(i,16);

	radarChartOptions.color = d3.scale.ordinal().range(listcolor);

	RadarChart(".radarChart", data, radarChartOptions);
	}
	}
req.send(datas);
}

function runbuttonfunc() {
	for(var iter=0;iter<100;iter++){
		xml_http_post("frontend.html", "I sent you this message")
	}
}

function printtest(){
	document.getElementById("test").innerHTML = document.getElementById("content").innerHTML
}

document.getElementById("runButton").onclick = runbuttonfunc;

/*var data = [ //[document.getElementById("content").innerText;]
					  [//iPhone
						{axis:"Puissance actuelle",value:0.4},
						{axis:"Moyenne",value:0.28},
						{axis:"Ecart Type",value:0.29},
						{axis:"Variance",value:0.17}
					  ],
					 [//iPhone2
						{axis:"Puissance actuelle",value:0.6},
						{axis:"Moyenne",value:0.2},
						{axis:"Ecart Type",value:0.1},
						{axis:"Variance",value:0.5}
					  ]
					];*/

