import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class OrigineProduit extends Model {
  static table = 'origines_produits';  // Nom de la table

  @field('id_origine_produit') id_origine_produit;
  @field('code_origine_produit') code_origine_produit;
  @field('nom_origine_produit') nom_origine_produit;
  @field('created_at') created_at;
}
