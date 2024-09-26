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
    modalContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        marginHorizontal: 20,
        elevation: 4,
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
        width: '100%',
        height: '100%',
        opacity: 0.5,
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
 
});

export default styles;
