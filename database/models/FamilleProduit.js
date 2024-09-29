import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class FamilleProduit extends Model {
  static table = 'familles_produit';

  @field('id_famille_produit') id_famille_produit;
  @field('code_famille_produit') code_famille_produit;
  @field('nom_famille_produit') nom_famille_produit;
  @field('affichage_ecran') affichage_ecran;
  @date('created_at') createdAt;
}
