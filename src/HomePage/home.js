import React, { useEffect,useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles'
import { Appbar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../../services/authService';

const Home = () => {
    const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getUserInfo = async () => {
        try {
            const userInfo = await AuthService.getUserInfo();
            console.log('les donne de utilisateur',userInfo);
            if (userInfo) {
                setUserName(`${userInfo.Prenoms} ${userInfo.Nom}`);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };
    getUserInfo();
}, []);

    const navigateToCollecte = () => {
       navigation.navigate('Collecte')
    };
    const logins = () => {
        navigation.navigate('Login')
     };
    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#ffffff' }}>
                <View style={styles.header}>
                    <View style={styles.profileSection}>
                        <Image
                            source={require('./../../assets/images/logo.png')}
                            style={styles.profileImage}
                        />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.welcomeText}>Bienvenue,</Text>
                            <Text style={styles.usernameText}>{userName}</Text>
                        </View>
                    </View>
                    <View style={styles.notificationSection}>
                        <MaterialIcons name="notifications" size={28} color="#004d40" />
                    </View>
                </View>
            </Appbar.Header>
            <ScrollView >
                <View style={styles.collectSection}>
                    <Text style={styles.sectionTitle}>Total de collectes</Text>
                    <View style={styles.collectDetails}>
                        <Text style={styles.label}>Agricole : .......</Text>
                        <Text style={styles.label}>Élevage : .......</Text>
                    </View>
                    <View style={styles.collectDetails}>
                        <Text style={styles.label}>Transfrontalière : .......</Text>
                        <Text style={styles.label}>Pêche : .......</Text>
                    </View>
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button}
                    onPress={navigateToCollecte}
                    >
                        <FontAwesome name="file-text-o" size={28} color="#004d40" />
                        <Text style={styles.buttonText}>Nouvelle collecte</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.greenButton]}>
                        <FontAwesome name="database" size={28} color="#FFFFFF" />
                        <Text style={[styles.buttonText, styles.whiteText]}>Collectes de Données</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Envoyer les données</Text>
                    <FontAwesome name="paper-plane" size={28} color="#004d40" />
                </TouchableOpacity>

                {/* <View style={styles.recentActivitySection}>
                    <Text style={styles.sectionTitle}>Activités récentes</Text>
                    <TouchableOpacity style={styles.voir}>
                        <Text style={styles.viewText}>voir</Text>
                        <FontAwesome name="plus-circle" size={24} color="#004d40" />
                    </TouchableOpacity>
                </View> */}

                <TouchableOpacity
                onPress={logins}
                >
                    <View style={styles.supportSection}>
                        <FontAwesome name="cog" size={40} color="#004d40" />
                        <Text style={styles.supportText}>Paramétrage</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};


export default Home;
