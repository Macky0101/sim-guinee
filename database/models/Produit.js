import { Model } from '@nozbe/watermelondb';
import { field, relation, date, json, children } from '@nozbe/watermelondb/decorators';

export default class Produit extends Model {
  static table = 'produits';

  @field('code_produit') code_produit;
  @field('nom_produit') nom_produit;
  @field('nom_produit_en') nom_produit_en;
  @field('categorie_produit') categorie_produit;
  @field('forme_produit') forme_produit;
  @json('type_marche', JSON.parse) type_marche;
  @field('famille_produit') famille_produit;
  @field('affichage_ecran') affichage_ecran;
  @field('filiere') filiere;
  @field('image') image;
  @field('id_produit') id_produit;
  @date('created_at') createdAt;

  // Relations
  @relation('categories_produit', 'categorie_produit') categorie;
  @relation('formes_produit', 'forme_produit') forme;
  @relation('familles_produit', 'famille_produit') famille;
}
