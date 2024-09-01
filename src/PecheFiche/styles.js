import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    backIcon: {
        paddingBottom: 15,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#009C57',
        padding: 30,
        borderRadius: 5,
        marginBottom: 10,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    titlecard: {
        flexDirection: 'column',
    },
    formText: {
        fontSize: 16,
        color: '#fff',
    },
    formImage: {
        width: 90,
        height: 90,
    },
    image: {
        alignItems: 'flex-end',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#009C57',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flex: 1,
        margin: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 20,
        fontSize: 16,
        color: '#009C57',
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
});

export default styles;