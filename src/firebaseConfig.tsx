import firebase from 'firebase';
import { presentToast } from './toast';
import {config} from './apiKey';

firebase.initializeApp(config);

interface userInfo {
    email: string;
    nome: string;
    password: string;
}

export const criarUsuario = async (info:userInfo) =>{
    try{
        await firebase.auth().createUserWithEmailAndPassword(info.email, info.password);
        await firebase.database().ref('/users').push({nome: info.nome, email: info.email});
    } catch(error){
        presentToast('Erro ao criar usuário.');
    }
}

