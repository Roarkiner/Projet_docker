# Projet Docker PinterHess

## Table des matières

- [Exécution](#exécution)
- [Utilisation](#utilisation)
  - [Fonctionnalités du front](#fonctionnalités-du-front)
- [Architecture](#architecture)
- [Choix technologiques](#choix-technologiques)

---
## Exécution

Vérifiez que docker et docker-compose sont installés sur votre machine.

```bash
docker -v
docker-compose -v
```

Clonez le repository puis, dans un terminal, placez vous dans le premier répertoire Api. Faites :

```bash
docker-compose up
```

Il faut maintenant attendre que tous les conteneurs soient lancés et prêts.

## Utilisation

Deux services sont accessibles via le navigateur : PHPMyAdmin pour explorer la base de données et une UI en React.
- PHPMyAdmin est accessible à l'adresse : *http://localhost:8000*
  - Login : *root*
  - Mot de passe : *root*
- L'UI Front est accessible à l'adresse : *http://localhost:9000*. Deux utilisateurs existent par défaut.
  - Login : *admin* ; Mot de passe : *adminadmin*
  - Login : "test" ; "Mot de passe : "adminadmin*

### Fonctionnalités du front

Vous pouvez vous conncter à un utilisateur existant et créer autant d'utilisateurs que vous souhaitez.
La page principale est une page contenant des images, que vous pouvez liker ou disliker une fois connecté.
Le dossier *gallery_images* à la racine du projet contient toutes les images qui sont affichées. Vous pouvez en ajouter ou supprimer à loisir. **Notez cependant que renommer une image fera perdre les likes et dislikes**

## Architecture

![image](https://github.com/user-attachments/assets/e4ee6656-86bc-4fee-8ab7-6d22dbb8b506)

## Choix technologiques

Nous avons choisi d'utiliser PHPMyAdmin pour faciliter le développement, et permettre un accès simple et graphique à la base de données.

Nous avons choisi MySQL pour la facilité d'utilisation sur un projet aussi basique, en utilisant l'image officielle qui contenait déjà tout ce qu'il faut pour se lancer.

Le choix d'ASP Net et React sont de purs choix de confort.

Nous avons fait deux réseaux distints : le réseau *internal-network* pour les services intéragissant directement avec la base de données (PHPMyAdmin, MySQL et API) et un deuxième *app-network* pour l'API et le Front. Ainsi nous nous assurons que le front ne puisse en aucun cas interragir avec la base de données diretcement.

L'API n'est accessible que via le Front, le navigateur ne peut pas directement appeler l'API qui se trouve dans le réseau interne à Docker, sans port ouvert vers l'extérieur. Pour pouvoir faire des requêtes à l'API nous avons fait en sorte que toutes les requêtes vers *http://localhost:9000/api/* soient ensuite redirigées vers l'API, en utilisant Nginx comme un proxy. La configuration de Nginx se trouve dans */Front/pinterhess/nginx.conf*, et est copié en tant que configuration par défaut de nging au build du Dockerfile front.

Merci pour votre lecture !
