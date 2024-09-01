import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Peche = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.titlecard}>
                        <FontAwesome name="file-text-o" size={40} color="#fff" style={styles.backIcon} />
                        <Text style={styles.formText}>Données d’enquête sur la pêche</Text>
                    </View>
                    <View style={styles.image}>
                        <Image source={require('./../../assets/images/game-icons_boat-fishing.png')} style={styles.formImage} />
                    </View>
                </View>
            </View>
            
            <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() => setModalVisible(true)}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <KeyboardAwareScrollView
                        contentContainerStyle={styles.modalContent}
                        enableAutomaticScroll={true}
                    >
                        <Text style={styles.modalTitle}>Formulaire de Pêche</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Nom"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Type de poisson"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Quantité"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Lieu"
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Observations"
                            multiline={true}
                            numberOfLines={4}
                        />

                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButton}>Fermer</Text>
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                </View>
            </Modal>
        </View>
    );
};

export default Peche;
