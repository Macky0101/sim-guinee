// models/FormulaireGrossiste.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class FormulaireGrossiste extends Model {
    static table = 'formulaire_grossiste';

    @field('unite_stock') unite_stock;
    @field('stock_anterieur') stock_anterieur;
    @field('poids_moyen_unite_stock') poids_moyen_unite_stock;
    @field('poids_stock') poids_stock;
    @field('stock_du_jour') stock_du_jour;
    @field('quantite_entree') quantite_entree;
    @field('fournisseur_principaux') fournisseur_principaux;
    @field('nombre_unite_achat') nombre_unite_achat;
    @field('unite_achat') unite_achat;
    @field('unite_vente') unite_vente;
    @field('prix_achat') prix_achat;
    @field('prix_unitaire_vente') prix_unitaire_vente;
    @field('localite_achat') localite_achat;
    @field('client_vente') client_vente;
    @field('autre_client_principal') autre_client_principal;
    @field('statut') statut;
    @field('observation') observation;
    @field('enquete') enquete;
    @field('produit') produit;
    @field('fiche_id') fiche_id; // Champ de relation
    @field('NumFiche') NumFiche; 

    // Relation avec Fiche
    @relation('fiches', 'fiche_id') fiche;
}
