import { Model } from '@nozbe/watermelondb';
import { field, writer } from '@nozbe/watermelondb/decorators';

export class Collecte extends Model {
  static table = 'collecte';

  @field('unite') unite;
  @field('poids_unitaire') poids_unitaire;
  @field('montant_achat') montant_achat;
  @field('prix_fg_kg') prix_fg_kg;
  @field('etat_route') etat_route;
  @field('quantite_collecte') quantite_collecte;
  @field('niveau_approvisionement') niveau_approvisionement;
  @field('statut') statut;
  @field('observation') observation;
  @field('etat') etat;
  @field('enquete') enquete;
  @field('produit') produit;
  @field('destination_finale') destination_finale;
  @field('num_fiche') numFiche;

  // Méthode pour marquer comme supprimé
  @writer async deleteCollecte() {
    await this.markAsDeleted(); // Marque pour synchronisation
  }

  // Méthode pour mettre à jour un champ
  @writer async updateCollecte(fieldsToUpdate) {
    await this.update(collecte => {
      Object.keys(fieldsToUpdate).forEach(field => {
        collecte[field] = fieldsToUpdate[field];
      });
    });
  }
}
