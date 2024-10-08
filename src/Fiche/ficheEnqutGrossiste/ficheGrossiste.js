import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Searchbar, FAB, Modal, Portal, TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import FicheGrossisteservices from '../../../services/serviceAgricultures/ficheGrossiste/serviceGrossiste';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import FicheCollect from '../../../services/serviceAgricultures/ficheCollect/serviceCollect';


const FicheGrossiste = () => {
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
    const [ficheError, setFicheError] = useState('');
    const [marcheError, setMarcheError] = useState('');
    const [dateError, setDateError] = useState('');
    const [numeroPointCollecte, setNumeroPointCollecte] = useState('');
    const [nomPersonneEnquete, setNomPersonneEnquete] = useState('');
    const [contactPersonneEnquete, setContactPersonneEnquete] = useState('');
    const [numeroPointCollecteError, setNumeroPointCollecteError] = useState('');
    const [nomPersonneEnqueteError, setNomPersonneEnqueteError] = useState('');
    const [contactPersonneEnqueteError, setContactPersonneEnqueteError] = useState('');

    const validateForm = () => {
        let isValid = true;

        // Validation pour le champ fiche
        if (!fiche) {
            setFicheError('Le numéro de fiche est requis.');
            isValid = false;
        } else {
            setFicheError(''); // Réinitialiser l'erreur si le champ est valide
        }

        // Validation pour le champ marché
        if (!marche) {
            setMarcheError('Le marché est requis.');
            isValid = false;
        } else {
            setMarcheError('');
        }

        // Validation pour la date
        if (!date) {
            setDateError('La date est requise.');
            isValid = false;
        } else {
            setDateError('');
        }

        // Validation pour le champ "Numéro du point de collecte"
        if (!numeroPointCollecte) {
            setNumeroPointCollecteError('Le numéro du point de collecte est requis.');
            isValid = false;
        } else {
            setNumeroPointCollecteError(''); // Réinitialiser l'erreur si le champ est valide
        }

        // Validation pour le champ "Nom de la personne enquêtée"
        if (!nomPersonneEnquete) {
            setNomPersonneEnqueteError('Le nom de la personne enquêtée est requis.');
            isValid = false;
        } else {
            setNomPersonneEnqueteError('');
        }

        // Validation pour le champ "Contact de la personne enquêtée"
        if (!contactPersonneEnquete) {
            setContactPersonneEnqueteError('Le contact de la personne enquêtée est requis.');
            isValid = false;
        } else {
            setContactPersonneEnqueteError('');
        }


        return isValid;
    };

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
        if (collecteur) {
            getFiche();
        }

    }, [collecteur]);

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
    const dayIconsAndColors = {
        Lundi: { icon: 'calendar', color: '#2E8B57' }, // Vert séquoia
        Mardi: { icon: 'calendar', color: '#3CB371' }, // Vert moyen
        Mercredi: { icon: 'calendar', color: '#66CDAA' }, // Vert aquatique
        Jeudi: { icon: 'calendar', color: '#8FBC8F' }, // Vert foncé
        Vendredi: { icon: 'calendar', color: '#20B2AA' }, // Vert clair
        Samedi: { icon: 'calendar', color: '#00FA9A' }, // Vert menthe
        Dimanche: { icon: 'calendar', color: '#98FB98' }, // Vert pâle
    };

    const getFiche = async () => {
        setLoading(true);
        try {
            if (!collecteur) {
                throw new Error("Collecteur non défini");
            }
            const response = await FicheGrossisteservices.getFicheCollect();
            const fichesFilteredByCollecteur = response.filter(fiche => fiche.collecteur === collecteur);
            setFiches(fichesFilteredByCollecteur);
            setFilteredFiches(fichesFilteredByCollecteur);
            // console.log('Fiches filtrées par collecteur', fichesFilteredByCollecteur);

            const fichesWithTypeMarche = fichesFilteredByCollecteur.map(fiche => ({
                ...fiche,
                type_marche: fiche.marche_relation ? fiche.marche_relation.type_marche : null
            }));

            // Stockez les fiches avec type_marche
            setFiches(fichesWithTypeMarche);
            setFilteredFiches(fichesWithTypeMarche);

            // Sauvegarde des données localement
            await AsyncStorage.setItem('ficheCollectData', JSON.stringify(fichesWithTypeMarche));

            // console.log('Fiches avec type_marche:', fichesWithTypeMarche);


            // Sauvegarde des données localement
            await AsyncStorage.setItem('ficheCollectData', JSON.stringify(fichesFilteredByCollecteur));
        } catch (error) {
            const savedData = await AsyncStorage.getItem('ficheCollectData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                const fichesFilteredByCollecteur = parsedData.filter(fiche => fiche.collecteur === collecteur);
                setFiches(fichesFilteredByCollecteur);
                setFilteredFiches(fichesFilteredByCollecteur);
            }
            console.error('Erreur lors de la récupération des fiches:', error);
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

            // console.log('Marchés filtrés pour le collecteur:', filteredMarches);
            setMarches(formattedMarches);
        } catch (error) {
            console.error('Erreur lors de la récupération des marchés:', error);
        }
    };



    const generateFicheNumber = async () => {
        try {
            const generatedFiche = await FicheCollect.getNumeroFiche();
            console.log('Numéro de fiche généré:', generatedFiche);
            setFiche(generatedFiche); // Stocker le numéro de fiche dans l'état
            console.log('Numéro de fiche généré:', setFiche);

        } catch (error) {
            console.error("Erreur lors de la génération du numéro de fiche:", error);
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



    const showModal = async () => {
        await generateFicheNumber(); // Génére le numéro de fiche avant d'ouvrir le modal
        setVisible(true);
    };
    const hideModal = () => {
        // Réinitialiser les champs
        setFiche('');
        setMarche('');
        setDate(new Date());
        setVisible(false);
    };

    const postFiche = async () => {
        if (!validateForm()) {
            return;
        }
        const ficheData = {
            num_fiche: fiche,
            date_enquete: date.toISOString().split('T')[0], // Extraire uniquement la date
            marche: marche,
            collecteur: collecteur,
            numero_point_collecte: numeroPointCollecte,  // Ajout du champ "Numéro du point de collecte"
            nom_personne_enquete: nomPersonneEnquete,    // Ajout du champ "Nom de la personne enquêtée"
            contact_personne_enquete: contactPersonneEnquete // Ajout du champ "Contact de la personne enquêtée"
        };

        // console.log('donne', ficheData);
        try {
            await FicheGrossisteservices.postFicheGrossiste(ficheData);
            getFiche();
            // Réinitialiser les champs
            setFiche('');
            setMarche('');
            setDate(new Date());
            setNumeroPointCollecte('');
            setNomPersonneEnquete('');
            setContactPersonneEnquete('');

            hideModal();
        } catch (error) {
            console.error('Erreur lors de la création de la fiche:', error);
        }
    };
    const [collecteurs, setCollecteurs] = useState([]);
    const [selectedCollecteur, setSelectedCollecteur] = useState(null);
    const [searchCollecteur, setSearchCollecteur] = useState('');

    const fetchCollecteurs = async () => {
        try {
            const collecteurs = await FicheGrossisteservices.getCollecteur();
            const formattedCollecteurs = collecteurs.map(collecteur => ({
                label: `${collecteur.nom_collecteur} ${collecteur.prenom_collecteur}`,
                value: collecteur.id_collecteur.toString(),
            }));
            setCollecteurs(formattedCollecteurs);
        } catch (error) {
            console.error('Erreur lors de la récupération des collecteurs:', error);
        }
    };
    useEffect(() => {
        fetchCollecteurs();
    }, []);


    useEffect(() => {
        if (selectedCollecteur) {
          console.log('Collecteur sélectionné ID:', selectedCollecteur);
        }
      }, [selectedCollecteur]);
      

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
                <Text style={styles.headerText}>Liste des enquêtes de grossistes</Text>
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
                                {/* Affichage des jours de marché */}


                                <View style={styles.infoContainer}>
                                    <AntDesign name="shoppingcart" size={20} color="#4A90E2" style={styles.icon} />
                                    <Text style={styles.text}>jour du marche: {fiche.marche_relation?.jour_du_marche || 'jour du marcher ...'}</Text>
                                </View>
                                {/* desctription Section */}
                                <View style={styles.infoContainer}>
                                    <AntDesign name="infocirlceo" size={20} color="#4A90E2" style={styles.icon} />
                                    <Text style={styles.text}>Description: {fiche.marche_relation?.description || 'description ...'}</Text>
                                </View>
                                {/* Date Enquête Section */}
                                <View style={styles.infoContainer}>
                                    <AntDesign name="calendar" size={20} color="#4A90E2" style={styles.icon} />
                                    <Text style={styles.text}>Date Enquête: {fiche.date_enquete}</Text>
                                </View>

                                {/* Buttons */}
                                <View style={styles.btnContainer}>
                                    <TouchableOpacity onPress={() => navigation.navigate('ListesGrossistesCollect', { num_fiche: fiche.num_fiche })}>
                                        <View style={styles.btn}>
                                            <Text style={{ color: '#fff' }}>Voir les données</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('FormGrossistes', { id: fiche.id, num_fiche: fiche.num_fiche, type_marche: fiche.type_marche, })}>
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
                    <Text>N° fiche: {fiche || 'Generating...'}</Text>
                    {ficheError ? <Text style={styles.errorText}>{ficheError}</Text> : null}
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
                    {marcheError ? <Text style={styles.errorText}>{marcheError}</Text> : null}
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                        <Text style={styles.dateText}>{date ? `Date Enquête: ${date.toLocaleDateString('fr-FR')}` : "Sélectionner la date"}</Text>
                    </TouchableOpacity>
                    {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
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
                    {/* <Dropdown
                        style={styles.dropdown}
                        data={collecteurs}
                        labelField="label"
                        valueField="value"
                        placeholder="Sélectionnez un collecteur"
                        value={selectedCollecteur}
                        search
                        searchPlaceholder="Rechercher un collecteur..."
                        onSearch={setSearchCollecteur}
                        onChange={item => setSelectedCollecteur(item.value)}
                        renderLeftIcon={() => (
                            <AntDesign style={styles.icon} color="black" name="user" size={20} />
                        )}
                    /> */}

                    <TextInput
                        label="Numéro du point de collecte"
                        value={numeroPointCollecte}
                        onChangeText={setNumeroPointCollecte}
                        style={styles.input}
                    />
                    {numeroPointCollecteError ? <Text style={styles.errorText}>{numeroPointCollecteError}</Text> : null}
                    <TextInput
                        label="Nom de la personne enquêtée"
                        value={nomPersonneEnquete}
                        onChangeText={setNomPersonneEnquete}
                        style={styles.input}
                    />
                    {nomPersonneEnqueteError ? <Text style={styles.errorText}>{nomPersonneEnqueteError}</Text> : null}
                    <TextInput
                        label="Contact de la personne enquêtée"
                        value={contactPersonneEnquete}
                        onChangeText={setContactPersonneEnquete}
                        style={styles.input}
                    />
                    {contactPersonneEnqueteError ? <Text style={styles.errorText}>{contactPersonneEnqueteError}</Text> : null}

                    <Button mode="contained" onPress={postFiche} style={styles.button} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : "Enregistrer"}
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
    dropdown: {
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 50,
        justifyContent: 'center',
    },
    icon: {
        marginRight: 10,
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
        backgroundColor: '#006951',
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
        alignSelf: 'flex-start'
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
        // alignItems: 'center',
        marginVertical: 5,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 16,
        backgroundColor: '#009C57'

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
    joursContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },
    jourItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        borderRadius: 5,
        marginBottom: 5,
        // width: '45%', // deux éléments par ligne
    },
    icon: {
        marginRight: 5,
    },
    jourText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 8,
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

export default FicheGrossiste;
