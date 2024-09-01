import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import styles from './styles';
import AuthService from '../../services/authService';
import { FontAwesome } from '@expo/vector-icons';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await AuthService.login(username, password);
      console.log('Données de connexion:', data);
      setLoading(false);
      navigation.replace('Accueil'); // Naviguer vers la page d'accueil si la connexion réussit
    } catch (error) {
      console.error('Erreur de connexion:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de connexion',
        text2: error.message || 'Veuillez vérifier vos identifiants'
      });
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <LinearGradient colors={['#008148', '#005849']} style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.inner}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('./../../assets/images/logo.png')}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <View>
            <Text style={styles.connec}>Connexion</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
            <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={24} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, (!username || !password) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading || !username || !password}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Mot de passe oublié</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      {loading && (
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={loading} size="large" color="#FFFFFF" />
          </View>
        </View>
      )}
      <Toast />
    </LinearGradient>
  );
};

export default Login;
