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

const DetailPage = ({ route }) => {
    const { idCollecteur, typeMarche } = route.params;  // Récupérer les paramètres de la navigation
    const [typeFiche, setTypeFiche] = useState('');
    console.log('non du type fiche actuelle :', typeFiche);
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
    const [collecteur, setCollecteur] = useState(idCollecteur || '');
    const [TypeMarche, setTypeMarche] = useState(typeMarche || '');
    const [ficheError, setFicheError] = useState('');
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

    // pour le debarcadere

    const [type_embarcation, setTypeEmbarcation] = useState('');
    const [espece_presente, setEspecePresente] = useState([]);
    const [difficultes_rencontrees, setDifficultesRencontrees] = useState('');
    const [nbr_barques_rentres_jour, setNbrBarquesRentresJour] = useState(0);
    const [heure_fin_collecte_semaine, setHeureFinCollecteSemaine] = useState(new Date());
    const [isSyncing, setIsSyncing] = useState(false);
    
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

    const  countApiFiches= async () => {
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
        const { id_marche, nom_marche, localite, nom_prefecture, nom_region, nom_type_marche, nbre_fiche } = marketData._raw;

        return (
            <Card style={styles.card} key={id_marche}>
                <Card.Content>
                    {/* Header de la carte avec le nom du marché */}
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{nom_marche}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setMarche(id_marche);  // Associe le marché sélectionné
                                showModal(nom_type_marche);  // Ouvre le modal avec l'ID du type de marché
                            }}
                            style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 50 }}
                        >
                            <MaterialIcons name="add" size={24} color="black" />
                        </TouchableOpacity>

                    </View>

                    {/* Informations principales du marché */}
                    <View style={styles.infoRow}>
                        <MaterialIcons name="place" size={20} color="black" style={styles.infoIcon} />
                        <Text style={styles.infoText}>Localité: {localite}, {nom_prefecture}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="location-city" size={20} color="black" style={styles.infoIcon} />
                        <Text style={styles.infoText}>Région: {nom_region}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="" size={20} color="black" style={styles.infoIcon} />
                        <Text style={styles.infoText}>Nombre de fiche: <Text>{nbre_fiche}</Text></Text>
                    </View>
                    <Image
                        source={require('../../assets/images/fond-image-marche.png')}
                        style={styles.backgroundImage}
                    />
                    {/* Badge pour le nombre de fiches */}
                    <Badge style={styles.badge}> nbr de fiche{nbre_fiche}</Badge>
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

    const showModal = async (idTypeMarche) => {
        await generateFicheNumber(); // Génére le numéro de fiche avant d'ouvrir le modal
        setTypeFiche(idTypeMarche); // Stocke le type de fiche
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

        // Validation pour le champ fiche
        if (!fiche) {
            setFicheError('Le numéro de fiche est requis.');
            isValid = false;
        } else {
            setFicheError(''); // Réinitialiser l'erreur si le champ est valide
        }



        // Validation pour la date
        if (!date) {
            setDateError('La date est requise.');
            isValid = false;
        } else {
            setDateError('');
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
        if (typeFiche === 'Grossiste') {
            ficheData.numero_point_collecte = numero_point_collecte;
            ficheData.nom_personne_enquete = nom_personne_enquete;
            ficheData.contact_personne_enquete = contact_personne_enquete;
        } else if (typeFiche === 'Débarcadère') {
            ficheData.type_embarcation = type_embarcation;
            ficheData.espece_presente = espece_presente;
            ficheData.difficultes_rencontrees = difficultes_rencontrees;
            ficheData.nbr_barques_rentres_jour = nbr_barques_rentres_jour;
            ficheData.heure_fin_collecte_semaine = heure_fin_collecte_semaine;
        } else if (typeFiche === 'Bétail') {
            ficheData.stock_initial_bovins = stock_initial_bovins;
            ficheData.nbr_bovins_debarques = nbr_bovins_debarques;
            ficheData.stock_soir_bovins = stock_soir_bovins;
            ficheData.nombre_bovin_vendu_calcule = nombre_bovin_vendu_calcule;
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
                    if (typeFiche === 'Grossiste') {
                        fiche.numero_point_collecte = ficheData.numero_point_collecte;
                        fiche.nom_personne_enquete = ficheData.nom_personne_enquete;
                        fiche.contact_personne_enquete = ficheData.contact_personne_enquete;
                    } else if (typeFiche === 'debarcadere') {
                        fiche.type_embarcation = ficheData.type_embarcation;
                        fiche.espece_presente = ficheData.espece_presente;
                        fiche.difficultes_rencontrees = ficheData.difficultes_rencontrees;
                        fiche.nbr_barques_rentres_jour = ficheData.nbr_barques_rentres_jour;
                        fiche.heure_fin_collecte_semaine = ficheData.heure_fin_collecte_semaine;
            // ficheData.heure_fin_collecte_semaine = heure_fin_collecte_semaine.toISOString();
                    } else if (typeFiche === 'Betail') {
                        fiche.stock_initial_bovins = ficheData.stock_initial_bovins;
                        fiche.nbr_bovins_debarques = ficheData.nbr_bovins_debarques;
                        fiche.stock_soir_bovins = ficheData.stock_soir_bovins;
                        fiche.nombre_bovin_vendu_calcule = ficheData.nombre_bovin_vendu_calcule;
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
            await fetchData(); 
        } catch (error) {
            console.error('Erreur lors de la création de la fiche:', error);
            
        }finally {
            setLoading(false); // Arrêtez le chargement
        }
    };

    return (
        <ScrollView style={styles.container}>
      {/* <Button
        title={isSyncing ? 'Synchronisation en cours...' : 'Synchroniser les fiches'}
        onPress={handleSync}
        disabled={isSyncing} // Désactiver le bouton pendant la synchronisation
      /> */}
            <View>
                {data.map((marketData) => renderCard(marketData))}
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                        <Text>Créer une fiche d’enquête</Text>
                        <Text>N° fiche: {fiche || 'Generating...'}</Text>
                        {ficheError ? <Text style={styles.errorText}>{ficheError}</Text> : null}

                        {/* Affichage des champs selon le type de fiche */}
                        {typeFiche === 'Collecte' && (
                            <>
                                <TextInput
                                    label="Numéro de fiche"
                                    value={fiche}
                                    onChangeText={setFiche}
                                    error={!!ficheError}
                                />
                                <TextInput
                                    label="Date d'enquête"
                                    value={date.toLocaleDateString('fr-FR')}
                                    onPressIn={() => setShowDatePicker(true)}
                                />
                                {/* Autres champs pour collecte */}
                            </>
                        )}

                        {typeFiche === 'Grossiste' && (
                            <>
                                {/* <TextInput 
                    label="Numéro de fiche" 
                    value={fiche} 
                    onChangeText={setFiche} 
                    error={!!ficheError} 
                /> */}
                                <TextInput
                                    label="Numero du point collecte"
                                    value={numero_point_collecte}
                                    onChangeText={setNumeroPointCollecte}
                                />
                                <TextInput
                                    label="Nom de la personne enquêtée"
                                    value={nom_personne_enquete}
                                    onChangeText={setNomPersonneEnquete}
                                />
                                <TextInput
                                    label="Contact de la personne enquêtée"
                                    value={contact_personne_enquete}
                                    onChangeText={setContactPersonneEnquete}
                                />
                                {/* Autres champs pour grossiste */}
                            </>
                        )}

                        {typeFiche === 'Hebdomadaire' && (
                            <>
                                <TextInput
                                    label="Numéro de fiche"
                                    value={fiche}
                                    onChangeText={setFiche}
                                    error={!!ficheError}
                                />
                                <TextInput
                                    label="Date d'enquête"
                                    value={date.toLocaleDateString('fr-FR')}
                                    onPressIn={() => setShowDatePicker(true)}
                                />
                            </>
                        )}

                        {typeFiche === 'debarcadere' && (
                            <>
                                <TextInput
                                    label="Numéro de fiche"
                                    value={fiche}
                                    onChangeText={setFiche}
                                    error={!!ficheError}
                                />
                                <TextInput
                                    label="Type embarcation"
                                    value={type_embarcation}
                                    onChangeText={setTypeEmbarcation}
                                />
                                <TextInput
                                    label="Espece presente"
                                    value={espece_presente}
                                    onChangeText={setEspecePresente}
                                />
                                <TextInput
                                    label="Difficultes rencontrées"
                                    value={difficultes_rencontrees}
                                    onChangeText={setDifficultesRencontrees}
                                />
                                <TextInput
                                    label="nbr barques rentres/jour"
                                    value={nbr_barques_rentres_jour}
                                    onChangeText={setNbrBarquesRentresJour}
                                />
                                <TextInput
                                    label="heure de fin collecte semaine"
                                    value={heure_fin_collecte_semaine}
                                    onChangeText={setHeureFinCollecteSemaine}
                                />
                                {/* Autres champs pour débarcadère */}
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
                    </Modal>
                </Portal>

            </View>
        </ScrollView>

    );
};

export default DetailPage;
