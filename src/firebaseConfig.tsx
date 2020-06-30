import firebase from 'firebase';
import {config} from './apiKey';
import moment from 'moment';
import axios from 'axios';
import { FCM } from "capacitor-fcm";
export const fcm = new FCM();

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
        if(!databaseKey || !databaseRoom)
            return null;
        return {...databaseRoom, key: databaseKey};
    } catch(error){
        return null;
    }
}

export const addUserToRoom = async (user:string, roomName:string) => {
    try{
        let {key:userKey, rooms:userRooms} = await findUserByEmail(user);
        let {key:roomKey, users:roomUsers} = await findRoomByName(roomName);
        
        if(roomUsers && userRooms) {
            if(roomUsers.find( (element:any) => element === user) || userRooms.find((element:any) => element === roomName))
                return null;
        }
        if(!roomUsers) 
            roomUsers = [];
        
        if(!userRooms)
            userRooms = [];
        
            
        roomUsers.push(user);
        userRooms.push(roomName);

        await database.ref('/rooms/'+roomKey+'/users').set(roomUsers);
        await database.ref('/users/'+userKey+'/rooms').set(userRooms);
    } catch(error){
        console.log(error)
        return null;
    }
}

export const removeUserFromRoom = async(user:any, roomName:string) =>{

    try{
        let {key:userKey, rooms:userRooms} = await findUserByEmail(user);
        let {key:roomKey, users:roomUsers} = await findRoomByName(roomName);
        
        if(roomUsers && userRooms) {
            //console.log(roomUsers.indexOf(roomName))
            roomUsers.splice(roomUsers.indexOf(user), 1);
            userRooms.splice(userRooms.indexOf(roomName), 1);

            await database.ref('/rooms/'+roomKey+'/users').set(roomUsers);
            await database.ref('/users/'+userKey+'/rooms').set(userRooms);
        }
    } catch(error){
        console.log(error)
        return null;
    }

}

export const createRoom = async(name:string, user:any, password:any = null) =>{
    const exists = await findRoomByName(name);

    if(!exists){
        await database.ref('/rooms').push({name, password});
        await addUserToRoom(user.email, name);
        return true;
    } else {
        if(!exists.password || exists.password == password){
            await addUserToRoom(user.email, name);
            return true;
        } 
        else return false;
    }
}

export const updateMessages = async (room:string, messages:any, setMessages:Function)=>{

    const {key:roomKey} = await findRoomByName(room);
    database.ref('rooms/'+roomKey+'/messages').off();
    database.ref('rooms/'+roomKey+'/messages').orderByChild('timestamp').on('value', function(result) {
        if(result.val()){
            const newMessages:any = [];
            result.forEach(message=>{
                newMessages.push(message.val());
            });
            setMessages(newMessages);
        } else {
            setMessages([]);
        }
     });
}

export const updateUser = async (email:string, user:any, setUser:Function)=>{

    const {key:userKey} = await findUserByEmail(email);
    database.ref('users/'+userKey).off();
    database.ref('users/'+userKey).on('value', function(result) {
        if(result.val()!=null && JSON.stringify(user)!==JSON.stringify(result.val())){
            result.val().rooms?.forEach((room:any)=>{
                fcm.subscribeTo({ topic: room }).catch(()=>{});
            });
            setUser(result.val());
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

export const sendMessage = async (room:string, content:string, user:any) =>{
    try{
        const {key:roomKey} = await findRoomByName(room);
        const {data} = await axios.get('https://worldtimeapi.org/api/timezone/America/Sao_Paulo');
        const time = data.datetime;
        await database.ref('/rooms/'+roomKey+'/messages/').push({
            username: user.name,
            email: user.email,
            content,
            timestamp: moment(time).valueOf()
        });
        axios.get('https://om.blog.br/chatroom/notificacao?titulo='+room+'&msg='+user.name+': '+content+'&room='+room);
    } catch(error){
        console.log(error)
    }
}


