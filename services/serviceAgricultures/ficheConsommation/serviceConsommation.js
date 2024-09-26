import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIMGUINEE_URL = 'https://sim-guinee.org/api/';

const FicheConsommationService = {
  postFicheCollect: async (ficheData) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.post(`${SIMGUINEE_URL}enquetes/Fiches/consommations`, ficheData, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
    //   console.log('Données enregistrées:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l’envoi des données:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getFicheCollect: async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${SIMGUINEE_URL}enquetes/Fiches?type=HEBDOMADAIRE`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
    //   console.log('Liste des données:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getListesConso: async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${SIMGUINEE_URL}enquetes/marches-prix/consommations`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      // console.log('Liste des données:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getListeMarche: async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${SIMGUINEE_URL}parametrages/marches`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
    //   console.log('Liste des données:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

};

export default FicheConsommationService;
