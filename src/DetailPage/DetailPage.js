import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Badge, IconButton } from 'react-native-paper';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import styles from './styles'; // Assurez-vous d'avoir défini des styles propres
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FicheCollect from '../../services/serviceAgricultures/ficheCollect/serviceCollect';
import { useNavigation } from '@react-navigation/native';
import { Searchbar, FAB, Modal, Portal, TextInput, Button } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Q } from '@nozbe/watermelondb';
import database from '../../database/database';  // Assurez-vous d'importer la base de données
import SyncService from '../../database/services/SyncService';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TimePickerModal } from 'react-native-paper-dates';
import FormGrossiste from '../../services/serviceAgricultures/ficheGrossiste/formGrossiste';

const DetailPage = ({ route }) => {
    const { idCollecteur, typeMarche, nom_type_marche } = route.params;  // Récupérer les paramètres de la navigation
    const [typeFiche, setTypeFiche] = useState('');
    // console.log('non du type fiche actuelle :', typeFiche);
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    // console.log('route', route.params)
    const [isLoading, setIsLoading] = useState(true);
    const [fiche, setFiche] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [marche, setMarche] = useState('');
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleHeure, setVisibleHeure] = useState(false);
    const [collecteur, setCollecteur] = useState(idCollecteur || '');
    const [nomtypemarche, setnom_type_marche] = useState(nom_type_marche || '');
    const [TypeMarche, setTypeMarche] = useState(typeMarche || '');
    const [ficheError, setFicheError] = useState('');
    const [NumError, setNumError] = useState('');
    const [NomPersError, setNomPersError] = useState('');
    const [ContactError, setContactError] = useState('');
    const [TypeEmbarError, setTypeEmbError] = useState('');
    const [nbrBrqJrsError, setnbrBrqJrsError] = useState('');
    const [DifficultesError, setDifficultesError] = useState('');
    const [HeureFinError, setHeureFinError] = useState('');
    const [dateError, setDateError] = useState('');

    // pour le betail

    const [stock_initial_bovins, setStockInitialBovins] = useState(0);
    const [nbr_bovins_debarques, setNbrBovinsDebarques] = useState(0);
    const [stock_soir_bovins, setStockSoirBovins] = useState(0);
    const [nombre_bovin_vendu_calcule, setNombreBovinVenduCalcule] = useState(0);
    const [nombre_bovin_present_marche, setNombreBovinPresentMarche] = useState(0);
    const [nombre_tete_bovins_vendu, setNombreTeteBovinsVendu] = useState(0);
    const [taureaux_4_8_ans_vendus, setTaureaux4_8AnsVendus] = useState(0);
    const [taurillons_2_3_ans_vendus, setTaurillons2_3AnsVendus] = useState(0);
    const [vaches_4_10_ans_vendus, setVaches4_10AnsVendus] = useState(0);
    const [genisses_2_3_ans_vendus, setGenisses2_3AnsVendus] = useState(0);
    const [veaux_velles_0_12_mois, setVeauxVelles0_12Mois] = useState(0);
    const [destination_bovins_vendus, setDestinationBovinsVendus] = useState('');
    const [origine_bovins_debarques, setOrigineBovinsDebarques] = useState('');
    const [stock_initial_ovins, setStockInitialOvins] = useState(0);
    const [nombre_ovins_debarques, setNombreOvinsDebarques] = useState(0);
    const [stock_soir_ovins, setStockSoirOvins] = useState(0);
    const [nombre_ovins_presentes_marche, setNombreOvinsPresentesMarche] = useState(0);
    const [nombre_ovins_vendus, setNombreOvinsVendus] = useState(0);
    const [ovins_males_femelles_0_12_vendus, setOvinsMalesFemelles0_12Vendus] = useState(0);
    const [ovins_males_femelles_plus_1_vendus, setOvinsMalesFemellesPlus1Vendus] = useState(0);
    const [destination_ovins_vendus, setDestinationOvinsVendus] = useState('');
    const [origine_ovins_debarques, setOrigineOvinsDebarques] = useState('');
    const [stock_initial_caprins, setStockInitialCaprins] = useState(0);
    const [nombre_caprins_debarques, setNombreCaprinsDebarques] = useState(0);
    const [stock_soir_caprins, setStockSoirCaprins] = useState(0);
    const [nombre_caprins_presentes_marche, setNombreCaprinsPresentesMarche] = useState(0);
    const [nombre_caprins_vendus, setNombreCaprinsVendus] = useState(0);
    const [caprins_males_femelles_0_12_ans, setCaprinsMalesFemelles0_12Ans] = useState(0);
    const [caprins_males_femelles_plus_1_ans, setCaprinsMalesFemellesPlus1Ans] = useState(0);
    const [destination_caprins_vendus, setDestinationCaprinsVendus] = useState('');
    const [origine_caprins_debarques, setOrigineCaprinsDebarques] = useState('');

    // pour le grossistes

    const [numero_point_collecte, setNumeroPointCollecte] = useState('');
    const [nom_personne_enquete, setNomPersonneEnquete] = useState('');
    const [contact_personne_enquete, setContactPersonneEnquete] = useState('');

    // pour le debarcadere et Port

    const [type_embarcation, setTypeEmbarcation] = useState('');
    const [espece_presente, setEspecePresente] = useState([]);
    const [difficultes_rencontrees, setDifficultesRencontrees] = useState('');
    const [nbr_barques_rentres_jour, setNbrBarquesRentresJour] = useState(0);
    const [heure_fin_collecte_semaine, setHeureFinCollecteSemaine] = useState(new Date());
    const [isSyncing, setIsSyncing] = useState(false);

    // State pour stocker les produits filtrés et les erreurs
    const [searchProducts, setSearchProduit] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null); // Pour gérer les erreurs


    const [communes, setcommunes] = useState([]);
    const [commune, setCommune] = useState([]);
    const [searchCommune, setSearchCommune] = useState('');
    const storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Sauvegarde des données échouée.',
            });
            console.error('Erreur lors de la sauvegarde des données:', error);
        }
    };
    const getCommunes = async () => {
        try {
            const response = await FormGrossiste.getCommune();
            if (!response || !response) {
                console.error('No data found in the response');
                return;
            }
            const data = response;
            const communes = data.map(commune => ({
                id: commune.id_commune,
                nom: commune.nom_commune ? commune.nom_commune.toLowerCase() : '',
            }));
            // console.log('commune data', communes);
            setcommunes(communes);
            await storeData('communes', communes);
        } catch (error) {
            console.error('Erreur lors de la récupération des communes:', error);
        }
    };


    const renderCommunes = () => (
        <Dropdown
            style={styles.dropdown}
            data={communes.filter(item =>
                item.nom.toLowerCase().includes(searchCommune.toLowerCase())
            )}
            labelField="nom"
            valueField="id"
            placeholder="Destination des bovins vendus"
            value={commune.id}  // tu stockes toujours l'ID ici pour sélectionner l'élément dans le dropdown
            onChange={item => setCommune(item)} // item contient à la fois l'ID et le nom de la commune
            search
            searchPlaceholder="Rechercher une commune..."
            onSearch={setSearchCommune}
            renderLeftIcon={() => (
                <AntDesign name="enviromento" size={20} color="black" style={styles.icon} />
            )}
        />
    );
    // pour la partie destination_ovins_vendus
    const [destinationOvinsVendus, setsetDestinationOvinsVendus] = useState([]);
    const [destinationOvinVendu, setDestinationOvinVendu] = useState([]);
    const [searchDestinationOvinVendu, setSearchDestinationOvinVendu] = useState('');
    const [filteredDestinationOvinsVendus, setFilteredDestinationOvinsVendus] = useState([]);

    const getDestinationOvinsVendus = async () => {
        try {
            const response = await FormGrossiste.getCommune();
            if (!response) {
                console.error('No data found in the response');
                return;
            }
            const data = response;
            const destinationOvinsVendus = data.map(commune => ({
                id: commune.id_commune,
                nom: commune.nom_commune ? commune.nom_commune.toLowerCase() : '',
            }));
            setsetDestinationOvinsVendus(destinationOvinsVendus);
            setFilteredDestinationOvinsVendus(destinationOvinsVendus); // Initialiser filteredDestinationOvinsVendus avec les mêmes données
            await storeData('destinationOvinsVendus', destinationOvinsVendus);
        } catch (error) {
            console.error('Erreur lors de la récupération des communes:', error);
        }
    };

    const renderDestinationOvinsVendus = () => (
        <Dropdown
            style={styles.dropdown}
            data={filteredDestinationOvinsVendus.filter(item =>
                item.nom.toLowerCase().includes(searchDestinationOvinVendu.toLowerCase())
            )}
            labelField="nom"
            valueField="id"
            placeholder="Destination des ovins vendus"
            value={destinationOvinVendu.id}
            onChange={item => setDestinationOvinVendu(item)}
            search
            searchPlaceholder="Rechercher une commune..."
            onSearch={setSearchDestinationOvinVendu}
            renderLeftIcon={() => (
                <AntDesign name="enviromento" size={20} color="black" style={styles.icon} />
            )}
        />
    );

    // pour la origine des produit
    const [originesProduits, setOriginesProduits] = useState([]);
    const [selectedOrigine, setSelectedOrigine] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Fonction pour récupérer les origines des produits
    const fetchOriginesProduits = async () => {
        try {
            const origineProduitCollection = database.collections.get('origines_produits');
            const origines = await origineProduitCollection.query().fetch();
            setOriginesProduits(origines);
        } catch (error) {
            console.error('Erreur lors de la récupération des origines des produits:', error);
        }
    };
    const DropdownComponent = () => (
        <Dropdown
            style={styles.dropdown}
            data={originesProduits.map(item => ({
                id: item.id_origine_produit,      // ID pour la gestion interne
                label: item.nom_origine_produit,   // Nom pour l'affichage
            }))}
            labelField="label"
            valueField="id"
            placeholder="Sélectionnez une origine"
            value={selectedOrigine?.id} // Utilise l'ID pour le contrôle
            onChange={item => {
                setSelectedOrigine(item); // Stocke l'objet complet
                setModalVisible(true); // Ouvrir le modal sur la sélection
            }}
            search
            searchPlaceholder="Rechercher une origine..."
            renderLeftIcon={() => (
                <AntDesign name="down" size={20} color="black" style={styles.icon} />
            )}
        />
    );
    //   pour ovin origin 
    const [origineOvinsDebarques, setsetOrigineOvinsDebarques] = useState(null);

    const DropdownOrigineOvinsDebarques = () => (
        <Dropdown
            style={styles.dropdown}
            data={originesProduits.map(item => ({
                id: item.id_origine_produit,      // ID pour la gestion interne
                label: item.nom_origine_produit,   // Nom pour l'affichage
            }))}
            labelField="label"
            valueField="id"
            placeholder="Sélectionnez une origine des ovins"
            value={origineOvinsDebarques?.id} // Utilise l'ID pour le contrôle
            onChange={item => {
                setsetOrigineOvinsDebarques(item); // Stocke l'objet complet
                setModalVisible(true); // Ouvrir le modal sur la sélection
            }}
            search
            searchPlaceholder="Rechercher une origine..."
            renderLeftIcon={() => (
                <AntDesign name="down" size={20} color="black" style={styles.icon} />
            )}
        />
    );
    // pour la partie destination des caprin vendu
    const [destinationCaprinsVendus, setsetDestinationCaprinsVendus] = useState([]);
    const [destinationCaprinVendu, setDestinationCaprinVendu] = useState([]);
    const [searchDestinationCaprinVendu, setSearchDestinationCaprinVendu] = useState('');
    const [filteredDestinationCaprinsVendus, setFilteredDestinationCaprinsVendus] = useState([]);

    const getDestinationCaprinsVendus = async () => {
        try {
            const response = await FormGrossiste.getCommune(); // Remplacer par l'appel API approprié si nécessaire
            if (!response) {
                console.error('No data found in the response');
                return;
            }
            const data = response;
            const destinationCaprinsVendus = data.map(commune => ({
                id: commune.id_commune,
                nom: commune.nom_commune ? commune.nom_commune.toLowerCase() : '',
            }));
            setsetDestinationCaprinsVendus(destinationCaprinsVendus);
            setFilteredDestinationCaprinsVendus(destinationCaprinsVendus); // Initialiser filteredDestinationCaprinsVendus
            await storeData('destinationCaprinsVendus', destinationCaprinsVendus);
        } catch (error) {
            console.error('Erreur lors de la récupération des communes:', error);
        }
    };

    const renderDestinationCaprinsVendus = () => (
        <Dropdown
            style={styles.dropdown}
            data={filteredDestinationCaprinsVendus.filter(item =>
                item.nom.toLowerCase().includes(searchDestinationCaprinVendu.toLowerCase())
            )}
            labelField="nom"
            valueField="id"
            placeholder="Destination des caprins vendus"
            value={destinationCaprinVendu.id}
            onChange={item => setDestinationCaprinVendu(item)} // Mise à jour de la sélection
            search
            searchPlaceholder="Rechercher une commune..."
            onSearch={setSearchDestinationCaprinVendu}
            renderLeftIcon={() => (
                <AntDesign name="enviromento" size={20} color="black" style={styles.icon} />
            )}
        />
    );



    //origin des caprin debarque
    const [origineCaprinDebarques, setOrigineCaprinDebarques] = useState(null);
    const [modalVisibleCaprins, setModalVisibleCaprins] = useState(false);

    const DropdownOrigineCaprinDebarques = () => (
        <Dropdown
            style={styles.dropdown}
            data={originesProduits.map(item => ({
                id: item.id_origine_produit,       // ID pour la gestion interne
                label: item.nom_origine_produit,    // Nom pour l'affichage
            }))}
            labelField="label"
            valueField="id"
            placeholder="Sélectionnez une origine des caprins"
            value={origineCaprinDebarques?.id} // Utilise l'ID pour le contrôle
            onChange={item => {
                setOrigineCaprinDebarques(item); // Stocke l'objet complet
                setModalVisibleCaprins(true);    // Ouvrir le modal sur la sélection
            }}
            search
            searchPlaceholder="Rechercher une origine..."
            renderLeftIcon={() => (
                <AntDesign name="down" size={20} color="black" style={styles.icon} />
            )}
        />
    );




    useEffect(() => {
        getCommunes();
        getDestinationOvinsVendus();
        fetchOriginesProduits();
        getDestinationCaprinsVendus();
    }, [])

    // Fonction pour récupérer et filtrer les produits
    const fetchFilteredProducts = async () => {
        try {
            const produits = await database.collections.get('produits').query(
                Q.where('type_marche', Q.like(`%${TypeMarche}%`)) // Filtrer par type_marche
            ).fetch();

            // console.log('Produits filtrés :', produits); // Vérification
            const productList = produits.map(prod => ({
                label: prod.nom_produit,
                value: prod.id_produit,
            }));

            setFilteredProducts(productList); // Mettre à jour le dropdown avec les produits filtrés
            setError(null); // Réinitialiser l'erreur si l'appel réussit
        } catch (err) {
            console.error('Erreur lors du filtrage des produits :', err);
            setError(err); // Capturer l'erreur
        } finally {
            setLoading(false); // Fin du chargement
        }
    };

    // Utilise `useEffect` pour gérer les appels de données
    useEffect(() => {
        setLoading(true); // Réinitialiser l'état de chargement
        fetchFilteredProducts();
    }, [TypeMarche]); // Lancer l'effet à chaque changement du `type_marche`


    if (error) {
        return <Text>Erreur lors de la récupération des produits : {error.message}</Text>;
    }

    const handleSync = async () => {
        setIsSyncing(true);
        console.log('Synchronisation démarrée');  // Ajout pour débogage
        try {
            await SyncService.syncFiches();
            console.log('Synchronisation réussie');  // Ajout pour débogage
        } catch (error) {
            console.error('Erreur lors de la synchronisation:', error);  // Ajout pour débogage
        } finally {
            setIsSyncing(false);
        }
    };

    // nbr total des fiche  source : local et api
    // const [localFichesCount, setLocalFichesCount] = useState(0);
    // const [apiFichesCount, setApiFichesCount] = useState(0);
    // useEffect(() => {
    //     const fetchCounts = async () => {
    //       const localCount = await SyncService.countLocalFiches();
    //       const apiCount = await SyncService.countApiFiches();
    //       console.log('total local count:', localCount);
    //       console.log('total api count:', apiCount);
    //       setLocalFichesCount(localCount);
    //       setApiFichesCount(apiCount);
    //     };
    //     fetchCounts();
    //   }, []);

    const countApiFiches = async () => {
        try {
            const apiFichesCount = await database.collections
                .get('fiches')
                .query(Q.where('source', 'api' && 'type_marche', TypeMarche))
                .fetchCount();
            console.log('total:', apiFichesCount);
            return apiFichesCount;
        } catch (error) {
            console.error('Erreur lors du comptage des fiches synchronisées:', error);
            return 0;
        }
    };

    const fetchData = async () => {
        try {
            // Récupérer les marchés filtrés par type_marche dans WatermelonDB
            const filteredMarkets = await database.collections
                .get('marches') // Nom de la table marche dans WatermelonDB
                .query(Q.where('type_marche', TypeMarche)) // Filtrer par type_marche
                .fetch();

            // Afficher les marchés récupérés
            setData(filteredMarkets);
            setIsLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des marchés:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [idCollecteur, TypeMarche]);


    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Vérifie que data est un tableau avant d'utiliser map
    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('./../../assets/images/no-data.png')} style={{ width: '100%', height: 200 }} />
                <Text style={{ fontSize: 16, textAlign: 'center', paddingHorizontal: 20, marginTop: 10, fontWeight: '300' }}>
                    Il semble que vous n'avez aucune marché pour le moment. Veuillez vérifier votre connexion Internet ou réessayer plus tard.
                </Text>
                {/* Bouton de rafraîchissement */}
                <TouchableOpacity onPress={fetchData} style={styles.refreshButton}>
                    <Text style={styles.refreshButtonText}>Rafraîchir</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Fonction pour afficher chaque marché dans une card avec les icônes
    const renderCard = (marketData) => {
        const { id_marche, nom_marche, localite, nom_prefecture, nom_region, nom_type_marche, nbre_fiche, type_marche } = marketData._raw;

        return (
            <Card style={styles.card} key={id_marche}
                onPress={() => {
                    // Ajout de log pour afficher les valeurs avant la navigation
                    console.log('ID du collecteur:', collecteur);
                    console.log('marché id:', id_marche);

                    navigation.navigate('MarketFiches', {
                        id_marche: id_marche,// Transmission du marche ID
                        idCollecteur: collecteur,// Transmission du collecteur ID
                        type_marche: type_marche, // id du type de marche
                        nom_marche: nomtypemarche, // nom_marche
                        nom_marche1: nom_marche // nom_marche
                    });
                }}
            >
                <Card.Content>
                    {/* Header de la carte avec le nom du marché */}
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{nom_marche}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setMarche(id_marche);  // Associe le marché sélectionné
                                showModal(type_marche);  // Ouvre le modal avec l'ID du type de marché
                            }}
                            style={{ padding: 10, backgroundColor: '#009C57', borderRadius: 50 }}
                        >
                            {/* <MaterialIcons name="add" size={24} color="black" /> */}
                            <AntDesign name="addfile" size={24} color="white" />
                        </TouchableOpacity>

                    </View>

                    {/* Informations principales du marché */}
                    <View style={styles.infoRow}>
                        <MaterialIcons name="place" size={20} color="#009C57" style={styles.infoIcon} />
                        <Text style={styles.infoText}>Communes: {localite}, {nom_prefecture}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="location-city" size={20} color="#009C57" style={styles.infoIcon} />
                        <Text style={styles.infoText}>Région: {nom_region}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome name="file-text" size={18} color="#009C57" style={styles.infoIcon} />
                        <Text style={styles.infoText}>Nombre de fiche: <Text>{nbre_fiche}</Text></Text>
                    </View>
                    <Image
                        source={require('../../assets/images/fond-image-marche.png')}
                        style={styles.backgroundImage}
                    />
                    {/* Badge pour le nombre de fiches */}
                    {/* <Badge style={styles.badge}>nbr de fiche {nbre_fiche}</Badge> */}
                </Card.Content>
            </Card>
        );
    };

    const generateFicheNumber = async () => {
        try {
            // Récupérer l'ID du collecteur depuis les paramètres ou l'état
            const collecteurId = idCollecteur || '0000'; // Utiliser une valeur par défaut si non disponible

            // Générer un identifiant unique basé sur la date et l'heure (timestamp)
            const timestamp = new Date().getTime(); // Nombre de millisecondes depuis 1970

            // Combiner l'ID du collecteur avec le timestamp pour générer un numéro unique
            const generatedFiche = `${collecteurId}-${timestamp}`;

            console.log('Numéro de fiche généré:', generatedFiche);
            setFiche(generatedFiche); // Stocker le numéro de fiche dans l'état
        } catch (error) {
            console.error("Erreur lors de la génération du numéro de fiche:", error);
        }
    };

    // const generateFicheNumber = async () => {
    //     try {
    //         const generatedFiche = await FicheCollect.getNumeroFiche();
    //         console.log('Numéro de fiche généré:', generatedFiche);
    //         setFiche(generatedFiche); // Stocker le numéro de fiche dans l'état
    //         console.log('Numéro de fiche généré:', setFiche);

    //     } catch (error) {
    //         console.error("Erreur lors de la génération du numéro de fiche:", error);
    //     }
    // };

    const showModal = async (type_marche) => {
        await generateFicheNumber(); // Génére le numéro de fiche avant d'ouvrir le modal
        setTypeFiche(type_marche); // Stocke le type de fiche
        setVisible(true);
    };

    const hideModal = () => {
        // Réinitialiser les champs
        setFiche('');
        setMarche('');
        setDate(new Date());
        setVisible(false);


    };

    const validateForm = () => {
        let isValid = true;

        // Réinitialiser les messages d'erreur
        setFicheError('');
        setDateError('');
        setNumError('');
        setNomPersError('');
        setContactError('');
        setTypeEmbError('');
        setnbrBrqJrsError('');
        setDifficultesError('');
        setHeureFinError('');

        // Validation pour le champ fiche
        if (!fiche) {
            setFicheError('Le numéro de fiche est requis.');
            isValid = false;
        }

        // Validation pour la date
        if (!date) {
            setDateError('La date est requise.');
            isValid = false;
        }

        // Validations spécifiques en fonction du type de marché
        if (typeFiche === 2) { // Exemple pour le type "grossiste"
            if (!numero_point_collecte) {
                setNumError('Le numéro de point de collecte est requis pour le type grossiste.');
                isValid = false;
            }
            if (!nom_personne_enquete) {
                setNomPersError('Le nom de la personne enquêtée est requis.');
                isValid = false;
            }
            if (!contact_personne_enquete) {
                setContactError('Le contact de la personne enquêtée est requis.');
                isValid = false;
            }
        } else if (typeFiche === 7) { // Exemple pour le type "débarcadère , Port"
            if (!type_embarcation) {
                setTypeEmbError('Le type d\'embarcation est requis pour le type débarcadère.');
                isValid = false;
            }
            if (espece_presente.length === 0) {
                setFicheError('Au moins une espèce doit être présente.');
                isValid = false;
            }
            if (!nbr_barques_rentres_jour) {
                setnbrBrqJrsError('Le nombre de barques rentrées est requis.');
                isValid = false;
            }
            if (!difficultes_rencontrees) {
                setDifficultesError('difficultes rencontrees est requis.');
                isValid = false;
            }
            if (!heure_fin_collecte_semaine) {
                setHeureFinError('heure de fin est requis.');
                isValid = false;
            }

        } else if (typeFiche === 9) { // Exemple pour le type "bétail"
            if (stock_initial_bovins <= 0) {
                setFicheError('Le stock initial de bovins doit être supérieur à zéro.');
                isValid = false;
            }
            if (nbr_bovins_debarques < 0) {
                setFicheError('Le nombre de bovins débarqués ne peut pas être négatif.');
                isValid = false;
            }
            if (stock_soir_bovins < 0) {
                setFicheError('Le stock du soir de bovins ne peut pas être négatif.');
                isValid = false;
            }
        }

        return isValid;
    };

    const postFiche = async () => {
        if (!validateForm()) {
            return;
        }
        setLoading(true);

        const ficheData = {
            num_fiche: fiche,
            date_enquete: date.toISOString().split('T')[0], // Extraire uniquement la date
            marche: marche,
            collecteur: collecteur,
            id_type_marche: typeFiche, // Inclure le type de marché
            source: 'local', // Définir la source comme locale
        };
        // Ajouter les champs spécifiques en fonction du type de marché
        if (typeFiche === 2) {
            ficheData.numero_point_collecte = numero_point_collecte;
            ficheData.nom_personne_enquete = nom_personne_enquete;
            ficheData.contact_personne_enquete = contact_personne_enquete;
        } else if (typeFiche === 6 || typeFiche === 7) {
            ficheData.type_embarcation = type_embarcation;
            ficheData.espece_presente = espece_presente;
            ficheData.difficultes_rencontrees = difficultes_rencontrees;
            ficheData.nbr_barques_rentres_jour = nbr_barques_rentres_jour;
            ficheData.heure_fin_collecte_semaine = heure_fin_collecte_semaine;
            // Si le typeFiche est 6, on modifie l'ID ici pour qu'il soit celui de type 6
            if (typeFiche === 6) {
                ficheData.id_type_marche = 6;
            } else if (typeFiche === 7) {
                ficheData.id_type_marche = 7;
            }

        } else if (typeFiche === 5) {
            ficheData.stock_initial_bovins = stock_initial_bovins;
            ficheData.nbr_bovins_debarques = nbr_bovins_debarques;
            ficheData.stock_soir_bovins = stock_soir_bovins;
            ficheData.nombre_bovin_vendu_calcule = nombre_bovin_vendu_calcule;
            ficheData.nombre_bovin_present_marche = nombre_bovin_present_marche;
            ficheData.nombre_tete_bovins_vendu = nombre_tete_bovins_vendu;
            ficheData.taureaux_4_8_ans_vendus = taureaux_4_8_ans_vendus;
            ficheData.taurillons_2_3_ans_vendus = taurillons_2_3_ans_vendus;
            ficheData.vaches_4_10_ans_vendus = vaches_4_10_ans_vendus;
            ficheData.genisses_2_3_ans_vendus = genisses_2_3_ans_vendus;
            ficheData.veaux_velles_0_12_mois = veaux_velles_0_12_mois;
            ficheData.destination_bovins_vendus = commune.nom;
            ficheData.origine_bovins_debarques = selectedOrigine.label;
            ficheData.stock_initial_ovins = stock_initial_ovins;
            ficheData.nombre_ovins_debarques = nombre_ovins_debarques;
            ficheData.stock_soir_ovins = stock_soir_ovins;
            ficheData.nombre_ovins_presentes_marche = nombre_ovins_presentes_marche;
            ficheData.nombre_ovins_vendus = nombre_ovins_vendus;
            ficheData.ovins_males_femelles_0_12_vendus = ovins_males_femelles_0_12_vendus;
            ficheData.ovins_males_femelles_plus_1_vendus = ovins_males_femelles_plus_1_vendus;
            ficheData.destination_ovins_vendus = destinationOvinVendu.nom;
            ficheData.origine_ovins_debarques = origineOvinsDebarques.label;
            ficheData.stock_initial_caprins = stock_initial_caprins;
            ficheData.nombre_caprins_debarques = nombre_caprins_debarques;
            ficheData.stock_soir_caprins = stock_soir_caprins;
            ficheData.nombre_caprins_presentes_marche = nombre_caprins_presentes_marche;
            ficheData.nombre_caprins_vendus = nombre_caprins_vendus;
            ficheData.caprins_males_femelles_0_12_ans = caprins_males_femelles_0_12_ans;
            ficheData.caprins_males_femelles_plus_1_ans = caprins_males_femelles_plus_1_ans;
            ficheData.destination_caprins_vendus = destinationCaprinVendu.nom;
            ficheData.origine_caprins_debarques = origineCaprinDebarques.label;
        }

        try {
            // Exécuter la transaction d'écriture dans WatermelonDB
            await database.write(async () => {
                const newFiche = await database.collections.get('fiches').create((fiche) => {
                    fiche.num_fiche = ficheData.num_fiche;
                    fiche.date_enquete = ficheData.date_enquete;
                    fiche.marche = ficheData.marche;
                    fiche.collecteur = ficheData.collecteur;
                    fiche.id_type_marche = ficheData.id_type_marche;
                    fiche.source = ficheData.source; // Assigner la source

                    // Assigner les champs spécifiques au type de marché
                    if (typeFiche === 2) {
                        fiche.numero_point_collecte = ficheData.numero_point_collecte;
                        fiche.nom_personne_enquete = ficheData.nom_personne_enquete;
                        fiche.contact_personne_enquete = ficheData.contact_personne_enquete;
                    } else if (typeFiche === 6 || typeFiche === 7) {
                        fiche.type_embarcation = ficheData.type_embarcation;
                        fiche.espece_presente = ficheData.espece_presente;
                        fiche.difficultes_rencontrees = ficheData.difficultes_rencontrees;
                        fiche.nbr_barques_rentres_jour = ficheData.nbr_barques_rentres_jour;
                        fiche.heure_fin_collecte_semaine = ficheData.heure_fin_collecte_semaine;
                        // ficheData.heure_fin_collecte_semaine = heure_fin_collecte_semaine.toISOString();
                    } else if (typeFiche === 5) {
                        fiche.stock_initial_bovins = ficheData.stock_initial_bovins;
                        fiche.nbr_bovins_debarques = ficheData.nbr_bovins_debarques;
                        fiche.stock_soir_bovins = ficheData.stock_soir_bovins;
                        fiche.nombre_bovin_vendu_calcule = ficheData.nombre_bovin_vendu_calcule;
                        fiche.nombre_bovin_present_marche = ficheData.nombre_bovin_present_marche;
                        fiche.nombre_tete_bovins_vendu = ficheData.nombre_tete_bovins_vendu;
                        fiche.taureaux_4_8_ans_vendus = ficheData.taureaux_4_8_ans_vendus;
                        fiche.taurillons_2_3_ans_vendus = ficheData.taurillons_2_3_ans_vendus;
                        fiche.vaches_4_10_ans_vendus = ficheData.vaches_4_10_ans_vendus;
                        fiche.genisses_2_3_ans_vendus = ficheData.genisses_2_3_ans_vendus;
                        fiche.veaux_velles_0_12_mois = ficheData.veaux_velles_0_12_mois;
                        fiche.destination_bovins_vendus = ficheData.destination_bovins_vendus;
                        fiche.origine_bovins_debarques = ficheData.origine_bovins_debarques;
                        fiche.stock_initial_ovins = ficheData.stock_initial_ovins;
                        fiche.nombre_ovins_debarques = ficheData.nombre_ovins_debarques;
                        fiche.stock_soir_ovins = ficheData.stock_soir_ovins;
                        fiche.nombre_ovins_presentes_marche = ficheData.nombre_ovins_presentes_marche;
                        fiche.nombre_ovins_vendus = ficheData.nombre_ovins_vendus;
                        fiche.ovins_males_femelles_0_12_vendus = ficheData.ovins_males_femelles_0_12_vendus;
                        fiche.ovins_males_femelles_plus_1_vendus = ficheData.ovins_males_femelles_plus_1_vendus;
                        fiche.destination_ovins_vendus = ficheData.destination_ovins_vendus;
                        fiche.origine_ovins_debarques = ficheData.origine_ovins_debarques;
                        fiche.stock_initial_caprins = ficheData.stock_initial_caprins;
                        fiche.nombre_caprins_debarques = ficheData.nombre_caprins_debarques;
                        fiche.stock_soir_caprins = ficheData.stock_soir_caprins;
                        fiche.nombre_caprins_presentes_marche = ficheData.nombre_caprins_presentes_marche;
                        fiche.nombre_caprins_vendus = ficheData.nombre_caprins_vendus;
                        fiche.caprins_males_femelles_0_12_ans = ficheData.caprins_males_femelles_0_12_ans;
                        fiche.caprins_males_femelles_plus_1_ans = ficheData.caprins_males_femelles_plus_1_ans;
                        fiche.destination_caprins_vendus = ficheData.destination_caprins_vendus;
                        fiche.origine_caprins_debarques = ficheData.origine_caprins_debarques;
                    }
                    console.log('les donne fichedata ', ficheData);

                });
                console.log('Fiche sauvegardée:', newFiche);
            });

            setLoading(false);
            setFiche('');
            setMarche('');
            setDate(new Date());
            hideModal();
            setNumeroPointCollecte('');
            setNomPersonneEnquete('');
            setContactPersonneEnquete('');
            setTypeEmbarcation('');
            setEspecePresente('');
            setDifficultesRencontrees('');
            setNbrBarquesRentresJour();
            setHeureFinCollecteSemaine('');
            setStockInitialBovins('');
            setNbrBovinsDebarques('');
            setStockSoirBovins('');
            setNombreBovinVenduCalcule('');
            setNombreBovinPresentMarche('');
            setNombreTeteBovinsVendu('');
            setTaureaux4_8AnsVendus('');
            setTaurillons2_3AnsVendus('');
            setVaches4_10AnsVendus('');
            setGenisses2_3AnsVendus('');
            setVeauxVelles0_12Mois('');
            setDestinationBovinsVendus('');
            setOrigineBovinsDebarques('');
            setStockInitialOvins('');
            setNombreOvinsDebarques('');
            setStockSoirOvins('');
            setNombreOvinsPresentesMarche('');
            setNombreOvinsVendus('');
            setOvinsMalesFemelles0_12Vendus('');
            setOvinsMalesFemellesPlus1Vendus('');
            setDestinationOvinsVendus('');
            setOrigineOvinsDebarques('');
            setStockInitialCaprins('');
            setNombreCaprinsDebarques('');
            setStockSoirCaprins('');
            setNombreCaprinsPresentesMarche('');
            setNombreCaprinsVendus('');
            setCaprinsMalesFemelles0_12Ans('');
            setCaprinsMalesFemellesPlus1Ans('');
            setDestinationCaprinsVendus('');
            setOrigineCaprinsDebarques('');
            await fetchData();
        } catch (error) {
            console.error('Erreur lors de la création de la fiche:', error);

        } finally {
            setLoading(false); // Arrêtez le chargement
        }
    };

    const type_embarcationListe = [
        { label: 'SALAN', value: 'SALAN' },
        { label: 'FLYMBOTE', value: 'FLYMBOTE' },
        { label: 'MONOXYLE', value: 'MONOXYLE' },
    ];
    const onConfirm = ({ hours, minutes }) => {
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        setHeureFinCollecteSemaine(formattedTime);
        setVisibleHeure(false);
    };

    const onDismiss = () => {
        setVisibleHeure(false);
    };

    return (

        <ScrollView style={styles.container}>
            <View>
                {data.map((marketData) => renderCard(marketData))}
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            <Text>Créer une fiche d’enquête</Text>
                            <Text style={{ padding: 10, marginBottom: 5, backgroundColor: '#dddddd' }}>N° fiche: {fiche || 'Generating...'}</Text>
                            {ficheError ? <Text style={styles.errorText}>{ficheError}</Text> : null}

                            {/* Affichage des champs selon le type de fiche */}
                            {typeFiche === 1 && (
                                <>
                                    <TextInput
                                        label="Date d'enquête"
                                        value={date.toLocaleDateString('fr-FR')}
                                        onPressIn={() => setShowDatePicker(true)}
                                        style={styles.input}

                                    />
                                    {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

                                    {/* Autres champs pour collecte */}
                                </>
                            )}
                            {/* Grossiste */}
                            {typeFiche === 2 && (
                                <>
                                    <TextInput
                                        label="Numero du point collecte"
                                        value={numero_point_collecte}
                                        onChangeText={setNumeroPointCollecte}
                                        style={styles.input}

                                    />
                                    {NumError ? <Text style={styles.errorText}>{NumError}</Text> : null}

                                    <TextInput
                                        label="Nom de la personne enquêtée"
                                        value={nom_personne_enquete}
                                        onChangeText={setNomPersonneEnquete}
                                        style={styles.input}

                                    />
                                    {NomPersError ? <Text style={styles.errorText}>{NomPersError}</Text> : null}

                                    <TextInput
                                        label="Contact de la personne enquêtée"
                                        value={contact_personne_enquete}
                                        onChangeText={setContactPersonneEnquete}
                                        keyboardType='phone-pad'
                                        style={styles.input}

                                    />
                                    {ContactError ? <Text style={styles.errorText}>{ContactError}</Text> : null}

                                    {/* Autres champs pour grossiste */}
                                </>
                            )}

                            {/* Hebdomadaire */}
                            {typeFiche === 3 && (
                                <>
                                    <TextInput
                                        label="Date d'enquête"
                                        value={date.toLocaleDateString('fr-FR')}
                                        onPressIn={() => setShowDatePicker(true)}
                                        style={styles.input}

                                    />
                                </>
                            )}

                            {/* betail */}
                            {typeFiche === 5 && (
                                <>
                                    <TextInput
                                        label="Date d'enquête"
                                        value={date.toLocaleDateString('fr-FR')}
                                        onPressIn={() => setShowDatePicker(true)}
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Stock initial des bovins"
                                        value={stock_initial_bovins}
                                        onChangeText={setStockInitialBovins}
                                        keyboardType="numeric"
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Nombre de bovins débarqués"
                                        value={stock_initial_bovins}
                                        onChangeText={setStockInitialBovins}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Stock du soir des bovins"
                                        value={stock_soir_bovins}
                                        onChangeText={setStockSoirBovins}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Nombre de bovins vendus calculé "
                                        value={nombre_bovin_vendu_calcule}
                                        onChangeText={setNombreBovinVenduCalcule}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Nombre de bovins présents sur le marché"
                                        value={nombre_bovin_present_marche}
                                        onChangeText={setNombreBovinPresentMarche}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Nombre de têtes de bovins vendues"
                                        value={nombre_tete_bovins_vendu}
                                        onChangeText={setNombreTeteBovinsVendu}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Taureaux de 4 à 8 ans vendus"
                                        value={taureaux_4_8_ans_vendus}
                                        onChangeText={setTaureaux4_8AnsVendus}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Taurillons de 2 à 3 ans vendus "
                                        value={taurillons_2_3_ans_vendus}
                                        onChangeText={setTaurillons2_3AnsVendus}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Vaches de 4 à 10 ans vendues"
                                        value={vaches_4_10_ans_vendus}
                                        onChangeText={setVaches4_10AnsVendus}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Génisses de 2 à 3 ans vendues"
                                        value={genisses_2_3_ans_vendus}
                                        onChangeText={setGenisses2_3AnsVendus}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Veaux et velles de 0 à 12 mois vendus"
                                        value={veaux_velles_0_12_mois}
                                        onChangeText={setVeauxVelles0_12Mois}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    {DropdownComponent()}
                                    {/* <TextInput
                                        label="Origine des bovins débarqués "
                                        value={destination_bovins_vendus}
                                        onChangeText={setDestinationBovinsVendus}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    /> */}
                                    {renderCommunes()}

                                    {/* <TextInput
                                    label="Destination des bovins vendus"
                                    value={origine_bovins_debarques}
                                    onChangeText={setOrigineBovinsDebarques}
                                    keyboardType='numeric'
                                    style={styles.input}

                                /> */}
                                    <TextInput
                                        label="Stock initial des ovins"
                                        value={stock_initial_ovins}
                                        onChangeText={setStockInitialOvins}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Nombre d'ovins débarqués"
                                        value={nombre_ovins_debarques}
                                        onChangeText={setNombreOvinsDebarques}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Stock du soir des ovins"
                                        value={stock_soir_ovins}
                                        onChangeText={setStockSoirOvins}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Nombre d'ovins présentés sur le marché "
                                        value={nombre_ovins_presentes_marche}
                                        onChangeText={setNombreOvinsPresentesMarche}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Nombre d'ovins vendus"
                                        value={nombre_ovins_vendus}
                                        onChangeText={setNombreOvinsVendus}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Ovins mâles et femelles de 0 à 12 mois vendus "
                                        value={ovins_males_femelles_0_12_vendus}
                                        onChangeText={setOvinsMalesFemelles0_12Vendus}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Ovins mâles et femelles de plus d'1 an vendus"
                                        value={ovins_males_femelles_plus_1_vendus}
                                        onChangeText={setOvinsMalesFemellesPlus1Vendus}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    {DropdownOrigineOvinsDebarques()}
                                    {/* <TextInput
                                        label="Origine des ovins débarqués"
                                        value={origine_ovins_debarques}
                                        onChangeText={setOrigineOvinsDebarques}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    /> */}
                                    {renderDestinationOvinsVendus()}
                                    {/* <TextInput
                                        label="Destination des ovins vendus"
                                        value={destination_ovins_vendus}
                                        onChangeText={setDestinationOvinsVendus}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    /> */}
                                    <TextInput
                                        label="Stock initial des caprins"
                                        value={stock_initial_caprins}
                                        onChangeText={setStockInitialCaprins}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Nombre de caprins débarqués"
                                        value={nombre_caprins_debarques}
                                        onChangeText={setNombreCaprinsDebarques}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Stock du soir des caprins"
                                        value={stock_soir_caprins}
                                        onChangeText={setStockSoirCaprins}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Nombre de caprins présentés sur le marché"
                                        value={nombre_caprins_presentes_marche}
                                        onChangeText={setNombreCaprinsPresentesMarche}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Nombre de caprins vendus"
                                        value={nombre_caprins_vendus}
                                        onChangeText={setNombreCaprinsVendus}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Caprins mâles et femelles de 0 à 12 mois"
                                        value={caprins_males_femelles_0_12_ans}
                                        onChangeText={setCaprinsMalesFemelles0_12Ans}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    <TextInput
                                        label="Caprins mâles et femelles de plus d'1 an"
                                        value={caprins_males_femelles_plus_1_ans}
                                        onChangeText={setCaprinsMalesFemellesPlus1Ans}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    />
                                    {/* <TextInput
                                        label="Origine des caprins débarqués"
                                        value={destination_caprins_vendus}
                                        onChangeText={setDestinationCaprinsVendus}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    /> */}
                                    {DropdownOrigineCaprinDebarques()}
                                    {/* <TextInput
                                        label="Destination des caprins vendus "
                                        value={origine_caprins_debarques}
                                        onChangeText={setOrigineCaprinsDebarques}
                                        keyboardType='numeric'
                                        style={styles.input}

                                    /> */}
                                    {renderDestinationCaprinsVendus()}
                                </>
                            )}

                            {(typeFiche === 6 || typeFiche === 7) && (
                                <>
                                    <TextInput
                                        label="Date d'enquête"
                                        value={date.toLocaleDateString('fr-FR')}
                                        onPressIn={() => setShowDatePicker(true)}
                                        style={styles.input}

                                    />
                                    {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
                                    <Dropdown
                                        style={styles.dropdown}
                                        data={type_embarcationListe}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Type embarcation"
                                        value={type_embarcation}
                                        onChange={item => setTypeEmbarcation(item.value)}
                                        renderLeftIcon={() => (
                                            <AntDesign name="barschart" size={20} color="black" style={styles.icon} />  // Icône valide pour le niveau d'approvisionnement
                                        )}
                                    />
                                    {TypeEmbarError ? <Text style={styles.errorText}>{TypeEmbarError}</Text> : null}
                                    <Dropdown
                                        style={styles.dropdown}
                                        data={filteredProducts}  // Utilisation des produits filtrés
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Sélectionnez un produit"
                                        value={espece_presente} // Valeur sélectionnée
                                        onChange={item => {
                                            setEspecePresente(item.value);
                                            console.log('Produit sélectionné :', item); // Vérification du produit sélectionné
                                        }}
                                        search
                                        searchPlaceholder="Rechercher un produit..."
                                        onSearch={setSearchProduit} // Recherche
                                        renderLeftIcon={() => (
                                            <AntDesign style={styles.icon} color="black" name="barschart" size={20} />
                                        )}
                                    />

                                    <TextInput
                                        label="nombre de barques rentres/jour"
                                        value={nbr_barques_rentres_jour}
                                        onChangeText={setNbrBarquesRentresJour}
                                        style={styles.input}

                                    />
                                    {nbrBrqJrsError ? <Text style={styles.errorText}>{nbrBrqJrsError}</Text> : null}
                                    <TextInput
                                        label="Heure de fin collecte semaine"
                                        value={heure_fin_collecte_semaine}
                                        onFocus={() => setVisibleHeure(true)}
                                        onChangeText={setHeureFinCollecteSemaine}
                                        editable={true}
                                        style={styles.input}

                                    />
                                    <Portal>
                                        <TimePickerModal
                                            visible={visibleHeure}
                                            onDismiss={onDismiss}
                                            onConfirm={onConfirm}
                                            hours={12}
                                            minutes={30}
                                            label="Sélectionnez l'heure"
                                            cancelLabel="Annuler"
                                            confirmLabel="Confirmer"
                                        />
                                    </Portal>
                                    {HeureFinError ? <Text style={styles.errorText}>{HeureFinError}</Text> : null}

                                    <TextInput
                                        label="Difficultes rencontrées"
                                        value={difficultes_rencontrees}
                                        onChangeText={setDifficultesRencontrees}
                                        multiline
                                        style={styles.input}

                                    />
                                    {DifficultesError ? <Text style={styles.errorText}>{DifficultesError}</Text> : null}
                                </>
                            )}

                            {/* Sélecteur de date */}
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

                            <Button mode="contained" onPress={postFiche} style={styles.button} disabled={loading}>
                                {loading ? <ActivityIndicator color="#fff" /> : "Enregistrer"}
                            </Button>
                            <IconButton
                                icon="close"
                                onPress={() => setVisible(false)}
                                style={styles.closeButton}
                            />
                        </ScrollView>
                    </Modal>
                </Portal>

            </View>
        </ScrollView>

    );
};

export default DetailPage;
