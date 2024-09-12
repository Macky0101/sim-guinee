import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';

const Setting = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const changePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    // Logique pour changer le mot de passe (requête API à implémenter)
    Alert.alert('Succès', 'Votre mot de passe a été changé avec succès.');
    setIsModalVisible(false);
  };

  const logout = async () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Oui",
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>

      {/* Image de l'utilisateur */}
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Paramètres</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}>
        <Text style={styles.buttonText}>Changer le mot de passe</Text>
      </TouchableOpacity>
      {/* Bouton de déconnexion */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.RetourButton} onPress={handleBackPress}>
        <AntDesign name="arrowleft" size={40} color="white" style={styles.icon} />
      </TouchableOpacity>
      {/* Modal pour changer le mot de passe */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Changer le mot de passe</Text>

            <TextInput
              label="Ancien mot de passe"
              value={oldPassword}
              secureTextEntry
              onChangeText={setOldPassword}
              style={styles.input}
            />
            <TextInput
              label="Nouveau mot de passe"
              value={newPassword}
              secureTextEntry
              onChangeText={setNewPassword}
              style={styles.input}
            />
            <TextInput
              label="Confirmer le nouveau mot de passe"
              value={confirmPassword}
              secureTextEntry
              onChangeText={setConfirmPassword}
              style={styles.input}
            />

            <Button mode="contained" onPress={changePassword} style={styles.button}>
              Confirmer
            </Button>

            <IconButton
              icon="close"
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: 'center',
    // backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    // textAlign: 'center',
  },
  logo: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    // alignSelf: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor:'#009C57',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    fontSize: 32
  },
  logoutButton: {
    backgroundColor: '#e53935',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  // 
  RetourButton: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor:'#009C57',
    alignSelf: 'center',
    borderRadius: 100,
    padding: 20
  },
  timeLeft: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default Setting;
