
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,  // Prendre tout l'espace disponible à gauche
    },
    notificationSection: {
        alignItems: 'flex-end',  // Aligner l'icône à droite
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginRight: 10,
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    usernameText: {
        fontSize: 16,
        color: '#004d40',
    },
      collectSection: {
        backgroundColor: '#F0F0F0',
        padding: 20,
        marginTop: 10,
        borderRadius: 5,
      },
      sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      collectDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      label:{
        fontSize:16,
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      button: {
        flex: 1,
        backgroundColor: '#E0E0E0',
        padding: 20,
        marginRight: 5,
        borderRadius: 5,
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
      greenButton: {
        backgroundColor: '#004d40',
      },
      buttonText: {
        marginTop: 20,
        fontSize: 14,
        color: '#004d40',
      },
      whiteText: {
        color: '#FFFFFF',
      },
      sendButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFB300',
        padding: 30,
        marginTop: 10,
        borderRadius: 5,
      },
      sendButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#004d40',
      },
      recentActivitySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        marginTop: 20,
      },
      voir:{
        flexDirection:'row',
      },
      viewText: {
        color: '#004d40',
        fontSize: 20,
        marginRight: 5,
      },
      supportSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        padding: 30,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        // justifyContent: 'space-between',
      },
      supportText: {
        marginLeft: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#004d40',
      },
});

export default styles;