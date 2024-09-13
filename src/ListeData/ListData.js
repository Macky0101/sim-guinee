import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Searchbar, Chip, Card, Title, Paragraph } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import FicheCollect from '../../services/serviceAgricultures/ficheCollect/serviceCollect';
import FicheConsommationService from '../../services/serviceAgricultures/ficheConsommation/serviceConsommation';
import FicheGrossisteservices from '../../services/serviceAgricultures/ficheGrossiste/serviceGrossiste';

const ListData = () => {
  const [allFiches, setAllFiches] = useState([]);
  const [filteredFiches, setFilteredFiches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);

    const getFiches = async () => {
      try {
        const listConso = await FicheConsommationService.getListesConso();
        const listCollect = await FicheCollect.getListesCollectes();
        const listGros = await FicheGrossisteservices.getListesCollectes();
  
        const combinedList = [
          ...listConso.map(fiche => ({ ...fiche, source: 'consommation' })),
          ...listCollect.map(fiche => ({ ...fiche, source: 'collect' })),
          ...listGros.map(fiche => ({ ...fiche, source: 'grossiste' })),
        ];
  
        const groupedByNumFiche = groupByNumFiche(combinedList);
        setAllFiches(groupedByNumFiche);
        setFilteredFiches(groupedByNumFiche);
      } catch (error) {
        console.error(error);
      }finally {
        setLoading(false);
    }
    };
  
    getFiches();
  }, []);
  
  const groupByNumFiche = (fiches) => {
    const grouped = {};
    fiches.forEach((fiche) => {
      const numFiche = fiche.enquete_relation.num_fiche;
      if (!grouped[numFiche]) {
        grouped[numFiche] = [];
      }
      grouped[numFiche].push(fiche);
    });

    return Object.keys(grouped).map((numFiche) => ({
      num_fiche: numFiche,
      fiches: grouped[numFiche],
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = allFiches.filter((fiche) =>
      fiche.num_fiche.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFiches(filtered);
  };

  const applyFilter = (type) => {
    setActiveFilter(type);
  
    if (type === '') {
      setFilteredFiches(allFiches);
    } else {
      const filtered = allFiches.filter((ficheGroup) =>
        ficheGroup.fiches.some((fiche) => fiche.source === type)
      );
      setFilteredFiches(filtered);
    }
  };

  const renderAnimatedItem = ({ item }) => (
    <Animated.View
      style={[
        styles.ficheItem,
        {
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [1, 0.95],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
    >
      {renderFicheItem({ item })}
    </Animated.View>
  );

  const renderFicheItem = ({ item }) => (
    <TouchableOpacity
      style={styles.ficheItem}
      onPress={() =>
        navigation.navigate('DetailFiche', {
          numFiche: item.num_fiche,
          fiches: item.fiches,
        })
      }
    >
      <MaterialIcons name="folder" size={40} color="#4caf50" style={styles.icon} />
      <Card.Content>
        <Title style={styles.title}>Fiche Num: {item.num_fiche}</Title>
        <Paragraph>{item.fiches.length} fiches disponibles</Paragraph>
      </Card.Content>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher un numéro de fiche"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.chipContainer}>
        <Chip
          mode="outlined"
          selected={activeFilter === ''}
          onPress={() => applyFilter('')}
          style={[
            styles.chip,
            activeFilter === '' && styles.activeChip,
          ]}
        >
          Tous
        </Chip>
        <Chip
          mode="outlined"
          selected={activeFilter === 'collect'}
          onPress={() => applyFilter('collect')}
          style={[
            styles.chip,
            activeFilter === 'collect' && styles.activeChip,
          ]}
        >
          Collect
        </Chip>
        <Chip
          mode="outlined"
          selected={activeFilter === 'consommation'}
          onPress={() => applyFilter('consommation')}
          style={[
            styles.chip,
            activeFilter === 'consommation' && styles.activeChip,
          ]}
        >
          Consommation
        </Chip>
        <Chip
          mode="outlined"
          selected={activeFilter === 'grossiste'}
          onPress={() => applyFilter('grossiste')}
          style={[
            styles.chip,
            activeFilter === 'grossiste' && styles.activeChip,
          ]}
        >
          Grossiste
        </Chip>
      </View>

      {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
      <Animated.FlatList
        data={filteredFiches}
        renderItem={renderAnimatedItem}
        keyExtractor={(item) => item.num_fiche.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={styles.ficheList}
      />
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
  searchBar: {
    marginBottom: 20,
    borderRadius: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  chip: {
    marginHorizontal: 5,
    backgroundColor: '#e0f7e9',
  },
  activeChip: {
    backgroundColor: '#4caf50',
    borderColor: '#388e3c',
    color: '#fff',
  },
  ficheItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
  },
  ficheList: {
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c662d',
    width: '100%',
  },
  paragraph: {
    fontSize: 14,
    color: '#666',
    ellipsizeMode: 'tail',
    numberOfLines: 1,
  },
});

export default ListData;
