import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView,Alert } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles'
import { Appbar, Divider, Avatar, Card, Button, IconButton } from 'react-native-paper';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import AuthService from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Home = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
 // Fonction pour vérifier le token et la session
 const checkToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken'); // Récupération du token
        if (!token) {
            // Si pas de token, afficher une alerte et rediriger
            Alert.alert(
                "Session expirée",
                "Pour des raisons de sécurité, votre session a expiré. Veuillez vous reconnecter.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.replace('Login'), // Redirection vers la page de login
                    }
                ],
                { cancelable: false }
            );
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
    }
};
    // Vérifier le token à chaque fois que l'utilisateur interagit avec le composant
    useFocusEffect(
        React.useCallback(() => {
            checkToken(); // Appel de la fonction à chaque fois que le composant est focus
        }, [])
    );

    useEffect(() => {
        const interval = setInterval(() => {
            checkToken(); // Vérifier toutes les 5 minutes
        }, 5 * 60 * 1000);
    
        return () => clearInterval(interval); // Nettoyer l'intervalle à la fin du composant
    }, []);
    

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userInfo = await AuthService.getUserInfo();
                console.log('les donne de utilisateur', userInfo);
                if (userInfo) {
                    setUserName(`${userInfo.Prenoms} ${userInfo.Nom}`);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        getUserInfo();
    }, []);

    const navigateToCollecte = () => {
        checkToken();
        navigation.navigate('Collecte')
    };
    // const logins = () => {
    //     navigation.navigate('Login')
    // };
    const Setting = () => {
        checkToken();
        navigation.navigate('Setting')
    };
    
   const navigationToFicheCollect= async ()=>{
    checkToken();
    navigation.navigate('Collectes')
   }
   const navigationToFicheConsommation= async ()=>{
    checkToken();
    navigation.navigate('FicheConsommation')
   }
   const navigationToFicheGrossistes= async ()=>{
    checkToken();
    navigation.navigate('FicheGrossiste')
   }
    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#ffffff' }}>
                <View style={styles.header}>
                    <View style={styles.profileSection}>
                        <Image
                            source={require('./../../assets/images/logo.png')}
                            style={styles.profileImage}
                        />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.welcomeText}>Bienvenue,</Text>
                            <Text style={styles.usernameText}>{userName}</Text>
                        </View>
                    </View>
                    <View style={styles.notificationSection}>
                        <MaterialIcons name="notifications" size={28} color="#004d40" />
                    </View>
                </View>
            </Appbar.Header>
            <ScrollView >
                {/* Section Données collectée */}
                <LinearGradient colors={['#0FA958', '#07A954']} style={styles.dataSection}>
                    <View style={{ padding: 10 }}>
                        <View style={styles.dataIconsRow}>
                            <View>
                                <View style={styles.dataHeader}>
                                    <Image
                                        style={styles.logo}
                                        source={require('./../../assets/images/data.png')}
                                        resizeMode="contain"
                                    />
                                    {/* <IconButton icon="database" size={32} onPress={() => { }} /> */}
                                    <Text style={styles.dataTitle}>Données collectée</Text>
                                </View>
                            </View>
                            <View>
                                <View style={styles.rowIcon}>
                                    <View style={styles.iconbtn}>
                                        <IconButton icon="chart-bar" size={32} onPress={() => { }} />
                                    </View>
                                    <View style={styles.iconbtn}>
                                        <IconButton icon="cow" size={32} onPress={() => { }} color="#fff" />
                                    </View>
                                </View>
                                <View style={styles.rowIcon}>
                                    <View style={styles.iconbtn}>
                                        <IconButton icon="map-marker" size={32} onPress={() => { }} color="#fff" />
                                    </View>
                                    <View style={styles.iconbtn}>
                                        <IconButton icon="map-marker" size={32} onPress={() => { }} color="#fff" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
                {/* Section Agricole */}
                <View style={styles.cardAgricole}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                            <Text style={styles.sectionTitle}>Agricole</Text>
                            <Text style={styles.sectionSubtitle}>Fiche de collecte des données agricoles</Text>
                        </View>
                        <View>
                            <Image
                                style={styles.cardImage}
                                source={require('../../assets/images/agriculture-card-image.png')}
                            />
                        </View>
                    </View>
                    <View style={styles.cardRow}>
                        <TouchableOpacity 
                        onPress={navigationToFicheConsommation}
                        style={styles.card}>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Image
                                        style={styles.logo}
                                        source={require('./../../assets/images/file.png')}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.cardValue}>45</Text>
                                </View>
                                <Text style={styles.cardTitle}>Fiche cons</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={navigationToFicheCollect}
                        style={styles.card}>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Image
                                        style={styles.logo}
                                        source={require('./../../assets/images/file.png')}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.cardValue}>45</Text>
                                </View>
                                <Text style={styles.cardTitle}>Fiche collecte</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={navigationToFicheGrossistes}
                        style={styles.card}>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Image
                                        style={styles.logo}
                                        source={require('./../../assets/images/file.png')}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.cardValue}>45</Text>
                                </View>
                                <Text style={styles.cardTitle}>Fiche grossiste</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*section peche frontalier */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button}
                        onPress={navigateToCollecte}
                    >
                        <Image
                            source={require('./../../assets/images/file.png')}
                            resizeMode="contain"
                            style={styles.fichePecheFrontal}
                        />
                        {/* <FontAwesome name="file-text-o" size={28} color="#004d40" /> */}
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.buttonText}>Fiche pêche </Text>
                            <Image
                                source={require('./../../assets/images/Vector-Peche-card.png')}
                                resizeMode="contain"
                                style={styles.imagePeche}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}
                        onPress={navigateToCollecte}
                    >
                        <Image
                            source={require('./../../assets/images/file.png')}
                            resizeMode="contain"
                            style={styles.fichePecheFrontal}
                        />
                        {/* <FontAwesome name="file-text-o" size={28} color="#004d40" /> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.buttonText}>Fiche frontalier </Text>
                            <Image
                                source={require('./../../assets/images/map-Post-frontalier.png')}
                                resizeMode="contain"
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Section Bétail */}
                <View style={styles.cardAgricole}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                            <Text style={styles.sectionTitle}>Bétail</Text>
                            <Text style={styles.sectionSubtitle}>Fiche de collecte des données du bétail</Text>
                        </View>
                        <View>
                            <Image
                                style={styles.cardImage}
                                source={require('../../assets/images/image-betail-card.png')}
                            />
                        </View>
                    </View>
                    <View style={styles.cardRow}>
                        <TouchableOpacity style={styles.card}>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Image
                                        style={styles.logo}
                                        source={require('./../../assets/images/file.png')}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.cardValue}>45</Text>
                                </View>
                                <Text style={styles.cardTitle}>Fiche des bovins</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Image
                                        style={styles.logo}
                                        source={require('./../../assets/images/file.png')}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.cardValue}>45</Text>
                                </View>
                                <Text style={styles.cardTitle}>Fiche des ovins</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Image
                                        style={styles.logo}
                                        source={require('./../../assets/images/file.png')}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.cardValue}>45</Text>
                                </View>
                                <Text style={styles.cardTitle}>Fiche des caprins</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* <TouchableOpacity style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Envoyer les données</Text>
                    <FontAwesome name="paper-plane" size={28} color="#004d40" />
                </TouchableOpacity> */}

                {/* <View style={styles.recentActivitySection}>
                    <Text style={styles.sectionTitle}>Activités récentes</Text>
                    <TouchableOpacity style={styles.voir}>
                        <Text style={styles.viewText}>voir</Text>
                        <FontAwesome name="plus-circle" size={24} color="#004d40" />
                    </TouchableOpacity>
                </View> */}
                <TouchableOpacity
                    // onPress={logins}
                    onPress={Setting}
                >
                    <View style={styles.supportSection}>
                        <FontAwesome name="cog" size={40} color="#004d40" />
                        <Text style={styles.supportText}>Paramétrage</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};


export default Home;
