import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIMGUINEE_URL = 'https://sim-guinee.org/api/';

const FormCollect = {
  postFormCollect: async (ficheData) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.post(`${SIMGUINEE_URL}enquetes/marches-prix/collectes`, ficheData, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Données enregistrées:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l’envoi des données:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getFormCollect: async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${SIMGUINEE_URL}enquetes/marches-prix/collectes`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      console.log('Liste des données:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getProduit: async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${SIMGUINEE_URL}parametrages/produits`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
    //   console.log('Liste des données des produits:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getPrefecture: async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${SIMGUINEE_URL}parametrages/localites/prefectures`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
    //   console.log('Liste des données des prefectures:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getUniteMesure: async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${SIMGUINEE_URL}parametrages/unites`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
    //   console.log('Liste des données dunite mesure:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

};

export default FormCollect;
