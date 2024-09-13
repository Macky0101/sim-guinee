
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
        // padding: 10,
        // marginBottom:30,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    profileSection: {
        // flexDirection: 'row',
        // alignItems: 'center',
        flex: 1,  // Prendre tout l'espace disponible à gauche
    },
    notificationSection: {
        alignItems: 'flex-end',  // Aligner l'icône à droite
    },
    profileImage: {
        width: '50%',
        height: 47,
        // borderRadius: 25,
        // backgroundColor: 'rgba(0, 0, 0, 0.1)',
        // marginRight: 10,
    },
    dataImage:{
      width: '80%',
      height: 47,
      marginBottom:30
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    usernameText: {
        fontSize: 16,
        color: '#004d40',
    },
    dataHeader: {
      flexDirection: 'colunm',
      // alignItems: 'center',
      justifyContent:'space-between'
    
    },
    logo:{
      marginRight:10
    },
    dataTitle: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    dataIconsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Correction ici
    },
    dataSection:{
      borderRadius: 5,
      marginBottom:5
    }, 
    iconbtn:{
      alignItems:'flex-start',
      backgroundColor:'#009C57',
      borderRadius:10,
      margin:1
    },
    rowIcon:{
      flexDirection: 'row',
    },
    cardAgricole:{
      backgroundColor:'#E9E9E9',
      padding: 4,
      borderRadius:5,
    position: 'relative',

    },
    cardRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      margin: 10
  },
  card: {
    width: '30%',
    backgroundColor: '#D8D8D8',
    padding:12,
    borderRadius:10,
    // position: 'relative',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    elevation:2,
    shadowColor: '#000000',
  },
  cardTitle:{
    marginTop: 10,
fontSize:12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#777',
    marginLeft: 10,
  },
  cardImage:{
    position:'absolute',
    top: -35,
    left: 0,
    right: 0,
    bottom: 0,
    
  },
  
      // collectSection: {
      //   backgroundColor: '#F0F0F0',
      //   padding: 20,
      //   marginTop: 10,
      //   borderRadius: 5,
      // },
      // sectionTitle: {
      //   fontSize: 20,
      //   fontWeight: 'bold',
      //   marginBottom: 10,
      // },
      // collectDetails: {
      //   flexDirection: 'row',
      //   justifyContent: 'space-between',
      //   marginBottom: 10,
      // },
      label:{
        fontSize:16,
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom:5,
      },
      button: {
        flex: 1,
        backgroundColor: '#E9E9E9',
        padding: 10,
        marginRight: 2,
        borderRadius: 5,
        alignItems: 'flex-start',
        flexDirection: 'column',
        position: 'relative',
      },
      imagePeche:{
        position: 'absolute',
        top: 0,
        left: 90,
        right: 0,
        bottom: 0,
        resizeMode: 'cover', // Ajuster l'image pour couvrir le conteneur
        // opacity: 0.9,
      },
      fichePecheFrontal:{
        width:40,
        height:40,
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
        marginTop: 5,
        padding: 30,
        backgroundColor: '#E9E9E9',
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