import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../src/LoginPage/login';
import Home from '../src/HomePage/home';
import NewCollecte from '../src/NewCollecte/newCollecte';
import Fiche from '../src/Fiche/fiche';
import IntroScreens from '../src/LoginPage/introductionPage';
import FicheCollecte from '../src/Fiche/ficheEnqutCollet/ficheCollecte';
import FormCollecte from '../src/Fiche/ficheEnqutCollet/formulaireCollect';
import ListesCollecte from '../src/Fiche/ficheEnqutCollet/listcollect';
// import FicheConsommation from '../src/Fiche/ficheEnqutCons/ficheConsommation';
import FormCons from '../src/Fiche/ficheEnqutCons/formulaireCons';
import ListesConso from '../src/Fiche/ficheEnqutCons/listeCons';
import FicheGrossiste from '../src/Fiche/ficheEnqutGrossiste/ficheGrossiste';
import ListesGrossistesCollect from '../src/Fiche/ficheEnqutGrossiste/listeGrossiste';
import FormGrossistes from '../src/Fiche/ficheEnqutGrossiste/formListGrossiste';
import Setting from '../src/parametre/setting';
import ListData from '../src/ListeData/ListData';
import DetailFiche from '../src/ListeData/DetailFiche';
import DetailPage from '../src/DetailPage/DetailPage';
import MarketFiches from '../src/DetailPage/MarketFiches';
import FormPort from '../src/Fiche/ficheEnqutPort/FormulairePort';
import ListPort from '../src/Fiche/ficheEnqutPort/ListPort';
import FormulaireJournalier from '../src/Fiche/ficheEnqutJournalier/FormulaireJournalier';
import ListeJournalier from '../src/Fiche/ficheEnqutJournalier/ListeJournalier';
import FormulaireDebarcadere from '../src/Fiche/ficheEnqutDebarcadere/FormulaireDebarcadere';
import ListeDebarcadere from '../src/Fiche/ficheEnqutDebarcadere/ListeDebarcadere';
import FormulaireTranfrontalier from '../src/Fiche/ficheEnqutTransf/FormulaireTranfrontalier';
import ListeTransfrontalier from '../src/Fiche/ficheEnqutTransf/listeTransfrontalier';
import FormulaireBetail from '../src/Fiche/ficheEnqutBetail/formulaireBetail';
import ListeBetail from '../src/Fiche/ficheEnqutBetail/ListeBetail';
const Stack = createStackNavigator();

const Routes = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log('token', token);
      if (token) {
        setInitialRoute('Accueil');
      } else {
        setInitialRoute('IntroScreens');
      }
    };

    checkToken();
  }, []);

  if (initialRoute === null) {
    return null; // ou un écran de chargement
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="IntroScreens"
          component={IntroScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Accueil"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Collecte"
          component={NewCollecte}
          options={{ title: 'Nouvelle collecte' }}
        />
        <Stack.Screen
          name="Fiche"
          component={Fiche}
          options={{ title: 'Fiches enquêtes' }}
        />
        <Stack.Screen
          name="Collectes"
          component={FicheCollecte}
          options={{ title: 'Fiches collectes' }}
        />
        <Stack.Screen
          name="Formulaire"
          component={FormCollecte}
          options={{ title: 'Fiche de collecte' }}
        />
        <Stack.Screen
          name="ListesCollecte"
          component={ListesCollecte}
          options={{ title: 'Listes Collectés' }}
        />
        {/* <Stack.Screen
          name="FicheConsommation"
          component={FicheConsommation}
          options={{ title: 'Fiches de consommation' }}
        /> */}
        <Stack.Screen
          name="FormCons"
          component={FormCons}
          options={{ title: 'Nouvelle collecte' }}
        />
        <Stack.Screen
          name="ListesConso"
          component={ListesConso}
          options={{ title: 'listes des consommations' }}
        />
        <Stack.Screen
          name="FicheGrossiste"
          component={FicheGrossiste}
          options={{ title: 'listes des grossistes' }}
        />
        <Stack.Screen
          name="ListesGrossistesCollect"
          component={ListesGrossistesCollect}
          options={{ title: 'listes des collectes' }}
        />
        <Stack.Screen
          name="FormGrossistes"
          component={FormGrossistes}
          options={{ title: 'Nouvelle collecte' }}
        />
        <Stack.Screen
          name="FormPort"
          component={FormPort}
          options={{ title: 'Nouvelle collecte' }}
        />
        <Stack.Screen
          name="ListPort"
          component={ListPort}
          options={{ title: 'Nouvelle collecte' }}
        />
        <Stack.Screen
          name="FormulaireJournalier"
          component={FormulaireJournalier}
          options={{ title: 'Nouvelle collecte' }}
        />
        <Stack.Screen
          name="ListeJournalier"
          component={ListeJournalier}
          options={{ title: 'Liste Journalier' }}
        />
        <Stack.Screen
          name="FormulaireDebarcadere"
          component={FormulaireDebarcadere}
          options={{ title: 'Nouvelle collecte' }}
        />
        <Stack.Screen
          name="ListeDebarcadere"
          component={ListeDebarcadere}
          options={{ title: 'Listes des débarcadères' }}
        />
        <Stack.Screen
          name="FormulaireTranfrontalier"
          component={FormulaireTranfrontalier}
          options={{ title: 'Nouvelle collecte' }}
        />
          <Stack.Screen
          name="formulaireBetail"
          component={FormulaireBetail}
          options={{ title: 'Nouvelle collecte' }}
        />
           <Stack.Screen
          name="ListeBetail"
          component={ListeBetail}
          options={{ title: 'Liste bétail' }}
        />
        <Stack.Screen
          name="listeTransfrontalier"
          component={ListeTransfrontalier}
          options={{ title: 'Listes transfrontalier' }}
        />
        <Stack.Screen
          name="ListData"
          component={ListData}
          options={{ title: 'Listes des collectes' }}
        />
        <Stack.Screen
          name="DetailFiche"
          component={DetailFiche}
          options={{ title: 'Listes des détails' }}
        />
        <Stack.Screen
          name="DetailPage"
          component={DetailPage}
          options={{ title: 'Liste des marchés' }}
        />
        <Stack.Screen
          name="MarketFiches"
          component={MarketFiches}
          options={{ title: 'Liste des fiches' }}
        />
        <Stack.Screen
          name="Setting"
          component={Setting}
          options={{ headerShown: false }}
        // options={{ title: 'listes des collectes' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
