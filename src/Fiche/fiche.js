import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import styles from './styles'
import { useNavigation } from '@react-navigation/native';
const Fiche = () => {
   const navigation= useNavigation();

   const navigationToFicheCollect= async ()=>{
    navigation.navigate('Collectes')
   }
   const navigationToFicheConsommation= async ()=>{
    navigation.navigate('FicheConsommation')
   }
   const navigationToFicheGrossistes= async ()=>{
    navigation.navigate('FicheGrossiste')
   }
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.titlecard}>
                        <FontAwesome name="file-text-o" size={40} color="#fff" style={styles.backIcon} />
                        <Text style={styles.formText}>Formulaire de l’agriculture</Text>
                    </View>
                    <View style={styles.image}>
                        <Image source={require('./../../assets/images/healthicons_agriculture-worker.png')} style={styles.formImage} />
                    </View>
                </View>
            </View>
            <ScrollView >
                <TouchableOpacity
                onPress={navigationToFicheCollect}
                >
                    <View style={styles.cardFiche}>
                        <View style={styles.ficheTitle}>
                            <FontAwesome name="file-text-o" size={36} color="#004d40" style={styles.ficheIcon} />
                            <Text style={styles.fichelabel}>FICHE D’ENQUÊTE COLLECTE</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={navigationToFicheConsommation}
                >
                    <View style={styles.cardFiche}>
                        <View style={styles.ficheTitle}>
                            <FontAwesome name="file-text-o" size={36} color="#004d40" style={styles.ficheIcon} />
                            <Text style={styles.fichelabel}>FICHE D’ENQUÊTE CONSOMMATION</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={navigationToFicheGrossistes}
                >
                    <View style={styles.cardFiche}>
                        <View style={styles.ficheTitle}>
                            <FontAwesome name="file-text-o" size={36} color="#004d40" style={styles.ficheIcon} />
                            <Text style={styles.fichelabel}>FICHE D’ENQUÊTE GROSSISTE</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity>
                    <View style={styles.cardFiche}>
                        <View style={styles.ficheTitle}>
                            <FontAwesome name="file-text-o" size={36} color="#004d40" style={styles.ficheIcon} />
                            <Text style={styles.fichelabel}>FICHE D’ENQUÊTE DETAILLANT</Text>
                        </View>
                    </View>
                </TouchableOpacity> */}
            </ScrollView>
        </View>

    );
};

export default Fiche;


