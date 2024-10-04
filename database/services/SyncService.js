import database from '../database'; // Base de données WatermelonDB
import { synchronize } from '@nozbe/watermelondb/sync';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TypeMarche from '../models/TypeMarche';
import Marche from '../models/Marche';
import { Q } from '@nozbe/watermelondb';
import fiche from '../models/Fiche';

const SIMGUINEE_URL = 'https://sim-guinee.org/api/';

const SyncService = {
  syncDatabase: async () => {

  },

  syncTypeMarche: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }

      const parsedUserInfo = JSON.parse(userInfo);
      const id_collecteur = parsedUserInfo.collecteur;

      const url = `${SIMGUINEE_URL}parametrages/type-marches/mobile-dynamic-types?id_collecteur=${id_collecteur}`;
      console.log('URL de la requête:', url);
      // Récupérer les types de marché depuis l'API
      const response = await axios.get(`${SIMGUINEE_URL}parametrages/type-marches/mobile-dynamic-types?id_collecteur=${id_collecteur}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const typeMarcheData = response.data;
      // console.log('Types de marché synchronisés avec succès depuis l\'API.', typeMarcheData);

      const idTypeMarcheArray = [];  // Tableau pour stocker les id_type_marche

      // Mettre à jour la base de données locale WatermelonDB
      await database.write(async () => {
        const typeMarcheCollection = database.collections.get('types_marche');

        for (const item of typeMarcheData) {
          const typeMarche = item.type;  // Accès à l'objet `type`
          const nbreMarche = item.nbre_marche;

          idTypeMarcheArray.push(typeMarche.id_type_marche); // Stocker chaque id_type_marche
          console.log('type de marche id', idTypeMarcheArray);

          // Rechercher un enregistrement existant par id_type_marche
          const existingRecords = await typeMarcheCollection.query(Q.where('id_type_marche', typeMarche.id_type_marche)).fetch();

          if (existingRecords.length > 0) {
            // Si l'enregistrement existe, le mettre à jour
            await existingRecords[0].update(typeMarcheRecord => {
              typeMarcheRecord.id_type_marche = typeMarche.id_type_marche;
              typeMarcheRecord.code_type_marche = typeMarche.code_type_marche;
              typeMarcheRecord.nom_type_marche = typeMarche.nom_type_marche;
              typeMarcheRecord.description = typeMarche.description;
              typeMarcheRecord.nbre_marche = nbreMarche;
            });
          } else {
            // Si l'enregistrement n'existe pas, en créer un nouveau
            await typeMarcheCollection.create(typeMarcheRecord => {
              typeMarcheRecord.id_type_marche = typeMarche.id_type_marche;
              typeMarcheRecord.code_type_marche = typeMarche.code_type_marche;
              typeMarcheRecord.nom_type_marche = typeMarche.nom_type_marche;
              typeMarcheRecord.description = typeMarche.description;
              typeMarcheRecord.nbre_marche = nbreMarche;
            });
          }
        }
      });
      console.log('Types de marché synchronisés avec succès dans WatermelonDB.');

      return idTypeMarcheArray; // Retourner le tableau des id_type_marche
    } catch (error) {
      console.error('Erreur lors de la synchronisation des types de marché:', error);
    }
  },


  // Synchronisation des marchés en fonction du type de marché dynamique
  syncMarche: async (type_marche) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }

      const parsedUserInfo = JSON.parse(userInfo);
      const id_collecteur = parsedUserInfo.collecteur;


      const url = `${SIMGUINEE_URL}parametrages/type-marches/mobile-marches-par-type?id_collecteur=${id_collecteur}&type_marche=${type_marche}`;
      console.log('URL de la requête:', url);

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const marcheData = response.data;

      const marcheIds = []; // Liste pour stocker les ID de marchés

      await database.write(async () => {
        const marcheCollection = database.collections.get('marches');

        for (const item of marcheData) {
          const marche = item.marche;
          const nbre_fiche = item.nbre_fiche

          const existingRecords = await marcheCollection.query(Q.where('id_marche', marche.id_marche)).fetch();

          if (existingRecords.length > 0) {
            await existingRecords[0].update(marcheRecord => {
              marcheRecord.id_marche = marche.id_marche;
              marcheRecord.code_marche = marche.code_marche;
              marcheRecord.nom_marche = marche.nom_marche;
              marcheRecord.type_marche = marche.type_marche;
              marcheRecord.contact_collecteur = marche.contact_collecteur;
              marcheRecord.nom_type_marche = marche.nom_type_marche;
              marcheRecord.nom_collecteur = marche.nom_collecteur;
              marcheRecord.id_collecteur = marche.id_collecteur;
              marcheRecord.localite = marche.localite;
              marcheRecord.nom_region = marche.nom_region;
              marcheRecord.nom_prefecture = marche.nom_prefecture;
              marcheRecord.longitude = marche.longitude;
              marcheRecord.latitude = marche.latitude;
              marcheRecord.nbre_fiche = nbre_fiche;

            });
          } else {
            await marcheCollection.create(marcheRecord => {
              marcheRecord.id_marche = marche.id_marche;
              marcheRecord.code_marche = marche.code_marche;
              marcheRecord.nom_marche = marche.nom_marche;
              marcheRecord.type_marche = marche.type_marche;
              marcheRecord.contact_collecteur = marche.contact_collecteur;
              marcheRecord.nom_type_marche = marche.nom_type_marche;
              marcheRecord.nom_collecteur = marche.nom_collecteur;
              marcheRecord.id_collecteur = marche.id_collecteur;
              marcheRecord.localite = marche.localite;
              marcheRecord.nom_region = marche.nom_region;
              marcheRecord.nom_prefecture = marche.nom_prefecture;
              marcheRecord.longitude = marche.longitude;
              marcheRecord.latitude = marche.latitude;
              marcheRecord.nbre_fiche = nbre_fiche;

            });
          }
          marcheIds.push(marche.id_marche); // Ajouter l'ID du marché à la liste
        }
      });
      console.log('Marchés synchronisés avec succès dans WatermelonDB.');
      return marcheIds; // Retourner la liste des ID de marché
    } catch (error) {
      console.error('Erreur lors de la synchronisation des marchés:', error);
    }
  },


  syncProduits: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }

      // Appel de syncTypeMarche
      const typeMarcheArray = await SyncService.syncTypeMarche();
      if (!typeMarcheArray || typeMarcheArray.length === 0) {
        throw new Error('Erreur lors de la récupération des types de marché');
      }

      for (const typeMarche of typeMarcheArray) {
        const url = `${SIMGUINEE_URL}parametrages/produits?code_type_marche=${typeMarche}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const produits = response.data;

        if (!produits || produits.length === 0) {
          console.warn(`Aucun produit trouvé pour le type de marché: ${typeMarche}`);
          continue;
        }

        await database.write(async () => {
          const produitCollection = database.collections.get('produits');
          const categorieCollection = database.collections.get('categories_produit');
          const formeCollection = database.collections.get('formes_produit');
          const familleCollection = database.collections.get('familles_produit');

          for (const item of produits) {
            // Extraire les champs nécessaires avec des vérifications
            const { categorie = {}, forme = {}, famille = {} } = item;

            // Synchronisation des catégories
            if (categorie && categorie.id_categorie_produit) {
              const existingCategory = await categorieCollection
                .query(Q.where('id_categorie_produit', categorie.id_categorie_produit))
                .fetch();

              if (existingCategory.length > 0) {
                await existingCategory[0].update((categoryRecord) => {
                  categoryRecord.id_categorie_produit = categorie.id_categorie_produit;
                  categoryRecord.code_categorie_produit = categorie.code_categorie_produit || '';
                  categoryRecord.nom_categorie_produit = categorie.nom_categorie_produit || '';
                  categoryRecord.created_at = new Date(categorie.created_at).getTime();
                });
              } else {
                await categorieCollection.create((categoryRecord) => {
                  categoryRecord.id_categorie_produit = categorie.id_categorie_produit;
                  categoryRecord.code_categorie_produit = categorie.code_categorie_produit || '';
                  categoryRecord.nom_categorie_produit = categorie.nom_categorie_produit || '';
                  categoryRecord.created_at = new Date(categorie.created_at).getTime();
                });
              }
            }

            // Synchronisation des formes
            if (forme && forme.id_forme_produit) {
              const existingForme = await formeCollection
                .query(Q.where('id_forme_produit', forme.id_forme_produit))
                .fetch();

              if (existingForme.length > 0) {
                await existingForme[0].update((formeRecord) => {
                  formeRecord.id_forme_produit = forme.id_forme_produit;
                  formeRecord.code_forme_produit = forme.code_forme_produit || '';
                  formeRecord.nom_forme_produit = forme.nom_forme_produit || '';
                  formeRecord.created_at = new Date(forme.created_at).getTime();
                });
              } else {
                await formeCollection.create((formeRecord) => {
                  formeRecord.id_forme_produit = forme.id_forme_produit;
                  formeRecord.code_forme_produit = forme.code_forme_produit || '';
                  formeRecord.nom_forme_produit = forme.nom_forme_produit || '';
                  formeRecord.created_at = new Date(forme.created_at).getTime();
                });
              }
            } else {
              console.warn(`Aucune forme trouvée pour le produit: ${item.nom_produit}`);
            }

            // Synchronisation des familles
            if (famille && famille.id_famille_produit) {
              const existingFamille = await familleCollection
                .query(Q.where('id_famille_produit', famille.id_famille_produit))
                .fetch();

              if (existingFamille.length > 0) {
                await existingFamille[0].update((familleRecord) => {
                  familleRecord.id_famille_produit = famille.id_famille_produit;
                  familleRecord.code_famille_produit = famille.code_famille_produit || '';
                  familleRecord.nom_famille_produit = famille.nom_famille_produit || '';
                  familleRecord.affichage_ecran = famille.affichage_ecran || false;
                  familleRecord.created_at = new Date(famille.created_at).getTime();
                });
              } else {
                await familleCollection.create((familleRecord) => {
                  familleRecord.id_famille_produit = famille.id_famille_produit;
                  familleRecord.code_famille_produit = famille.code_famille_produit || '';
                  familleRecord.nom_famille_produit = famille.nom_famille_produit || '';
                  familleRecord.affichage_ecran = famille.affichage_ecran || false;
                  familleRecord.created_at = new Date(famille.created_at).getTime();
                });
              }
            }

            // Synchronisation des produits
            if (item.id_produit) {
              const existingProduct = await produitCollection
                .query(Q.where('id_produit', item.id_produit))
                .fetch();

              if (existingProduct.length > 0) {
                await existingProduct[0].update((produitRecord) => {
                  produitRecord.code_produit = item.code_produit || '';
                  produitRecord.nom_produit = item.nom_produit || '';
                  produitRecord.nom_produit_en = item.nom_produit_en || '';
                  produitRecord.categorie_produit = item.categorie_produit || 0;
                  produitRecord.forme_produit = item.forme_produit || 0;
                  produitRecord.type_marche = JSON.stringify(item.type_marche) || '';
                  produitRecord.famille_produit = item.famille_produit || 0;
                  produitRecord.affichage_ecran = item.affichage_ecran || false;
                  produitRecord.filiere = item.filiere || '';
                  produitRecord.image = item.image || '';
                  produitRecord.created_at = new Date(item.created_at).getTime();
                });
              } else {
                await produitCollection.create((produitRecord) => {
                  produitRecord.code_produit = item.code_produit || '';
                  produitRecord.nom_produit = item.nom_produit || '';
                  produitRecord.nom_produit_en = item.nom_produit_en || '';
                  produitRecord.categorie_produit = item.categorie_produit || 0;
                  produitRecord.forme_produit = item.forme_produit || 0;
                  produitRecord.type_marche = JSON.stringify(item.type_marche) || '';
                  produitRecord.famille_produit = item.famille_produit || 0;
                  produitRecord.affichage_ecran = item.affichage_ecran || false;
                  produitRecord.filiere = item.filiere || '';
                  produitRecord.image = item.image || '';
                  produitRecord.id_produit = item.id_produit;
                  produitRecord.created_at = new Date(item.created_at).getTime();
                });
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Erreur de synchronisation des produits:', error);
    }
  },

  syncUnites: async () => {
    try {
      console.log('Début de la synchronisation des unités...');

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }

      // Récupérer les types de marché
      const typeMarcheArray = await SyncService.syncTypeMarche();
      if (!typeMarcheArray || typeMarcheArray.length === 0) {
        throw new Error('Erreur lors de la récupération des types de marché');
      }

      // Boucle à travers chaque type de marché pour synchroniser les unités associées
      for (const typeMarcheId of typeMarcheArray) {
        const url = `${SIMGUINEE_URL}parametrages/unites/associated-unites/type-marche?id_of_type_market=${typeMarcheId}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;

        // Vérifier s'il y a des unités dans la réponse API
        if (!data || data.length === 0 || !data[0].unites || data[0].unites.length === 0) {
          console.warn(`Aucune unité trouvée pour le type de marché: ${typeMarcheId}`);
          continue;
        }

        console.log(`Réponse de l'API pour le type de marché ${typeMarcheId}:`, JSON.stringify(data, null, 2));

        await database.write(async () => {
          const uniteCollection = database.collections.get('unites');
          const uniteRelationCollection = database.collections.get('unite_relations');

          // Parcourir les unités pour ce type de marché
          for (const unite of data[0].unites) {
            const { id, unite_mesure, unite_relation } = unite;

            // Vérifier la validité des données de l'unité et de la relation
            if (!id || !unite_relation || !unite_relation.id_unite) {
              console.warn('Données d\'unité ou relation manquantes ou invalides:', unite);
              continue;
            }

            // Synchronisation ou création de l'unite_relation
            const existingRelation = await uniteRelationCollection.query(Q.where('id_unite', unite_relation.id_unite)).fetch();
            if (existingRelation.length > 0) {
              await existingRelation[0].update(uniteRelationRecord => {
                uniteRelationRecord.nom_unite = unite_relation.nom_unite;
                uniteRelationRecord.definition = unite_relation.definition;
                uniteRelationRecord.image = unite_relation.image || null;
                uniteRelationRecord.poids_indicatif = unite_relation.poids_indicatif || null;
              });
            } else {
              await uniteRelationCollection.create(uniteRelationRecord => {
                uniteRelationRecord.id_unite = unite_relation.id_unite;
                uniteRelationRecord.nom_unite = unite_relation.nom_unite;
                uniteRelationRecord.definition = unite_relation.definition;
                uniteRelationRecord.image = unite_relation.image || null;
                uniteRelationRecord.poids_indicatif = unite_relation.poids_indicatif || null;
                uniteRelationRecord.created_at = new Date().getTime();
              });
            }

            // Synchroniser ou créer l'unité
            const existingUnites = await uniteCollection.query(Q.where('id_unite', id)).fetch();
            if (existingUnites.length > 0) {
              await existingUnites[0].update(uniteRecord => {
                uniteRecord.type_marche = typeMarcheId;
                uniteRecord.unite_relation_id = unite_relation.id_unite;
                uniteRecord.unite_mesure = unite_mesure;
              });
            } else {
              await uniteCollection.create(uniteRecord => {
                uniteRecord.id_unite = id;
                uniteRecord.type_marche = typeMarcheId;
                uniteRecord.unite_relation_id = unite_relation.id_unite;
                uniteRecord.unite_mesure = unite_mesure;
              });
            }
            console.log(`Unité synchronisée: Nom = ${unite_relation.nom_unite}, ID = ${unite_relation.id_unite}`);
          }
        });

        console.log(`Synchronisation des unités pour le type de marché ${typeMarcheId} terminée.`);
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation des unités:', error);
    }
  },


  syncFiche: async (id_marche) => {
    try {
      if (!id_marche) {
        throw new Error('ID du marché manquant');
      }

      const token = await AsyncStorage.getItem('userToken');
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }

      const parsedUserInfo = JSON.parse(userInfo);
      const id_collecteur = parsedUserInfo.collecteur;

      const url = `${SIMGUINEE_URL}parametrages/type-marches/mobile-fiches-par-marche?id_collecteur=${id_collecteur}&id_marche=${id_marche}`;
      console.log('URL de la requête:', url);

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const ficheData = response.data;

      await database.write(async () => {
        const ficheCollection = database.collections.get('fiches');

        for (const item of ficheData) {
          const fiche = item.fiche;

          const existingRecords = await ficheCollection.query(Q.where('num_fiche', fiche.num_fiche)).fetch();

          if (existingRecords.length > 0) {
            await existingRecords[0].update(ficheRecord => {
              ficheRecord.num_fiche = fiche.num_fiche;
              ficheRecord.date_enquete = fiche.date_enquete;
              ficheRecord.marche = fiche.marche;
              ficheRecord.collecteur = fiche.collecteur;
              ficheRecord.external_id = fiche.id;
              ficheRecord.numero_point_collecte = fiche.numero_point_collecte;
              ficheRecord.nom_personne_enquete = fiche.nom_personne_enquete;
              ficheRecord.contact_personne_enquete = fiche.contact_personne_enquete;
              ficheRecord.source = 'api'; // Mise à jour de la source

              // Bétail
              ficheRecord.stock_initial_bovins = fiche.stock_initial_bovins;
              ficheRecord.nbr_bovins_debarques = fiche.nbr_bovins_debarques;
              ficheRecord.stock_soir_bovins = fiche.stock_soir_bovins;
              ficheRecord.nombre_bovin_vendu_calcule = fiche.nombre_bovin_vendu_calcule;
              ficheRecord.nombre_bovin_present_marche = fiche.nombre_bovin_present_marche;
              ficheRecord.nombre_tete_bovins_vendu = fiche.nombre_tete_bovins_vendu;
              ficheRecord.taureaux_4_8_ans_vendus = fiche.taureaux_4_8_ans_vendus;
              ficheRecord.taurillons_2_3_ans_vendus = fiche.taurillons_2_3_ans_vendus;
              ficheRecord.vaches_4_10_ans_vendus = fiche.vaches_4_10_ans_vendus;
              ficheRecord.genisses_2_3_ans_vendus = fiche.genisses_2_3_ans_vendus;
              ficheRecord.veaux_velles_0_12_mois = fiche.veaux_velles_0_12_mois;
              ficheRecord.destination_bovins_vendus = fiche.destination_bovins_vendus;
              ficheRecord.origine_bovins_debarques = fiche.origine_bovins_debarques;

              // Ovins
              ficheRecord.stock_initial_ovins = fiche.stock_initial_ovins;
              ficheRecord.nombre_ovins_debarques = fiche.nombre_ovins_debarques;
              ficheRecord.stock_soir_ovins = fiche.stock_soir_ovins;
              ficheRecord.nombre_ovins_presentes_marche = fiche.nombre_ovins_presentes_marche;
              ficheRecord.nombre_ovins_vendus = fiche.nombre_ovins_vendus;
              ficheRecord.ovins_males_femelles_0_12_vendus = fiche.ovins_males_femelles_0_12_vendus;
              ficheRecord.ovins_males_femelles_plus_1_vendus = fiche.ovins_males_femelles_plus_1_vendus;
              ficheRecord.destination_ovins_vendus = fiche.destination_ovins_vendus;
              ficheRecord.origine_ovins_debarques = fiche.origine_ovins_debarques;

              // Caprins
              ficheRecord.stock_initial_caprins = fiche.stock_initial_caprins;
              ficheRecord.nombre_caprins_debarques = fiche.nombre_caprins_debarques;
              ficheRecord.stock_soir_caprins = fiche.stock_soir_caprins;
              ficheRecord.nombre_caprins_presentes_marche = fiche.nombre_caprins_presentes_marche;
              ficheRecord.nombre_caprins_vendus = fiche.nombre_caprins_vendus;
              ficheRecord.caprins_males_femelles_0_12_ans = fiche.caprins_males_femelles_0_12_ans;
              ficheRecord.caprins_males_femelles_plus_1_ans = fiche.caprins_males_femelles_plus_1_ans;
              ficheRecord.destination_caprins_vendus = fiche.destination_caprins_vendus;
              ficheRecord.origine_caprins_debarques = fiche.origine_caprins_debarques;

              // Débarcadère
              ficheRecord.type_embarcation = fiche.type_embarcation;
              ficheRecord.espece_presente = fiche.espece_presente;
              ficheRecord.difficultes_rencontrees = fiche.difficultes_rencontrees;
              ficheRecord.nbr_barques_rentres_jour = fiche.nbr_barques_rentres_jour;
              ficheRecord.heure_fin_collecte_semaine = fiche.heure_fin_collecte_semaine;
            });
          } else {
            await ficheCollection.create(ficheRecord => {
              ficheRecord.num_fiche = fiche.num_fiche;
              ficheRecord.date_enquete = fiche.date_enquete;
              ficheRecord.marche = fiche.marche;
              ficheRecord.collecteur = fiche.collecteur;
              ficheRecord.external_id = fiche.id;
              ficheRecord.numero_point_collecte = fiche.numero_point_collecte;
              ficheRecord.nom_personne_enquete = fiche.nom_personne_enquete;
              ficheRecord.contact_personne_enquete = fiche.contact_personne_enquete;
              ficheRecord.source = 'api'; // Mise à jour de la source

              // Bétail
              ficheRecord.stock_initial_bovins = fiche.stock_initial_bovins;
              ficheRecord.nbr_bovins_debarques = fiche.nbr_bovins_debarques;
              ficheRecord.stock_soir_bovins = fiche.stock_soir_bovins;
              ficheRecord.nombre_bovin_vendu_calcule = fiche.nombre_bovin_vendu_calcule;
              ficheRecord.nombre_bovin_present_marche = fiche.nombre_bovin_present_marche;
              ficheRecord.nombre_tete_bovins_vendu = fiche.nombre_tete_bovins_vendu;
              ficheRecord.taureaux_4_8_ans_vendus = fiche.taureaux_4_8_ans_vendus;
              ficheRecord.taurillons_2_3_ans_vendus = fiche.taurillons_2_3_ans_vendus;
              ficheRecord.vaches_4_10_ans_vendus = fiche.vaches_4_10_ans_vendus;
              ficheRecord.genisses_2_3_ans_vendus = fiche.genisses_2_3_ans_vendus;
              ficheRecord.veaux_velles_0_12_mois = fiche.veaux_velles_0_12_mois;
              ficheRecord.destination_bovins_vendus = fiche.destination_bovins_vendus;
              ficheRecord.origine_bovins_debarques = fiche.origine_bovins_debarques;

              // Ovins
              ficheRecord.stock_initial_ovins = fiche.stock_initial_ovins;
              ficheRecord.nombre_ovins_debarques = fiche.nombre_ovins_debarques;
              ficheRecord.stock_soir_ovins = fiche.stock_soir_ovins;
              ficheRecord.nombre_ovins_presentes_marche = fiche.nombre_ovins_presentes_marche;
              ficheRecord.nombre_ovins_vendus = fiche.nombre_ovins_vendus;
              ficheRecord.ovins_males_femelles_0_12_vendus = fiche.ovins_males_femelles_0_12_vendus;
              ficheRecord.ovins_males_femelles_plus_1_vendus = fiche.ovins_males_femelles_plus_1_vendus;
              ficheRecord.destination_ovins_vendus = fiche.destination_ovins_vendus;
              ficheRecord.origine_ovins_debarques = fiche.origine_ovins_debarques;

              // Caprins
              ficheRecord.stock_initial_caprins = fiche.stock_initial_caprins;
              ficheRecord.nombre_caprins_debarques = fiche.nombre_caprins_debarques;
              ficheRecord.stock_soir_caprins = fiche.stock_soir_caprins;
              ficheRecord.nombre_caprins_presentes_marche = fiche.nombre_caprins_presentes_marche;
              ficheRecord.nombre_caprins_vendus = fiche.nombre_caprins_vendus;
              ficheRecord.caprins_males_femelles_0_12_ans = fiche.caprins_males_femelles_0_12_ans;
              ficheRecord.caprins_males_femelles_plus_1_ans = fiche.caprins_males_femelles_plus_1_ans;
              ficheRecord.destination_caprins_vendus = fiche.destination_caprins_vendus;
              ficheRecord.origine_caprins_debarques = fiche.origine_caprins_debarques;

              // Débarcadère
              ficheRecord.type_embarcation = fiche.type_embarcation;
              ficheRecord.espece_presente = fiche.espece_presente;
              ficheRecord.difficultes_rencontrees = fiche.difficultes_rencontrees;
              ficheRecord.nbr_barques_rentres_jour = fiche.nbr_barques_rentres_jour;
              ficheRecord.heure_fin_collecte_semaine = fiche.heure_fin_collecte_semaine;
            });
          }
        }
      });

      console.log('Fiches synchronisées avec succès dans WatermelonDB.');
    } catch (error) {
      console.error('Erreur lors de la synchronisation des fiches:', error);
    }
  },

  
  syncAllMarches: async () => {
    try {
      const idTypeMarcheArray = await SyncService.syncTypeMarche();
      console.log('Liste des types de marché synchronisés:', idTypeMarcheArray);

      if (idTypeMarcheArray.length === 0) {
        console.error('Aucun type de marché trouvé.');
        return; // Sortir si aucun type de marché n'est trouvé
      }

      for (const type_marche of idTypeMarcheArray) {
        if (type_marche) { // Vérifiez que type_marche n'est pas falsy
          await SyncService.syncMarche(type_marche);
        } else {
          console.error('Type de marché est undefined, vérifiez vos données.');
        }
      }
      // pour la partie fiche des marche
      const typeMarcheIds = await SyncService.syncTypeMarche();
      for (const idTypeMarche of typeMarcheIds) {
        const marcheIds = await SyncService.syncMarche(idTypeMarche);

        for (const idMarche of marcheIds) {
          await SyncService.syncFiche(idMarche);
        }
      }


    } catch (error) {
      console.error('Erreur lors de la synchronisation globale des marchés:', error);
    }
  },

  syncFiches: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }

      await database.write(async () => {
        const ficheCollection = database.collections.get('fiches');
        const fichesToSync = await ficheCollection.query(Q.where('source', 'local')).fetch(); // Récupérer les fiches non synchronisées
        for (const fiche of fichesToSync) {
          const ficheData = fiche._raw; // Utiliser _raw pour accéder directement aux données
          console.log('les donne ligne', ficheData);

          let url;
          let dataToSend = {}; // Contiendra les données à envoyer, filtrées selon le type de marché
          // console.log('dataToSend',dataToSend + ' url associer ' + url);

          switch (ficheData.id_type_marche) {
            case 1:
              url = `${SIMGUINEE_URL}enquetes/Fiches/collectes`;
              dataToSend = {
                num_fiche: ficheData.num_fiche,
                date_enquete: ficheData.date_enquete,
                marche: ficheData.marche,
                collecteur: ficheData.collecteur,
              };
              break;
            case 2:
              url = `${SIMGUINEE_URL}enquetes/Fiches/grossistes`;
              dataToSend = {
                num_fiche: ficheData.num_fiche,
                date_enquete: ficheData.date_enquete,
                marche: ficheData.marche,
                collecteur: ficheData.collecteur,
                numero_point_collecte: ficheData.numero_point_collecte,
                nom_personne_enquete: ficheData.nom_personne_enquete,
                contact_personne_enquete: ficheData.contact_personne_enquete,
              };
              break;
            case 3:
              url = `${SIMGUINEE_URL}enquetes/Fiches/consommations`;
              dataToSend = {
                num_fiche: ficheData.num_fiche,
                date_enquete: ficheData.date_enquete,
                marche: ficheData.marche,
                collecteur: ficheData.collecteur,
              };
              break;
            case 4:
              url = `${SIMGUINEE_URL}enquetes/Fiches/collectes`;
              dataToSend = {
                num_fiche: ficheData.num_fiche,
                date_enquete: ficheData.date_enquete,
                marche: ficheData.marche,
                collecteur: ficheData.collecteur,
              };
              break;
            case 6:
              url = `${SIMGUINEE_URL}enquetes/Fiches/debarcadere-ports`;
              dataToSend = {
                num_fiche: ficheData.num_fiche,
                date_enquete: ficheData.date_enquete,
                marche: ficheData.marche,
                collecteur: ficheData.collecteur,
                type_embarcation: ficheData.type_embarcation,
                espece_presente: ficheData.espece_presente,
                difficultes_rencontrees: ficheData.difficultes_rencontrees,
                nbr_barques_rentres_jour: ficheData.nbr_barques_rentres_jour,
                heure_fin_collecte_semaine: ficheData.heure_fin_collecte_semaine,
              };
              break;
            case 7:
              url = `${SIMGUINEE_URL}enquetes/Fiches/debarcadere-ports`;
              dataToSend = {
                num_fiche: ficheData.num_fiche,
                date_enquete: ficheData.date_enquete,
                marche: ficheData.marche,
                collecteur: ficheData.collecteur,
                type_embarcation: ficheData.type_embarcation,
                espece_presente: ficheData.espece_presente,
                difficultes_rencontrees: ficheData.difficultes_rencontrees,
                nbr_barques_rentres_jour: ficheData.nbr_barques_rentres_jour,
                heure_fin_collecte_semaine: ficheData.heure_fin_collecte_semaine,
              };
              break;
              case 8:
                url = `${SIMGUINEE_URL}enquetes/Fiches/collectes`;
                dataToSend = {
                  num_fiche: ficheData.num_fiche,
                  date_enquete: ficheData.date_enquete,
                  marche: ficheData.marche,
                  collecteur: ficheData.collecteur,
                };
                break;
            case 5:
              url = `${SIMGUINEE_URL}enquetes/Fiches/betails`;
              dataToSend = {
                num_fiche: ficheData.num_fiche,
                date_enquete: ficheData.date_enquete,
                marche: ficheData.marche,
                collecteur: ficheData.collecteur,
               stock_initial_bovins: ficheData.stock_initial_bovins,
                nbr_bovins_debarques: ficheData.nbr_bovins_debarques,
                stock_soir_bovins : ficheData.stock_soir_bovins,
                nombre_bovin_vendu_calcule : ficheData.nombre_bovin_vendu_calcule,
                nombre_bovin_present_marche : ficheData.nombre_bovin_present_marche,
                nombre_tete_bovins_vendu : ficheData.nombre_tete_bovins_vendu,
                taureaux_4_8_ans_vendus  : ficheData.taureaux_4_8_ans_vendus,
                taurillons_2_3_ans_vendus  : ficheData.taurillons_2_3_ans_vendus,
                vaches_4_10_ans_vendus  : ficheData.vaches_4_10_ans_vendus,
                genisses_2_3_ans_vendus : ficheData.genisses_2_3_ans_vendus,
                veaux_velles_0_12_mois : ficheData.veaux_velles_0_12_mois,
                destination_bovins_vendus : ficheData.destination_bovins_vendus,
                origine_bovins_debarques : ficheData.origine_bovins_debarques,
                stock_initial_ovins : ficheData.stock_initial_ovins,
              nombre_ovins_debarques : ficheData.nombre_ovins_debarques,
                stock_soir_ovins : ficheData.stock_soir_ovins,
                nombre_ovins_presentes_marche : ficheData.nombre_ovins_presentes_marche,
                nombre_ovins_vendus : ficheData.nombre_ovins_vendus,
                ovins_males_femelles_0_12_vendus : ficheData.ovins_males_femelles_0_12_vendus,
                ovins_males_femelles_plus_1_vendus : ficheData.ovins_males_femelles_plus_1_vendus,
                destination_ovins_vendus : ficheData.destination_ovins_vendus,
                origine_ovins_debarques : ficheData.origine_ovins_debarques,
                stock_initial_caprins : ficheData.stock_initial_caprins,
                nombre_caprins_debarques : ficheData.nombre_caprins_debarques,
                stock_soir_caprins : ficheData.stock_soir_caprins,
                nombre_caprins_presentes_marche : ficheData.nombre_caprins_presentes_marche,
                nombre_caprins_vendus : ficheData.nombre_caprins_vendus,
                caprins_males_femelles_0_12_ans : ficheData.caprins_males_femelles_0_12_ans,
                caprins_males_femelles_plus_1_ans  : ficheData.caprins_males_femelles_plus_1_ans,
                destination_caprins_vendus : ficheData.destination_caprins_vendus,
                origine_caprins_debarques : ficheData.origine_caprins_debarques,
              };
              break;
            default:
              console.error(`Type de fiche non reconnu: ${ficheData.id_type_marche}`);
              continue; // Passer à la fiche suivante
          }
          try {
            // Envoyer les données à l'API correspondante
            const response = await axios.post(url, dataToSend, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            console.log('Réponse de l\'API:', response.data);
            console.log('dataToSend', dataToSend + ' url associer ' + url);
            // Mettre à jour la source de la fiche à 'api' après synchronisation
            await fiche.update(ficheRecord => {
              ficheRecord.source = 'api';
            });
            console.log(`Réponse de l'API pour la fiche ${ficheData.num_fiche}:`, response.data);


            console.log(`Fiche ${ficheData.num_fiche} synchronisée avec succès.`);
          } catch (apiError) {
            console.error('Erreur lors de l\'envoi des données à l\'API:', apiError.response ? apiError.response.data : apiError.message);
          }

        }
      });
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    }
  },

  syncOrigineProduit: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }
  
      const url = `${SIMGUINEE_URL}parametrages/origines`;
      console.log('URL de la requête:', url);
  
      // Récupérer les origines des produits depuis l'API
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const origineProduitData = response.data;
      const idOrigineProduitArray = [];  // Tableau pour stocker les id_origine_produit
  
      // Mettre à jour la base de données locale WatermelonDB
      await database.write(async () => {
        const origineProduitCollection = database.collections.get('origines_produits');
  
        for (const item of origineProduitData) {
          const idOrigineProduit = item.id_origine_produit;
  
          idOrigineProduitArray.push(idOrigineProduit); // Stocker chaque id_origine_produit
          console.log('Origine produit ID:', idOrigineProduit);
  
          // Rechercher un enregistrement existant par id_origine_produit
          const existingRecords = await origineProduitCollection.query(Q.where('id_origine_produit', idOrigineProduit)).fetch();
  
          if (existingRecords.length > 0) {
            // Si l'enregistrement existe, le mettre à jour
            await existingRecords[0].update(origineProduitRecord => {
              origineProduitRecord.id_origine_produit = item.id_origine_produit;
              origineProduitRecord.code_origine_produit = item.code_origine_produit;
              origineProduitRecord.nom_origine_produit = item.nom_origine_produit;
              origineProduitRecord.created_at = item.created_at;
            });
          } else {
            // Si l'enregistrement n'existe pas, en créer un nouveau
            await origineProduitCollection.create(origineProduitRecord => {
              origineProduitRecord.id_origine_produit = item.id_origine_produit;
              origineProduitRecord.code_origine_produit = item.code_origine_produit;
              origineProduitRecord.nom_origine_produit = item.nom_origine_produit;
              origineProduitRecord.created_at = item.created_at;
            });
          }
        }
      });
      console.log('Origines des produits synchronisées avec succès dans WatermelonDB.');
  
      return idOrigineProduitArray; // Retourner le tableau des id_origine_produit
    } catch (error) {
      console.error('Erreur lors de la synchronisation des origines des produits:', error);
    }
  },
  
  getUserInfo: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${SIMGUINEE_URL}parametrages/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userInfo = {
        Prenoms: response.data.firstname,
        Nom: response.data.lastname,
        collecteur: response.data.collecteur
      };

      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      return userInfo;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      throw error;
    }
  },
};

export default SyncService;











// countApiFiches : async () => {
//   try {
//     const apiFichesCount = await database.collections
//       .get('fiches')
//       .query(Q.where('source', 'api'))
//       .fetchCount();
//     return apiFichesCount;
//   } catch (error) {
//     console.error('Erreur lors du comptage des fiches synchronisées:', error);
//     return 0;
//   }
// },
//  countLocalFiches : async () => {
//   try {
//     const localFichesCount = await database.collections
//       .get('fiches')
//       .query(Q.where('source', 'local'))
//       .fetchCount();
//     return localFichesCount;
//   } catch (error) {
//     console.error('Erreur lors du comptage des fiches locales:', error);
//     return 0;
//   }
// }