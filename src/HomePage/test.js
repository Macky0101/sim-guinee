import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Avatar, IconButton, Card, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.appBar}>
        <Avatar.Image size={40} source={{ uri: 'https://via.placeholder.com/40' }} />
        <Appbar.Content title="Bienvenue," subtitle="CAMARA Mankan" />
        <IconButton icon="bell-outline" size={30} onPress={() => {}} />
      </Appbar.Header>

      {/* Section Données collectée */}
      <LinearGradient colors={['#0FA958', '#07A954']} style={styles.dataSection}>
        <View style={styles.dataHeader}>
          <Text style={styles.dataTitle}>Données collectée</Text>
        </View>
        <View style={styles.dataIconsRow}>
          <IconButton icon="database" size={40} onPress={() => {}} color="#fff" />
          <IconButton icon="chart-bar" size={40} onPress={() => {}} color="#fff" />
          <IconButton icon="cow" size={40} onPress={() => {}} color="#fff" />
          <IconButton icon="map-marker" size={40} onPress={() => {}} color="#fff" />
        </View>
      </LinearGradient>

      {/* Section Agricole */}
      <Text style={styles.sectionTitle}>Agricole</Text>
      <Text style={styles.sectionSubtitle}>Fiche de collecte des données agricoles</Text>
      <View style={styles.cardRow}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Fiche consommation</Text>
            <Text style={styles.cardValue}>45</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Fiche collecte</Text>
            <Text style={styles.cardValue}>66</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Fiche grossiste</Text>
            <Text style={styles.cardValue}>19</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Section Pêche */}
      <View style={styles.cardRow}>
        <Card style={styles.wideCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Fiche pêche</Text>
            <Text style={styles.cardValue}>-</Text>
          </Card.Content>
        </Card>
        <Card style={styles.wideCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Fiche Poste frontalier</Text>
            <IconButton icon="map-marker" size={30} color="#0FA958" />
          </Card.Content>
        </Card>
      </View>

      {/* Section Bétail */}
      <Text style={styles.sectionTitle}>Bétail</Text>
      <Text style={styles.sectionSubtitle}>Fiche de collecte des données du bétail</Text>
      <View style={styles.cardRow}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Fiche des bovins</Text>
            <Text style={styles.cardValue}>45</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Fiche des ovins</Text>
            <Text style={styles.cardValue}>45</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Fiche des caprins</Text>
            <Text style={styles.cardValue}>45</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Paramétrage */}
      <TouchableOpacity style={styles.settingsSection}>
        <IconButton icon="cog" size={50} color="#0FA958" />
        <Text style={styles.settingsText}>Paramétrage</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appBar: {
    backgroundColor: '#fff',
  },
  dataSection: {
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  dataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dataIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#777',
    marginLeft: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  card: {
    width: '30%',
    backgroundColor: '#f5f5f5',
  },
  wideCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
  },
  cardTitle: {
    fontSize: 14,
    color: '#333',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0FA958',
  },
  settingsSection: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  settingsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0FA958',
  },
});
