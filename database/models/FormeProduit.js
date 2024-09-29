import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class FormeProduit extends Model {
  static table = 'formes_produit';

  @field('id_forme_produit') id_forme_produit;
  @field('code_forme_produit') code_forme_produit;
  @field('nom_forme_produit') nom_forme_produit;
  @date('created_at') createdAt;
}
