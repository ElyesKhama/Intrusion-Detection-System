import http.server
import random
import time

FILE = 'visu.html'
PORT = 8000


class TestHandler(http.server.SimpleHTTPRequestHandler):
	"""The test example handler."""

	def do_POST(self):
		"""Handle a post request by returning the square of the number."""
		print(self.headers)
		length = int(self.headers.get_all('content-length')[0])
		print(self.headers.get_all('content-length'))
		data_string = self.rfile.read(length)
		print(data_string)
		self.send_response(200)
		self.send_header("Content-type", "text/plain")
		self.end_headers()
		self.flush_headers()
		tab = list()
		for i in range(8):
			tab.append(str(round(random.random(),2)))

		json = '{"nbtab":4, "tab":['+tab[0]+','+tab[1]+','+tab[2]+','+tab[3]+'], "tab2":['+tab[4]+','+tab[5]+','+tab[6]+','+tab[7]+']}'
		"""nbtab correspond au nombre de bandes de fréquences différente"""
		self.wfile.write(str(json).encode())
		time.sleep(0.2)

def start_server():	
	"""Start the server."""
	server_address = ("", PORT)
	server = http.server.HTTPServer(server_address, TestHandler)
	server.serve_forever()

start_server()
