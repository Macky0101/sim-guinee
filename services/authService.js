import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIMGUINEE_URL = 'http://92.112.194.154:8000/api/';

const AuthService = {
    login: async (username, password) => {
      try {
        const response = await axios.post(`${SIMGUINEE_URL}login`, { username, password });
        if (response.status === 200 && response.data && response.data.access_token) {
          await AsyncStorage.setItem('userToken', response.data.access_token);
          return response.data;
        } else {
          throw new Error('Invalid login response');
        }
      } catch (error) {
        console.error('Login Error:', error.response || error);
        throw new Error('Erreur de connexion. Veuillez vérifier vos identifiants.');
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
        console.log('user info', response.data);
  
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

  changePassword: async (oldPassword, newPassword, newPasswordConfirmation) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.post(
        `${SIMGUINEE_URL}/api/auth-change-password`,
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
        `${SIMGUINEE_URL}/api/auth-user-logout`,
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
