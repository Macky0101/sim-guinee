import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIMGUINEE_URL = 'https://sim-guinee.org/api/';

const FicheCollect = {
  postFicheCollect: async (ficheData) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.post(`${SIMGUINEE_URL}enquetes/Fiches/collectes`, ficheData, {
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
      const response = await axios.get(`${SIMGUINEE_URL}enquetes/Fiches?type=COLLECTE`, {
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
  

  getListesCollectes: async () => {
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
      const response = await axios.get(`${SIMGUINEE_URL}parametrages/marches/par-type/marche`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      console.log('Liste des marches:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
  getNumeroFiche: async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${SIMGUINEE_URL}enquetes/Fiches/fiche-numero`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération du numéro de fiche:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
  

};

export default FicheCollect;
