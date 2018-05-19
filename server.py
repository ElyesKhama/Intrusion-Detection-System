import http.server
import random
import time

FILE = 'visu.html'
PORT = 8000

nb_features = 22

class TestHandler(http.server.SimpleHTTPRequestHandler):
	"""The test example handler."""

	def do_POST(self):
		"""Handle a post request by returning the square of the number."""
		print(self.headers)
		length = int(self.headers.get_all('content-length')[0])
		print(self.headers.get_all('content-length'))
		data_string = (self.rfile.read(length)).decode("utf-8")
		print(data_string)
		tab = charge_fichier()
		"""print(tab)"""
		self.send_response(200)
		self.send_header("Content-type", "text/plain")
		self.end_headers()
		self.flush_headers()
		json = createJson(tab,data_string)			
		self.wfile.write(str(json).encode())

def createJson(tab, data):
	if(data == "400,500"):
		json = '{"nbtab":1, "tabs":[ ['+tab[0][1]+','+tab[0][2]+','+tab[0][3]+','+tab[0][4]+','+tab[0][5]+','+tab[0][2]+']]}'
	elif(data == "800,900"):
		json = '{"nbtab":1, "tabs":[ ['+tab[1][1]+','+tab[1][2]+','+tab[1][3]+','+tab[1][4]+','+tab[1][5]+','+tab[1][6]+']]}'
	"""nbtab correspond au nombre de bandes de fréquences différente"""
	return json


def start_server():	
	"""Start the server."""
	server_address = ("", PORT)
	server = http.server.HTTPServer(server_address, TestHandler)
	server.serve_forever()

def charge_fichier():
	"""Lire et charger le fichier """
	fichier = open("./data.txt","r")
	fichier_entier = fichier.read()
	demi_fichier = fichier_entier.split("\n")
	tab_mots0 = demi_fichier[0].split(" ")
	tab_mots1 = demi_fichier[1].split(" ")
	colonnes = 7
	tab = [[-1] * colonnes for _ in range(nb_features)]
	index = 3
	""" index dans le fichier """
	for i in range(nb_features):
		bande = tab_mots0[index].split("-")
		tab[i][0] = bande[0]
		index = index + 6
	index = 3
	""" index dans le fichier """
	for i in range(nb_features):
		for j in range(6):
			tab[i][j+1] = tab_mots1[index]
			index = index+1
			"""pour pas commencer à 0 : correspond : 0 --> 400,500 ..."""
	fichier.close()
	return tab

start_server()
