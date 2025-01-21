CREATE DATABASE IF NOT EXISTS EcoleDocker;

CREATE TABLE IF NOT EXISTS EcoleDocker.Utilisateur (
    Id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Login VARCHAR(200) NOT NULL,
    Mdp VARCHAR(300) NOT NULL,
    Nom VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS EcoleDocker.Image (
    Id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Url VARCHAR(1000) NOT NULL
);

CREATE TABLE IF NOT EXISTS EcoleDocker.UtilisateurAimeImage (
    IdUtilisateur INT NOT NULL,
    IdImage INT NOT NULL,

    Aime TINYINT(1) NOT NULL,

    PRIMARY KEY (IdUtilisateur, IdImage),
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur (Id),
    FOREIGN KEY (IdImage) REFERENCES Image (Id)
);

INSERT INTO EcoleDocker.Utilisateur (Id, Login, Mdp, Nom) VALUES (1, "string", "7Hi/Kz97PLjzepAJfxlVKA==$VO5njhbFfFq2SltzGcJq/Vr24FypKv4CYxF/9NLmfss=", "test");
INSERT INTO EcoleDocker.Image (Id, Url) VALUES (1, "img1.png"), (2, "img2.png"), (3, "img3.png"), (4, "img4.png");