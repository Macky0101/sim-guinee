import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class CategorieProduit extends Model {
  static table = 'categories_produit';

  @field('id_categorie_produit') id_categorie_produit;
  @field('code_categorie_produit') code_categorie_produit;
  @field('nom_categorie_produit') nom_categorie_produit;
  @date('created_at') createdAt;
}
