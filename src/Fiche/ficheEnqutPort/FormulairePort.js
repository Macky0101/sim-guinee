import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Modal, Alert, Text, Image, FlatList } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import database from '../../../database/database';
import Toast from 'react-native-toast-message';
import { Q } from '@nozbe/watermelondb';
import DateTimePicker from '@react-native-community/datetimepicker';


const FormPort = () => {
    const route = useRoute();
    const { ficheId, idCollecteur, id_marche, type_marche } = route.params;
    const [typeMarche, setTypeMarche] = useState(type_marche || '');
    const [observation, setObservation] = useState('');
    const [volumePoissonsPeches, setVolumePoissonsPeches] = useState('');
    const [prixMoyenGrossiste, setPrixMoyenGrossiste] = useState('');
    const [prixMoyenDetaillant, setPrixMoyenDetaillant] = useState('');
    const [niveauDisponibilite, setNiveauDisponibilite] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [principaleEspecePeche, setPrincipaleEspecePeche] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [enquete, setEnquete] = useState(parseInt(10) || 0);
    const [error, setError] = useState(null);

    // Fonction pour récupérer et filtrer les produits
    const fetchFilteredProducts = async () => {
        setLoading(true);
        try {
            // Log pour indiquer le début de la récupération
            console.log('Récupération des produits pour le type de marché:', typeMarche);

            const produits = await database.collections.get('produits').query(
                Q.where('type_marche', Q.like(`%${typeMarche}%`)) // Assurez-vous que 'type_marche' est bien le bon champ
            ).fetch();

            // Log pour vérifier les produits récupérés
            console.log('Produits récupérés:', produits);

            const productList = produits.map(prod => {
                // Log pour chaque produit
                console.log('Produit:', prod);
                return {
                    label: prod.nom_produit,
                    value: prod.nom_produit,
                    image: prod.image // URL de l'image
                };
            });

            setFilteredProducts(productList);
            // Log pour vérifier le produit final
            console.log('Liste des produits filtrés:', productList);
        } catch (err) {
            console.error('Erreur lors du filtrage des produits :', err);
        } finally {
            setLoading(false);
        }
    };

    // Rendu des produits avec images
    const renderProductItem = (item) => {
        return (
            <View style={styles.dropdownItem}>
                <Image source={{ uri: item.image }} style={styles.dropdownImage} />
                <Text style={styles.dropdownLabel}>{item.label}</Text>
            </View>
        );
    };


    useEffect(() => {
        fetchFilteredProducts();
    }, [typeMarche]);

    const resetFields = () => {
        setObservation('');
        setVolumePoissonsPeches('');
        setPrixMoyenGrossiste('');
        setPrixMoyenDetaillant('');
        setNiveauDisponibilite('');
        setPrincipaleEspecePeche('');
    };

    const validateFields = () => {
        return volumePoissonsPeches && prixMoyenGrossiste && prixMoyenDetaillant && niveauDisponibilite && principaleEspecePeche;
    };

    const handleSaveCollect = async () => {
        if (!validateFields()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
            return;
        }

        setLoading(true);

        try {
            // Récupérer la valeur actuelle maximale de l'enquête
            const maxEnquete = await database.collections.get('formulaire_port').query(
                Q.sortBy('enquete', Q.desc),
                Q.take(1)
            ).fetch();

            let newEnquete = 1; // Par défaut, si aucune fiche n'existe encore
            if (maxEnquete.length > 0) {
                newEnquete = maxEnquete[0].enquete + 1; // Incrémenter l'enquête
            }

            const ficheData = {
                date_enquete: date.toISOString().split('T')[0], // Extraire uniquement la date
                collecteur: idCollecteur,
                enquete: newEnquete, // Utilisation de la nouvelle valeur de l'enquête
                volume_poissons_peches: parseFloat(volumePoissonsPeches),
                prix_moyen_semaine_grossiste: parseFloat(prixMoyenGrossiste),
                prix_moyen_semaine_detaillant: parseFloat(prixMoyenDetaillant),
                niveau_disponibilite: niveauDisponibilite,
                observation,
                principale_espece_peche: principaleEspecePeche,
                ficheId: ficheId,
            };

            console.log('Données envoyées :', ficheData);

            // Sauvegarder dans WatermelonDB
            await database.write(async () => {
                const newFiche = await database.collections.get('formulaire_port').create((fiche) => {
                    fiche.date_enquete = ficheData.date_enquete;
                    fiche.collecteur = ficheData.collecteur;
                    fiche.enquete = ficheData.enquete;
                    fiche.volume_poissons_peches = ficheData.volume_poissons_peches;
                    fiche.prix_moyen_semaine_grossiste = ficheData.prix_moyen_semaine_grossiste;
                    fiche.prix_moyen_semaine_detaillant = ficheData.prix_moyen_semaine_detaillant;
                    fiche.niveau_disponibilite = ficheData.niveau_disponibilite;
                    fiche.observation = ficheData.observation;
                    fiche.principale_espece_peche = ficheData.principale_espece_peche;
                    fiche.ficheId = ficheData.ficheId;
                });
                console.log('Fiche créée avec succès :', newFiche);
            });

            resetFields();
            Toast.show({
                type: 'success',
                text1: 'Fiche sauvegardée avec succès',
            });

        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la fiche:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde.');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <Modal transparent={true} animationType="none" visible={loading}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={styles.inner}>
                <TextInput
                    label="Date d'enquête"
                    value={date.toLocaleDateString('fr-FR')}
                    onPressIn={() => setShowDatePicker(true)}
                    style={styles.input}
                />
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
                <Dropdown
                    style={styles.dropdown}
                    data={filteredProducts}
                    labelField="label"
                    valueField="value"
                    placeholder="Sélectionnez un produit"
                    value={principaleEspecePeche}
                    onChange={item => setPrincipaleEspecePeche(item.value)}
                    renderItem={renderProductItem}  // Utilisation d'une fonction de rendu personnalisée
                />



                <TextInput
                    label="Volume des poissons pêchés"
                    value={volumePoissonsPeches}
                    onChangeText={setVolumePoissonsPeches}
                    style={styles.input}
                    keyboardType='numeric'
                />

                <TextInput
                    label="Prix moyen de la semaine (grossiste)"
                    value={prixMoyenGrossiste}
                    onChangeText={setPrixMoyenGrossiste}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <TextInput
                    label="Prix moyen de la semaine (détaillant)"
                    value={prixMoyenDetaillant}
                    onChangeText={setPrixMoyenDetaillant}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <TextInput
                    label="Niveau de disponibilité"
                    value={niveauDisponibilite}
                    onChangeText={setNiveauDisponibilite}
                    style={styles.input}
                />

                <TextInput
                    label="Observation"
                    value={observation}
                    onChangeText={setObservation}
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                />

                <Button mode="contained" onPress={handleSaveCollect} style={styles.button}>
                    Enregistrer
                </Button>

            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    inner: {
        padding: 10,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
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
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dropdownImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    dropdownLabel: {
        fontSize: 16,
        color: '#000',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#009C57',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    activityIndicatorWrapper: {
        height: 100,
        width: 100,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FormPort;
