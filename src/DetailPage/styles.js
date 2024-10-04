import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: '#f5f5f5',
    },

    followIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
  
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#4CAF50',
    },
    dateButton: {
        marginTop: 16,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        color: '#333333',
    },

    card: {
        margin: 10,
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: '#ffffff',
        shadowRadius: 3,
        elevation: 3,
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginVertical: 1,
    },
    infoIcon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 16,
    },
    backgroundImage: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '30%',
        height: 100,
        opacity: 0.9,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#4CAF50',
        color: '#fff',
    },
    refreshButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
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
      modalContainer: {
        flex: 1,  // Modal prend toute la hauteur
        width: '100%',  // Modal prend toute la largeur
        padding: 5,
        margin: 0,
        backgroundColor: 'white',
        borderRadius: 0,  // Supprime les bordures arrondies
      },
      scrollViewContent: {
        padding: 10,  // Ajoute du padding pour l'intérieur du ScrollView
      },
      modalTitle: {
        padding: 10,
        marginBottom: 5,
        backgroundColor: '#dddddd',
      },
      button: {
        marginTop: 16,
        backgroundColor: '#4CAF50',
      },
      closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
      },
      input: {
        marginBottom: 15,
        backgroundColor: '#ddd',
      },
});

export default styles;
