CREATE DATABASE IF NOT EXISTS EcoleDocker;

CREATE TABLE IF NOT EXISTS EcoleDocker.Utilisateur (
    Id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Login VARCHAR(200) NOT NULL,
    Mdp VARCHAR(300) NOT NULL,
    Nom VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS EcoleDocker.UtilisateurAimeImage (
    IdUtilisateur INT NOT NULL,
    UrlImage VARCHAR(300) NOT NULL,

    Aime TINYINT(1) NOT NULL,

    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur (Id),
);

INSERT INTO EcoleDocker.Utilisateur (Id, Login, Mdp, Nom) VALUES (1, "string", "7Hi/Kz97PLjzepAJfxlVKA==$VO5njhbFfFq2SltzGcJq/Vr24FypKv4CYxF/9NLmfss=", "test");