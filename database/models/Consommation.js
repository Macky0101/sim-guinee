import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Consommation extends Model {
  static table = 'consommation';

  @field('unite') unite;
  @field('poids_unitaire') poids_unitaire;
  @field('prix_mesure') prix_mesure;
  @field('prix_fg_kg') prix_fg_kg;
  @field('prix_kg_litre') prix_kg_litre;
  @field('niveau_approvisionement') niveau_approvisionement;
  @field('statut') statut;
  @field('observation') observation;
  @field('enquete') enquete;
  @field('produit') produit;
  // @field('document') document;
  @field('num_fiche') numFiche;
}
