import time

def charge_fichier():
	"""Lire et charger le fichier """
	nb_features = 49
	fichier_data50 = open("./data50.txt","r")
	fichier_entier = fichier_data50.read()
	demi_fichier = fichier_entier.split("\n")
	for i in range(48):
		time.sleep(3)
		fichier_data = open("./data.txt","w")
		fichier_data.write(demi_fichier[0] +"\n"+demi_fichier[i+1])
		fichier_data.close()

	fichier_data50.close()

charge_fichier()

"""script qui va générer les différentes valeurs à interval regulier dans le fichier data.txt"""
