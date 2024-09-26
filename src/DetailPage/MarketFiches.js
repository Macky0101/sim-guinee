import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Q } from '@nozbe/watermelondb';
import database from '../../database/database';

const MarketFiches = ({ route }) => {
    const { idCollecteur, idMarche } = route.params; // Récupérer les paramètres de navigation
    console.log(route.params);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fonction pour récupérer les données depuis WatermelonDB
    const fetchData = async () => {
        try {
            const marketsCollection = database.collections.get('fiches'); 
            
            // Filtrer les fiches par idMarche
            const filteredMarkets = await marketsCollection
                .query(
                    Q.where('marche', idMarche)  // Correct column name
                )
                .fetch();

            // Mettre à jour les données récupérées dans le state
            setData(filteredMarkets);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();  // Appeler la fonction pour récupérer les données
    }, [idMarche, idCollecteur]);  // Dépendances pour relancer le fetch si les paramètres changent

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!data || data.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Aucune fiche trouvée pour ce marché.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {data.map((item) => (
                <Card key={item.id} style={styles.card}>
                    <Card.Content>
                        <Text style={styles.ficheNumber}>Fiche N°: {item.num_fiche}</Text>
                        <Text style={styles.enqueteDate}>Date d'enquête: {item.date_enquete}</Text>
                    </Card.Content>
                </Card>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    card: {
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    ficheNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    enqueteDate: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
});

export default MarketFiches;
