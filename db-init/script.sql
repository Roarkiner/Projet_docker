CREATE DATABASE IF NOT EXISTS EcoleDocker;

USE EcoleDocker;

CREATE TABLE IF NOT EXISTS Utilisateur (
    Id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Login VARCHAR(200) NOT NULL,
    Mdp VARCHAR(300) NOT NULL,
    Nom VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS UtilisateurAimeImage (
    IdUtilisateur INT NOT NULL,
    UrlImage VARCHAR(300) NOT NULL,
    Aime TINYINT(1) NOT NULL,

    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur (Id)
);

INSERT INTO Utilisateur (Id, Login, Mdp, Nom) 
VALUES 
    (1, "admin", "7Hi/Kz97PLjzepAJfxlVKA==$VO5njhbFfFq2SltzGcJq/Vr24FypKv4CYxF/9NLmfss=", "Frank"), 
    (2, "test", "7Hi/Kz97PLjzepAJfxlVKA==$VO5njhbFfFq2SltzGcJq/Vr24FypKv4CYxF/9NLmfss=", "Michel");

INSERT INTO UtilisateurAimeImage (IdUtilisateur, UrlImage, Aime) 
VALUES 
    (1, "image1.png", 1), 
    (1, "image2.png", 1), 
    (1, "image3.png", 0), 
    (2, "image1.png", 1), 
    (2, "image3.png", 1);
