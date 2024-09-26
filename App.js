import React, { useEffect } from 'react';
import Routes from './routes/routes';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import SyncService from "./database/services/SyncService";
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import database from "./database/database"; // Import du DatabaseProvider

const App = () => {
    useEffect(() => {
        const performSync = async () => {
            try {
                await SyncService.syncDatabase(database);
                console.log('Synchronisation réussie');
            } catch (error) {
                console.error('Erreur de synchronisation:', error);
            }
        };

        performSync();
    }, []);

    return (
        <DatabaseProvider database={database}>
            <PaperProvider>
                <Routes />
                <Toast />
            </PaperProvider>
        </DatabaseProvider>
    );
};

export default App;
