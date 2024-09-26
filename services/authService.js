// services/AuthService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SyncService from "../database/services/SyncService";

const SIMGUINEE_URL = 'https://sim-guinee.org/api/';

const AuthService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${SIMGUINEE_URL}login`, { username, password });
      if (response.data.access_token) {
        // Stocker le token après connexion réussie
        await AsyncStorage.setItem('userToken', response.data.access_token);
        
        // Appeler getUserInfo après la connexion
        const userInfo = await AuthService.getUserInfo();

        if (userInfo && userInfo.collecteur) {
          // Appeler la synchronisation des types de marché après avoir récupéré les infos utilisateur
          await SyncService.syncTypeMarche();
          await SyncService.syncAllMarches(); // Démarre la synchronisation manuelle
          // await SyncService.syncMarche();
        } else {
          throw new Error("Impossible de récupérer l'ID du collecteur.");
        }
      } else {
        throw new Error('Utilisateur non authentifié');
      }
    } catch (error) {
      console.error('Login Error:', error.response || error);
      throw new Error('Erreur de connexion. Veuillez vérifier vos identifiants.');
    }
  },

  getUserInfo: async () => { // Passer la base de données en paramètre
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${SIMGUINEE_URL}parametrages/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log('user info', response.data);

      const userInfo = {
        Prenoms: response.data.firstname,
        Nom: response.data.lastname,
        collecteur: response.data.collecteur
      };

      // Stocker les informations de l'utilisateur dans AsyncStorage
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

      return userInfo;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      throw error;
    }
  },

  getFicheCollecteur: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }

      const parsedUserInfo = JSON.parse(userInfo);
      const id_collecteur = parsedUserInfo.collecteur;

      const response = await axios.get(`${SIMGUINEE_URL}parametrages/type-marches/mobile-dynamic-types?id_collecteur=${id_collecteur}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // console.log('Liste de fiches pour le collecteur connecté:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des fiches du collecteur:', error);
      throw error;
    }
  },

  getMarchesParType: async (id_collecteur, type_marche) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }

      const response = await axios.get(`${SIMGUINEE_URL}parametrages/type-marches/mobile-marches-par-type?id_collecteur=${id_collecteur}&type_marche=${type_marche}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data; // Retourne les données des marchés
    } catch (error) {
      console.error('Erreur lors de la récupération des marchés par type:', error);
      throw error;
    }
  },

  changePassword: async (oldPassword, newPassword, newPasswordConfirmation) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.post(
          `${SIMGUINEE_URL}auth-change-password`,
          {
            old_password: oldPassword,
            password: newPassword,
            password_confirmation: newPasswordConfirmation
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );
      // console.log('Change Password Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Change Password Error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }
      // console.log('Logout Token:', token);
      const response = await axios.post(
          `${SIMGUINEE_URL}auth-user-logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );
      // console.log('Logout Response:', response.data);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      return response.data;
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  }
};

export default AuthService;
