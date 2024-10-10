
// models/FormulaireTranfrontalier.js
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class FormulaireTransfrontalier extends Model {
    static table = 'formulaire_tranfrontalier';

    @field('unite')unite;
    @field('date_enquete')date_enquete;
    @field('prix_vente')prix_vente;
    @field('prix_achat')prix_achat;
    @field('collecteur')collecteur;
    @field('quantite_sortant')quantite_sortant;
    @field('region_provenance')region_provenance;
    @field('region_destination')region_destination;
    @field('quantite_entrant')quantite_entrant;
    @field('pays_destination')pays_destination;
    @field('pays_origine')pays_origine;
    @field('observation')observation;
    @field('enquete')enquete;
    @field('produit')produit;
    @field('fiche_id') fiche_id; // Champ de relation
    @field('NumFiche') NumFiche; 

    // Relation avec Fiche
    @relation('fiches', 'fiche_id') fiche;
}
