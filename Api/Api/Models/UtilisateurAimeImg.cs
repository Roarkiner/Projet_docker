﻿namespace Api.Models;

public sealed class UtilisateurAimeImg
{
    public int IdImage { get; init; }
    public int IdUtilisateur { get; init; }
    public bool Aime { get; init; }
}