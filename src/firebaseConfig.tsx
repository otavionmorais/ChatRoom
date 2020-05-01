import firebase from 'firebase';
import { presentToast } from './toast';
import {config} from './apiKey';
import User from './models/User';

firebase.initializeApp(config);

const database = firebase.database();
const auth = firebase.auth();

interface userInfo {
    email: string;
    nome: string;
    password: string;
}

export const criarUsuario = async (info:userInfo) =>{
    try{
        await auth.createUserWithEmailAndPassword(info.email, info.password);
        await database.ref('/users').push({nome: info.nome, email: info.email});
        return true;
    } catch(error){
        return false;
    }
}

export const efetuarLogin = async(email:string, senha:string) => {
    try{
        let databaseUser:any=null;
        await auth.signInWithEmailAndPassword(email, senha);
        await database.ref('/users').once('value', (result)=> {
            result.forEach((user)=> {
                if(user.val().email===email){
                   databaseUser=user.val();
                   return;
                }
            });
        });
        return new User(databaseUser.nome, databaseUser.email);
    } catch (error) {
        return null;
    }
}

