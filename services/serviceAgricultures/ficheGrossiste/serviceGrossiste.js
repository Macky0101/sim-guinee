import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const SIMGUINEE_URL = 'http://92.112.194.154:8000/api/';
const SIMGUINEE_URL = 'https://cors-proxy.fringe.zone/http://92.112.194.154:8000/api/';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['x-requested-with'] = 'XMLHttpRequest';

const FicheGrossisteservices = {
  postFicheGrossiste: async (ficheData) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.post(`${SIMGUINEE_URL}enquetes/Fiches/grossistes`, ficheData, {
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
      const response = await axios.get(`${SIMGUINEE_URL}enquetes/Fiches/grossistes`, {
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

  getListesCollectes: async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${SIMGUINEE_URL}enquetes/marches-prix/grossistes`, {
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

export default FicheGrossisteservices;
