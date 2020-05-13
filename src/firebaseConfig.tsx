import firebase from 'firebase';
import { presentToast } from './toast';
import {config} from './apiKey';
import moment from 'moment';
import axios from 'axios';

firebase.initializeApp(config);

const database = firebase.database();
const auth = firebase.auth();

interface userInfo {
    email: string;
    name: string;
    password: string;
}

const findUserByEmail = async(email:string) => {
    let databaseUser:any = null;
    let databaseKey:any = null;
    try{
        await database.ref('/users').once('value', (result)=> {
            
            result.forEach((user)=> {
                if(user.val().email===email){
                    databaseKey = user.key;
                    databaseUser=user.val();
                    return;
                }
            });
        });
        return {...databaseUser, key: databaseKey};
    } catch(error){
        return null;
    }
}

export const findRoomByName = async (name:string) =>{
    let databaseRoom:any=null;
    let databaseKey:any = null;
    try{
        await database.ref('/rooms').once('value', (result)=> {
            result.forEach((room)=> {
                if(room.val().name===name){
                    databaseKey=room.key;
                    databaseRoom=room.val();
                    return;
                }
            });
        });
        return {...databaseRoom, key: databaseKey};
    } catch(error){
        return null;
    }
}

export const addUserToRoom = async (user:string, roomName:string) => {
    try{
        const {key:userKey, rooms:userRooms} = await findUserByEmail(user);
        const {key:roomKey, users:roomUsers} = await findRoomByName(roomName);

        if(roomUsers.find(user) || userRooms.find(roomName))
            return null;

        roomUsers.push(user);
        userRooms.push(roomName);

        await database.ref('/rooms/'+roomKey+'/users').set(roomUsers);
        await database.ref('/users/'+userKey+'/rooms').set(userRooms);
    } catch(error){
        
        return null;
    }

}

export const createRoom = async(name:string, user:any) =>{
    const exists = await findRoomByName(name);

    if(!exists){
        await database.ref('/rooms').push({name, users:[user.email]});
        return true;
    } else {
        await addUserToRoom(user.email, name);
        return false;
    }
}

export const updateMessages = async (room:string, messages:any, setMessages:Function)=>{

    const {key:roomKey} = await findRoomByName(room);
    database.ref('rooms/'+roomKey+'/messages').off();
    database.ref('rooms/'+roomKey+'/messages').on('value', function(result) {
        if(JSON.stringify(messages)!==JSON.stringify(result.val())){
             setMessages(result.val());
            //console.log('mudou');
        }
     });
}

export const createUser = async (info:userInfo) =>{
    try{
        await auth.createUserWithEmailAndPassword(info.email, info.password);
        await database.ref('/users').push({name: info.name, email: info.email, rooms: ['chatroom']});
        await addUserToRoom(info.email, 'chatroom');
        return true;
    } catch(error){
        return false;
    }
}

export const login = async(email:string, password:string) => {
    try{
        await auth.signInWithEmailAndPassword(email, password);
        return findUserByEmail(email);
    } catch (error) {
        return null;
    }
}

const getMessagesCount = async (roomKey:string) =>{
    let size=0;
    await database.ref('/rooms/'+roomKey+'/messages').once('value', (result)=>{
        if(result.val()){
            const obj = Object.values(result.val());
            size=obj.length;
        } 
    });
    return size;
}

export const sendMessage = async (room:string, content:string, user:any) =>{
    try{
        const {key:roomKey} = await findRoomByName(room);
        const position = await getMessagesCount(roomKey);
        const {data} = await axios.get('http://worldtimeapi.org/api/timezone/America/Sao_Paulo');
        const time = data.datetime;
        await database.ref('/rooms/'+roomKey+'/messages/'+position).set({
            username: user.name,
            email: user.email,
            content,
            timestamp: moment(time).format()
        });
    } catch(error){

    }
}


