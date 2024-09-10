import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Searchbar, FAB, Modal, Portal, TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import FicheConsommationService from '../../../services/serviceAgricultures/ficheConsommation/serviceConsommation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import FicheCollect from '../../../services/serviceAgricultures/ficheCollect/serviceCollect';

const FicheConsommation = () => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(true);
    const [showWarning, setShowWarning] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [visible, setVisible] = useState(false);
    const [fiche, setFiche] = useState('');
    const [marche, setMarche] = useState('');
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [fiches, setFiches] = useState([]);
    const [filteredFiches, setFilteredFiches] = useState([]);
    const [marches, setMarches] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [collecteur, setCollecteur] = useState(null);
    useEffect(() => {
        if (!isConnected) {
            setShowWarning(true);
            setTimeout(() => {
                setShowWarning(false);
            }, 3000); // Message affiché pendant 3 secondes
        }
    }, [isConnected]);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });
    
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        fetchCollecteur();
    }, []);

    // Nouvel useEffect pour récupérer les marchés après avoir obtenu le collecteur
    useEffect(() => {
        if (collecteur) {
            getMarches();
        }
    }, [collecteur]);

    useEffect(() => {
        getFiche();
    }, []);



    const fetchCollecteur = async () => {
        try {
          const userInfoString = await AsyncStorage.getItem('userInfo');
          if (userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            setCollecteur(userInfo.collecteur);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du collecteur:', error);
        }
      };

    const getFiche = async () => {
        setLoading(true);
        try {
            const response = await FicheConsommationService.getFicheCollect();
            setFiches(response);
            setFilteredFiches(response);
            // console.log('fiche', response);
        await AsyncStorage.setItem('ficheCollectData', JSON.stringify(response));

        } catch (error) {
            console.error('Erreur lors de la récupération des fiches:', error);
            const savedData = await AsyncStorage.getItem('ficheCollectData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setFiches(parsedData);
                setFilteredFiches(parsedData);
            }
        } finally {
            setLoading(false);
        }
    };

    const getMarches = async () => {
        try {
            const response = await FicheCollect.getListeMarche();
            // Assurez-vous que `collecteur` est bien défini et que `response` contient les marchés
            console.log('Collecteur:', collecteur);
            // console.log('Marchés:', response);
    
            // Filtrer les marchés en fonction du collecteur
            const filteredMarches = response.filter((marche) => marche.id_collecteur === collecteur);
    
            const formattedMarches = filteredMarches.map((marche) => ({
                label: marche.nom_marche,
                value: marche.id_marche.toString(),
            }));
    
            console.log('Marchés filtrés pour le collecteur:', filteredMarches);
            setMarches(formattedMarches);
        } catch (error) {
            console.error('Erreur lors de la récupération des marchés:', error);
        }
    };
    
    



    const onSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filtered = fiches.filter(fiche =>
                (fiche.num_fiche && fiche.num_fiche.includes(query)) ||
                (fiche.marche && typeof fiche.marche === 'string' && fiche.marche.includes(query)) ||
                (fiche.date_enquete && fiche.date_enquete.includes(query))
            );
            setFilteredFiches(filtered);
        } else {
            setFilteredFiches(fiches);
        }
    };
    
    

    const showModal = () => setVisible(true);
    const hideModal = () => {
        // Réinitialiser les champs
        setFiche('');
        setMarche('');
        setDate(new Date());
        setVisible(false);
    };
    
    const postFiche = async () => {
        const ficheData = {
            num_fiche: fiche,
            date_enquete: date.toISOString().split('T')[0], // Extraire uniquement la date
            marche: marche,
            collecteur: collecteur
        };
        // console.log('donne', ficheData);
        try {
            await FicheConsommationService.postFicheCollect(ficheData);
            getFiche();
            // Réinitialiser les champs
            setFiche('');
            setMarche('');
            setDate(new Date());
            hideModal();
        } catch (error) {
            console.error('Erreur lors de la création de la fiche:', error);
        }
    };
  

    
    return (
        <View style={styles.container}>
              {showWarning && (
            <View style={styles.warningContainer}>
                <Text style={styles.warningText}>Connexion perdue. Affichage des données en cache.</Text>
            </View>
        )}
            <Searchbar
                placeholder="Rechercher"
                onChangeText={onSearch}
                value={searchQuery}
                style={styles.searchbar}
            />
            <View style={styles.header}>
                <Text style={styles.headerText}>Listes d'enquêtes consommations</Text>
            </View>
    
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <KeyboardAwareScrollView contentContainerStyle={styles.inner}>
                {filteredFiches.length > 0 ? (
                    filteredFiches.map((fiche, index) => (
                        <View key={index} style={styles.ficheContainer}>
                            <View style={styles.fiche}>
                                <Text style={{ color: '#fff' }}>N° Fiche: {fiche.num_fiche}</Text>
                            </View>
    
                            {/* Marché Section */}
                            <View style={styles.infoContainer}>
                                <AntDesign name="shoppingcart" size={20} color="#4A90E2" style={styles.icon} />
                                <Text style={styles.text}>Marché: {fiche.marche_relation?.nom_marche || 'Marché inconnu'}</Text>
                            </View>
    
                            {/* Date Enquête Section */}
                            <View style={styles.infoContainer}>
                                <AntDesign name="calendar" size={20} color="#4A90E2" style={styles.icon} />
                                <Text style={styles.text}>Date Enquête: {fiche.date_enquete}</Text>
                            </View>
    
                            {/* Buttons */}
                            <View style={styles.btnContainer}>
                                <TouchableOpacity onPress={() => navigation.navigate('ListesConso', { id: fiche.id })}>
                                    <View style={styles.btn}>
                                        <Text style={{ color: '#fff' }}>Voir les données</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('FormCons', { id: fiche.id ,num_fiche: fiche.num_fiche})}>
                                    <View style={styles.btn1}>
                                        <Text style={{ color: '#fff' }}>Nouvelle donnée </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>Aucune fiche d'enquête trouvée.</Text>
                )}
            </KeyboardAwareScrollView>
            
            )}
    
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                    <Text>Créer une fiche d’enquête</Text>
                    <TextInput
                        label="N° fiche:"
                        value={fiche}
                        onChangeText={text => setFiche(text)}
                        style={styles.input}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        data={marches}
                        labelField="label"
                        valueField="value"
                        placeholder="Sélectionnez un marché"
                        value={marche}
                        onChange={item => {
                            setMarche(item.value);
                        }}
                        renderLeftIcon={() => (
                            <AntDesign style={styles.icon} color="black" name="shoppingcart" size={20} />
                        )}
                    />
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                        <Text style={styles.dateText}>{date ? `Date Enquête: ${date.toLocaleDateString('fr-FR')}` : "Sélectionner la date"}</Text>
                    </TouchableOpacity>
    
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setDate(selectedDate);
                                }
                            }}
                            locale="fr-FR"
                        />
                    )}
    
                    <Button mode="contained" onPress={postFiche} style={styles.button}>
                        Enregistrer
                    </Button>
                </Modal>
            </Portal>
    
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={showModal}
            />
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchbar: {
        marginBottom: 16,
    },
    header: {
        marginBottom: 16,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    btnContenair: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    btn: {
        backgroundColor: '#009C57',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    btn1: {
        backgroundColor: '#006951',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor:'#006951',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
    inner: {
        flexGrow: 1,
    },
    fiche: {
        backgroundColor: '#4A90E2',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        alignSelf:'flex-start'
    },
    ficheContainer: {
        marginBottom: 7,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
    icon: {
        marginRight: 5,
    },
    dateButton: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 16,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
 warningContainer: {    
        position: 'absolute',    
        top: 0,    
        left: 0,    
        right: 0,    
        backgroundColor: 'orange',    
        padding: 10,    
        zIndex: 1,    
        alignItems: 'center',
    },
    warningText: {    
        color: 'white', 
        fontWeight: 'bold',  
    },
    dropdown: {
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 50,
        justifyContent: 'center',
      },
});

export default FicheConsommation;
