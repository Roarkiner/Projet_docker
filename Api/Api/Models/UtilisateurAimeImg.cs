﻿namespace Api.Models;

public sealed class UtilisateurAimeImg
{
    public required string UrlImage { get; init; }
    public int IdUtilisateur { get; init; }
    public bool Aime { get; init; }
}
