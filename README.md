# DHIS 2 COVID CLASSIFICATION FINALE

Ce script est utilisé pour aider à la classification automatique des cas dans le dhis 2 covid.

# ETAPES

* Mise en place du script
Ce script a été ecrit en nodejs, par consequent la machine qui doit l'executer doit avoir nodejs 12+ installé
* Configuration
le fichier de configuration se dans le dossier config. Il faudra le renommer en default.json
* Données à traiter
Les donnees doivent etre dans le fichier data.js qui se trouve à la racine. Ce fichier doit contenir sous forme d'un tableau, les uid des events à traiter.
* Point d'entrée
Le point d'entrée du script est le fichier server.js. Pour l'executer il faut lancer la commande npm start.
* Les logs
Les logs se trouvent dans le dossier logs


