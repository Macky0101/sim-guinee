const DetailPage = ({ route }) => {
    const { idCollecteur, typeMarche, nom_type_marche } = route.params;  // Récupérer les paramètres de la navigation
    const [typeFiche, setTypeFiche] = useState('');
    // console.log('non du type fiche actuelle :', typeFiche);
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    // console.log('route', route.params)
    const [collecteur, setCollecteur] = useState(idCollecteur || '');
    const [nomtypemarche, setnom_type_marche] = useState(nom_type_marche || '');
    const [TypeMarche, setTypeMarche] = useState(typeMarche || '');
    const [ficheError, setFicheError] = useState('');
    const [numero_point_collecte, setNumeroPointCollecte] = useState('');
    const [nom_personne_enquete, setNomPersonneEnquete] = useState('');
    const [contact_personne_enquete, setContactPersonneEnquete] = useState('');

    // pour le debarcadere et Port
    const [isSyncing, setIsSyncing] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null); // Pour gérer les erreurs

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

            // Si le typeFiche est 6, on modifie l'ID ici pour qu'il soit celui de type 6
            if (typeFiche === 6) {
                ficheData.id_type_marche = 6;
            } else if (typeFiche === 7) {
                ficheData.id_type_marche = 7;
            }

        } else if (typeFiche === 5) {

            ficheData.destination_bovins_vendus = commune.nom;
            ficheData.origine_bovins_debarques = selectedOrigine.label;

            ficheData.destination_ovins_vendus = destinationOvinVendu.nom;
            ficheData.origine_ovins_debarques = origineOvinsDebarques.label;

            ficheData.destination_caprins_vendus = destinationCaprinVendu.nom;
            ficheData.origine_caprins_debarques = origineCaprinDebarques.label;
        }

        try {
            // Exécuter la transaction d'écriture dans WatermelonDB
       
            setLoading(false);
            setFiche('');
            setMarche('');
            setDate(new Date());
            hideModal();
           
            await fetchData();
        } catch (error) {
            console.error('Erreur lors de la création de la fiche:', error);

        } finally {
            setLoading(false); // Arrêtez le chargement
        }
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
                                   
                                    {DropdownComponent()}
                                  
                                    {renderCommunes()}

                                  
                                    {DropdownOrigineOvinsDebarques()}
                                   
                                    {renderDestinationOvinsVendus()}
                                   
                                    {DropdownOrigineCaprinDebarques()}
                                   
                                    {renderDestinationCaprinsVendus()}
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
