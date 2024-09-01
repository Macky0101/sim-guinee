import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 6, 
    borderRadius: 10, 
    borderBottomEndRadius:0,
    borderBottomStartRadius: 0,
    alignSelf: 'center', 
    width: '95%', 
  },
  logo: {
    width: '100%', 
    height: 150,
  },
  connec:{
    fontSize:24,
    fontWeight:'400'
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 16,
    padding: 10,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9d310',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#005849',
    marginTop: 15,
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordContainer: {
    
  },

  buttonDisabled: {
    backgroundColor: '#dddddd',
  },
});
