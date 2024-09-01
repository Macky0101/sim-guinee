import { StyleSheet } from "react-native";

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
      backgroundColor: '#F5F5F5',
      padding: 30,
      borderRadius: 5,
      marginBottom: 10,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'space-between',
      flex:1
    },
    titlecard:{
     flexDirection: 'column',
    },
    formText: {
      fontSize: 16,
      color: '#333',
    },
    formImage: {
      width: 90,
      height: 90,
    },
    image:{
        alignItems: 'flex-end',
    }
  });

  export default styles