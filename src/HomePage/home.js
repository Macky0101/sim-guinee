import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Button,Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles'
import { Appbar, Divider, Avatar, Card, IconButton } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AuthService from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Badge } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import SyncService from '../../database/services/SyncService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import database from "../../database/database";
import { Q } from '@nozbe/watermelondb';
import AntDesign from '@expo/vector-icons/AntDesign';
import Toast from 'react-native-toast-message';


const Home = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [fiches, setFiches] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // État pour le chargement
    const [isOffline, setIsOffline] = useState(false); // État pour la connexion
    const [typeMarches, setTypeMarches] = useState([]); // État pour stocker les types de marché
    const [userInfo, setUserInfo] = useState({});
    // Vérifie l'état de la connexion internet
    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            setIsOffline(!state.isConnected);
        });
    };
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userInfo = await AuthService.getUserInfo();
                console.log('les donne de utilisateur', userInfo);
                if (userInfo) {
                    setUserName(`${userInfo.Prenoms} ${userInfo.Nom}`);
                    setUserInfo(userInfo);  // Store the full user info in state
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        getUserInfo();
    }, []);

    const [isDatabaseReady, setIsDatabaseReady] = useState(false); // Pour savoir si la DB est prête
    // Fonction pour initialiser la base de données
    const initializeDatabase = async () => {
        try {
            // Logique pour vérifier ou initialiser la base de données
            setIsDatabaseReady(true);
        } catch (error) {
            console.error("Erreur lors de l'initialisation de la base de données :", error);
            setIsDatabaseReady(false);
        }
    };

    useEffect(() => {
        initializeDatabase(); // Initialiser la base de données lors du premier rendu
    }, []);

    useEffect(() => {
        const getUserInfoAndFetchFiches = async () => {
            try {
                // Récupérer les infos de l'utilisateur
                const userInfo = await AuthService.getUserInfo();
                if (userInfo) {
                    setUserName(`${userInfo.Prenoms} ${userInfo.Nom}`);
                }

                // Récupérer les fiches depuis WatermelonDB
                const typeMarchesCollection = database.collections.get('types_marche');
                const fetchedTypeMarches = await typeMarchesCollection.query().fetch();

                // Récupérer les fiches depuis WatermelonDB
                const MarchesCollection = database.collections.get('marches');
                const Marches = await MarchesCollection.query().fetch();

                // Récupérer les fiches depuis WatermelonDB
                const ficheCollection = database.collections.get('fiches');
                const Fiches = await ficheCollection.query().fetch();
                // const fichesToSync = await ficheCollection.query(Q.where('is_synced', true)).fetch();
                // is_synced: ${marche._raw.is_synced},
                if (Fiches.length > 0) {
                    // console.log('Données trouvées dans la table:', fichesToSync);
                    console.log('Données trouvées dans la table:', Fiches);
                    // Fiches.forEach(marche => {
                    //     console.log(`ID : ${marche._raw.num_fiche}, date_enquete: ${marche._raw.date_enquete}, marche: ${marche._raw.marche}, collecteur: ${marche._raw.collecteur}, numero_point_collecte: ${marche._raw.numero_point_collecte}, nom_personne_enquete: ${marche._raw.nom_personne_enquete}, contact_personne_enquete: ${marche._raw.contact_personne_enquete}, id_type_marche : ${marche._raw.id_type_marche},source: ${marche._raw.source},  `);
                    // });

                } else {
                    console.log('Aucune donnée trouvée dans la table marche.');
                }

                setTypeMarches(fetchedTypeMarches.map(marche => marche._raw)); // Stockage des données dans l'état
                checkConnection();

                if (!isOffline) {

                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getUserInfoAndFetchFiches();
    }, [isOffline]);

    // useEffect(() => {
    //     const unsubscribe = NetInfo.addEventListener(state => {
    //         if (state.isConnected) {
    //             handleSync(); // Synchronisation automatique lors du retour en ligne
    //         }
    //     });
    //     return () => unsubscribe();
    // }, []);

    const handleSyncFiches = async () =>{
        try {
            await SyncService.syncFiches(); // Démarre la synchronisation manuelle
            Toast.show({
                type: 'success',
                text1: 'Synchronisation terminée',
                text2: 'les fiches ont été synchronisées avec succès.',
              });
        } catch (error) {
            console.error('Erreur lors de la synchronisation des fiches:', error);
            Toast.show({
              type: 'error',
              text1: 'Erreur de synchronisation',
              text2: error.message,
            });
        }
    }
    
    const handleSync = async () => {
        try {
            await SyncService.syncTypeMarche(); // Démarre la synchronisation manuelle
            // await SyncService.syncMarche(); // Démarre la synchronisation manuelle
            await SyncService.syncAllMarches(); // Démarre la synchronisation manuelle
        //    await SyncService.syncFiche();

            Alert.alert('Succès', 'La synchronisation est terminée avec succès.');
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors de la synchronisation.');
        }
    };

    const renderEmptyState = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('./../../assets/images/no-data.png')} style={{ width: 200, height: 200 }} />
                <Text style={{ fontSize: 18, marginTop: 20 }}>Bonjour, {userName},</Text>
                <Text style={{ fontSize: 16, textAlign: 'center', paddingHorizontal: 20, marginTop: 10 }}>
                    Il semble que vous n'avez aucune fiche pour le moment. Veuillez vérifier votre connexion Internet ou réessayer plus tard.
                </Text>

                {/* Bouton pour réessayer la connexion */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#0FA958',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 5,
                        marginTop: 20
                    }}
                    onPress={() => retryFetchingData()}  // Appel à la fonction de réessai
                >
                    <Text style={{ color: 'white', fontSize: 16 }}>Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    };
    const retryFetchingData = async () => {
        setIsLoading(true); // Montrer le chargement pendant la tentative
        try {
            checkConnection(); // Vérifier l'état de la connexion

            if (!isOffline) {
                // Si la connexion est disponible, réessayer de récupérer les fiches
                const fichesFromServer = await AuthService.getFicheCollecteur();
                setFiches(fichesFromServer);
                console.log('Fiches after retry', fichesFromServer);
                await AsyncStorage.setItem('fiches', JSON.stringify(fichesFromServer));  // Stocker les fiches
            } else {
                Alert.alert('Pas de connexion', 'Veuillez vérifier votre connexion Internet.');
            }
        } catch (error) {
            console.error('Erreur lors de la tentative de récupération des fiches:', error);
        } finally {
            setIsLoading(false); // Arrêter le chargement
        }
    };

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
            if (isDatabaseReady) {
                checkToken(); // Vérification du token uniquement si la base est prête
            }
        }, [isDatabaseReady])
    );

    useEffect(() => {
        const interval = setInterval(() => {
            checkToken(); // Vérifier toutes les 5 minutes
        }, 5 * 60 * 1000);

        return () => clearInterval(interval); // Nettoyer l'intervalle à la fin du composant
    }, []);



    const ListeData = () => {
        checkToken();
        navigation.navigate('ListData')
    };
    const Setting = () => {
        checkToken();
        navigation.navigate('Setting')
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const typeMarchesCollection = database.collections.get('types_marche');
                const typeMarches = await typeMarchesCollection.query().fetch();
                // console.log('type marche', typeMarches)
                setTypeMarches(typeMarches);
            } catch (error) {
                console.error('Error fetching type marches:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    

    const renderTypeMarche = () => {
        return (
            <ScrollView>
                <View style={styles.cardContainer}>
                    {typeMarches.map((typeMarche, index) => (
                       <TouchableOpacity
                       key={typeMarche.id}
                       onPress={() => {
                           // Ajout de log pour afficher les valeurs avant la navigation
                           console.log('ID du collecteur:', userInfo.collecteur);
                           console.log('Type de marché:', typeMarche.id_type_marche);
                   
                           // Navigation vers la page 'MarketFiches' en passant les valeurs
                           navigation.navigate('DetailPage', { 
                            idCollecteur: userInfo.collecteur,// Transmission du collecteur ID
                               typeMarche: typeMarche.id_type_marche  // Transmission du type de marché
                           });
                       }}
                   >
                            <Card style={styles.card}>
                                <View style={styles.cardContent}>
                                    <View style={styles.leftContent}>
                                        <Image
                                            source={require('../../assets/images/file.png')}
                                            style={styles.marketIcon}
                                        />
                                        <Text style={styles.marketName}>{typeMarche.nom_type_marche}</Text>
                                        {/* <Text style={styles.marketName}>{typeMarche.id_type_marche}</Text> */}
                                    </View>
                                    <Image
                                        source={require('../../assets/images/fond-image-type.png')}
                                        style={styles.backgroundImage}
                                    />
                                    {typeMarche.nbre_marche > 0 && (
                                    <Badge size={24} style={styles.badge}>
                                        {typeMarche.nbre_marche}
                                    </Badge>
                                )}
                                 {/* Icône de synchronisation */}
                                 {/* <AntDesign
                                  name="sync"
                                  size={32}
                                  color="green"
                                  style={styles.syncIcon}
                                  onPress={() => {
                                    console.log(`Bouton sync pressé pour le type de marché: ${typeMarche.id_type_marche}`);
                                    handleSyncFiches(typeMarche.id_type_marche);
                                }}
                                /> */}
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
      <Toast />
            <Appbar.Header style={{ backgroundColor: '#fff' }}>
                <View style={styles.header}>
                    <View style={styles.profileSection}>
                        <View style={{ flexDirection: 'column', paddingTop: 5 }}>
                            <Text style={styles.welcomeText}>Bienvenue,</Text>
                            <Text style={styles.usernameText}>{userName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={Setting}
                    >
                        <View style={styles.notificationSection}>
                            <FontAwesome name="cog" size={28} color="#004d40" />
                        </View>
                    </TouchableOpacity>
                </View>
            </Appbar.Header>
            {/* <Button title="Synchroniser les données" onPress={handleSync} /> */}
            {/* Section Données collectée */}
            <LinearGradient colors={['#0FA958', '#07A954']} style={styles.dataSection}>
                <View style={{ padding: 10 }}>
                    <View style={styles.dataIconsRow}>
                        <View>
                            <View style={styles.dataHeader}>
                                <Image
                                    source={require('./../../assets/images/logo.png')}
                                    style={styles.dataImage}
                                />
                                <Text style={styles.dataTitle}>Données collectée</Text>

                            </View>
                        </View>
                        <View>
                            <View style={styles.rowIcon}>
                                <View style={styles.iconbtn}>
                                    <IconButton
                                        icon={() => <MaterialCommunityIcons name="fish" size={32} color="white" />}
                                        size={32}
                                    // onPress={() => ListeData()}
                                    />
                                </View>
                                <View style={styles.iconbtn}>
                                    <IconButton
                                        icon={() => <MaterialCommunityIcons name="cow" size={32} color="white" />}
                                        size={32}
                                    // onPress={() => ListeData()}

                                    />
                                </View>
                            </View>
                            <View style={styles.rowIcon}>
                                <View style={styles.iconbtn}>
                                    <IconButton
                                        icon={() => <MaterialCommunityIcons name="map-marker" size={32} color="white" />}
                                        size={32}
                                    // onPress={() => ListeData()}

                                    />
                                </View>
                                <View style={styles.iconbtn}>
                                    <IconButton
                                        icon={() => <MaterialCommunityIcons name="tractor" size={32} color="white" />}
                                        size={32}
                                    // onPress={() => ListeData()}

                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>

{isLoading ? (
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <ActivityIndicator size="large" color="#0FA958" />
         </View>
        ) : typeMarches.length > 0 ? (
            renderTypeMarche() // Affiche les types de marché si des données existent
        ) : (
            renderEmptyState() // Sinon, affiche l'état vide
        )}
        </View>
    );
};


export default Home;
