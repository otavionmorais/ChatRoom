import firebase from 'firebase';
import { presentToast } from './toast';
import {config} from './apiKey';
import { isArray } from 'util';

firebase.initializeApp(config);

export const database = firebase.database();
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

export const updateUserMessages = async (user:any, state:any, setState:Function) => {
    const databaseUser = await findUserByEmail(user.email);

    databaseUser.rooms.map(async (room:any, index:number)=>{
        const {key:roomKey} = await findRoomByName(room);
        //console.log(roomKey);
        database.ref('rooms/'+roomKey+'/messages').on('value', function(snapshot) {
           if(isArray(snapshot.val())){
                setState([...state, snapshot.val()[snapshot.val().length-1]]);
                console.log('mudou');
           }
            
        });

    });
}

export const updateMessages = async (room:string, messages:any, setMessages:Function)=>{

    const {key:roomKey} = await findRoomByName(room);
    //database.ref('rooms/'+roomKey+'/messages').off();
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

