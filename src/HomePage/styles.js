
import { StyleSheet ,Dimensions} from "react-native";
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    syncIcon: {
      position: 'absolute',
      right: 10,
      top: 10,
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
        flexDirection: 'row',
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
      fontSize: 20,
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
  // card: {
  //   width: '30%',
  //   backgroundColor: '#D8D8D8',
  //   padding:12,
  //   borderRadius:10,
  //   // position: 'relative',
  // },
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
 
      label:{
        fontSize:16,
      },
      buttonRow: {
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
      cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    // card: {
    //     flex: 1,
    //     marginHorizontal: 5,
    //     padding: 0,
    //     borderRadius: 10,
    //     backgroundColor: '#f8f8f8',
    //     position: 'relative',
    // },
    cardTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },

// Card

    cardContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      // padding: 10,
  },
  card: {
      width: (width / 2) - 20, // Adjust the width to fit two cards per row with padding
      height: 100, // Set a fixed height for all cards
      marginVertical: 10,
      
  },
  cardContent: {
      position: 'relative',
      padding: 10,
  },
  leftContent: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap:10
  },
  marketIcon: {
      width: 20,
      height: 35,
      // marginRight: 10,
  },
  marketName: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  backgroundImage: {
      position: 'absolute',
      bottom: -14,
      right: 1,
      width: '100%',
      height: '100%',
      opacity: 0.5,
  },
  badge: {
      position: 'absolute',
      top: -10,
      right: 0,
      backgroundColor: '#0FA958',
      color: 'white',
  },


});

export default styles;