import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';

const DetailFiche = ({ route }) => {
    const { fiches, numFiche } = route.params;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFiche, setSelectedFiche] = useState(null);

    const toggleModal = (fiche = null) => {
        setSelectedFiche(fiche);
        setIsModalVisible(!isModalVisible);
    };

    const renderFicheItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => toggleModal(item)}>
                <Image source={{ uri: item.produit_relation.image }} style={styles.image} />
                <Text style={styles.imageTitle}>{item.produit_relation.nom_produit}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Détails pour le Num Fiche: {numFiche}</Text>
            <FlatList
                data={fiches}
                renderItem={renderFicheItem}
                keyExtractor={(item) => item.id_fiche.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
            />

            {/* Modal */}
            {selectedFiche && (
                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={() => toggleModal()}
                >
                    <View style={styles.modalContent}>
                        <Image source={{ uri: selectedFiche.produit_relation.image }} style={styles.modalImage} />
                        <Text style={styles.modalTitle}>Produit: {selectedFiche.produit_relation.nom_produit}</Text>
                        {/* <Text>Client Principal: {selectedFiche.client_principal}</Text> */}
                        <Text style={styles.detailText}>
                            <MaterialIcons name="person" size={16} color="green" /> Client: {selectedFiche.client_principal}
                        </Text>
                        <Text style={styles.detailText}>
                            <MaterialIcons name="local-shipping" size={16} color="green" /> Fournisseur: {selectedFiche.fournisseur_principal}
                        </Text>
                        <Text style={styles.detailText}>
                            <MaterialIcons name="flag" size={16} color="green" /> Statut:  {selectedFiche.statut}
                        </Text>
                        <Text style={styles.detailText}>
                            <MaterialIcons name="date-range" size={16} color="green" />  {new Date(selectedFiche.date_enregistrement).toLocaleDateString()}
                        </Text>
                        {/* <Text>Fournisseur Principal: {selectedFiche.fournisseur_principal}</Text>
            <Text>Statut: {selectedFiche.statut}</Text>
            <Text>Date d'enregistrement: {new Date(selectedFiche.date_enregistrement).toLocaleDateString()}</Text> */}
                        {/* Add more details as needed */}
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f4f4f4',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    itemContainer: {
        flex: 1,
        margin: 5,
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    imageTitle: {
        marginTop: 10,
        fontWeight: 'bold',
    },
    row: {
        justifyContent: 'space-between',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
    },
});

export default DetailFiche;
