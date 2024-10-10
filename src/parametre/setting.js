import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import SyncService from '../../database/services/SyncService';
import database from '../../database/database'
import { Q } from '@nozbe/watermelondb';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';

const Setting = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [syncProgress, setSyncProgress] = useState(0); // État pour le pourcentage de synchronisation
  const [isSyncing, setIsSyncing] = useState(false); // Pour désactiver le bouton pendant la synchronisation
  const [isSyncingfiche, setIsSyncingfiche] = useState(false); // Pour la synchronisation des fiches
  const [localFichesCount, setLocalFichesCount] = useState(0);
  const [isSyncFicheButtonEnabled, setIsSyncFicheButtonEnabled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Vérifier s'il existe des fiches locales
  const checkLocalFiches = async () => {
    try {
      const localFiches = await database.collections.get('fiches')
        .query(Q.where('source', 'local')) // Requête pour les fiches locales
        .fetch();
      console.log('local', localFiches);
      setLocalFichesCount(localFiches.length); // Compter le nombre de fiches locales
      setIsSyncFicheButtonEnabled(localFiches.length > 0); // Activer le bouton si au moins une fiche locale existe
    } catch (error) {
      console.error('Erreur lors de la vérification des fiches locales:', error);
    }
  };

  // Exécuter la vérification au montage du composant
  useEffect(() => {
    checkLocalFiches();
  }, []);


  // Fonction de synchronisation des fiches avec calcul de pourcentage
  const handleSyncFiche = async () => {
    if (!isConnected) {
      // Afficher un Toast si pas de connexion
      Toast.show({
        type: 'error',
        text1: 'Pas de connexion Internet',
        text2: 'Veuillez vous connecter à Internet pour synchroniser.',
      });
      return; // Arrêter la fonction ici si pas de connexion
    }
    // Continuer la synchronisation si connecté
    if (!isSyncFicheButtonEnabled) return; // Empêcher la synchronisation si aucune fiche locale

    setIsSyncingfiche(true);
    setSyncProgress(0);
    let syncedFichesCount = 0;

    try {
      const localFiches = await database.collections.get('fiches')
        .query(Q.where('source', 'local'))
        .fetch();

      const totalFiches = localFiches.length;

      for (const fiche of localFiches) {
        // Synchroniser chaque fiche ici
        await SyncService.syncFiches(fiche);
        syncedFichesCount++;

        // Mettre à jour le pourcentage basé sur le nombre de fiches synchronisées
        setSyncProgress(Math.round((syncedFichesCount / totalFiches) * 100));
      }

      Toast.show({
        type: 'success',
        text1: 'Synchronisation terminée',
        text2: 'Toutes les fiches ont été synchronisées avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la synchronisation des fiches:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de synchronisation',
        text2: error.message,
      });
    } finally {
      setIsSyncingfiche(false);
      checkLocalFiches(); // Re-vérifier s'il reste des fiches locales après la sync
    }
  };

  // Fonction de synchronisation avec mise à jour du pourcentage
  // Fonction pour vider la table des fiches
  const clearFiches = async () => {
    try {
      await database.write(async () => {
        const ficheCollection = database.collections.get('fiches');
        const allFiches = await ficheCollection.query().fetch();

        // Supprimer toutes les fiches
        for (const fiche of allFiches) {
          // await fiche.markAsDeleted(); // Marque pour suppression
          await fiche.destroyPermanently(); // Supprime définitivement de la base
        }

        console.log('Toutes les fiches ont été supprimées');
      });
    } catch (error) {
      console.error('Erreur lors de la suppression des fiches :', error);
    }
  };



  // Votre fonction handleSync mise à jour
  const handleSync = async () => {
    if (!isConnected) {
      // Afficher un Toast si pas de connexion
      Toast.show({
        type: 'error',
        text1: 'Pas de connexion Internet',
        text2: 'Veuillez vous connecter à Internet pour synchroniser.',
      });
      return; // Arrêter la fonction ici si pas de connexion
    }

    try {
      setIsSyncing(true);
      setSyncProgress(0);
      // Synchronisation des fiches locales
      // const localFiches = await database.collections.get('fiches')
      //   .query(Q.where('source', 'local'))
      //   .fetch();

      // const totalFiches = localFiches.length;
      // let syncedFichesCount = 0;

      // for (const fiche of localFiches) {
      //   // Synchroniser chaque fiche ici
      //   await SyncService.syncFiches(fiche);
      //   syncedFichesCount++;

      //   // Mettre à jour le pourcentage basé sur le nombre de fiches synchronisées
      //   const newProgress = Math.round(75 + (syncedFichesCount / totalFiches) * 25); // de 75% à 100%
      //   setSyncProgress(newProgress);
      // }
      // Étape 1: Vider la table des fiches avant de synchroniser
      // await clearFiches();

      // Synchronisation TypeMarche (25%)
      await SyncService.syncTypeMarche();
      setSyncProgress(25);

      // Synchronisation des Marchés (50%)
      await SyncService.syncAllMarches();
      setSyncProgress(45);

      const idTypeMarcheArray = await SyncService.syncTypeMarche();
      await SyncService.syncProduits(idTypeMarcheArray);
      await SyncService.syncUnites(idTypeMarcheArray);

      // Synchronisation des Fiches (75%)
      // await SyncService.syncFiche(); // Remettre la fonction syncFiche ici si elle existe
      // setSyncProgress(55);

      await SyncService.syncOrigineProduit()
      setSyncProgress(75);

      // Fin de la synchronisation (100%)
      setSyncProgress(100);

      Alert.alert('Succès', 'La synchronisation est terminée avec succès.');
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la synchronisation.');
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };



  //   const handleSync = async () => {
  //     try {
  //         await SyncService.syncTypeMarche(); // Démarre la synchronisation manuelle
  //         // await SyncService.syncMarche(); // Démarre la synchronisation manuelle
  //         await SyncService.syncAllMarches(); // Démarre la synchronisation manuelle
  //     //    await SyncService.syncFiche();

  //         Alert.alert('Succès', 'La synchronisation est terminée avec succès.');
  //     } catch (error) {
  //         Alert.alert('Erreur', 'Erreur lors de la synchronisation.');
  //     }
  // };

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
      <Toast />

      {/* Image de l'utilisateur */}
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Paramètres</Text>


      {/* Bouton de synchronisation */}
      {/* <TouchableOpacity
        style={[
          styles.button,
          (!isConnected || !isSyncFicheButtonEnabled || isSyncingfiche) ? styles.disabledButton : styles.enabledButton
        ]}
        onPress={handleSyncFiche}
        // disabled={!isConnected || !isSyncFicheButtonEnabled || isSyncingfiche}
      >
        {isSyncingfiche ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isSyncingfiche ? `Synchronisation... ${syncProgress}%` : 'Synchroniser les fiches'}
          </Text>
        )}
      </TouchableOpacity> */}

      {/* Bouton de synchronisation */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSync}
      // disabled={!isConnected || isSyncing} // Désactiver pendant la synchronisation
      >
        {/* Afficher le pourcentage pendant la synchronisation */}
        <Text style={styles.buttonText}>
          {isSyncing ? `Synchronisation... ${syncProgress}%` : 'Synchroniser les données'}
        </Text>
      </TouchableOpacity>


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
    padding: 10,
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
    marginBottom: 0,
  },
  button: {
    backgroundColor: '#009C57',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    fontSize: 32
  },
  logoutButton: {
    backgroundColor: '#e53935',
  },
  disabledButton: {
    backgroundColor: '#B0B0B0', // Couleur grise pour bouton désactivé
  },
  enabledButton: {
    backgroundColor: '#009C57', // Default button color
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  // 
  RetourButton: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009C57',
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
