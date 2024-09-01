import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import styles from './styles'
import { useNavigation } from '@react-navigation/native';

const NewCollecte = () => {
const navigation = useNavigation();

const navigateToFiche = async ()=>{
    navigation.navigate('Fiche')
}
const navigateToPeche = async ()=>{
    navigation.navigate('Peche')
}
    return (
        <ScrollView style={styles.container}>
           <TouchableOpacity
           onPress={navigateToFiche}
           >
           <View style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.titlecard}>
                        <FontAwesome name="file-text-o" size={40} color="#004d40" style={styles.backIcon} />
                        <Text style={styles.formText}>Formulaire de l’agriculture</Text>
                    </View>
                    <View style={styles.image}>
                        <Image source={require('./../../assets/images/healthicons_agriculture-worker.png')} style={styles.formImage} />
                    </View>
                </View>
            </View>
           </TouchableOpacity>
           <TouchableOpacity
           onPress={navigateToPeche}
           >
           <View style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.titlecard}>
                        <FontAwesome name="file-text-o" size={40} color="#004d40" style={styles.backIcon} />
                        <Text style={styles.formText}>Formulaire de la pêche</Text>
                    </View>
                    <View style={styles.image}>
                        <Image source={require('./../../assets/images/game-icons_boat-fishing.png')} style={styles.formImage} />
                    </View>
                </View>
            </View>
           </TouchableOpacity>
           <TouchableOpacity>
           <View style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.titlecard}>
                        <FontAwesome name="file-text-o" size={40} color="#004d40" style={styles.backIcon} />
                        <Text style={styles.formText}>Formulaire du bétail</Text>
                    </View>
                    <View style={styles.image}>
                        <Image source={require('./../../assets/images/mdi_cow.png')} style={styles.formImage} />
                    </View>
                </View>
            </View>
           </TouchableOpacity>
           <TouchableOpacity>
           <View style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.titlecard}>
                        <FontAwesome name="file-text-o" size={40} color="#004d40" style={styles.backIcon} />
                        <Text style={styles.formText}> Postes transfrontaliers</Text>
                    </View>
                    <View style={styles.image}>
                        <Image source={require('./../../assets/images/mdi_map-marker-radius.png')} style={styles.formImage} />
                    </View>
                </View>
            </View>
           </TouchableOpacity>
        </ScrollView>
    );
};

export default NewCollecte;


