import {IonContent,  IonProgressBar, IonHeader, IonToolbar, IonButtons, IonPage, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import React, { useState } from 'react';
import {  useHistory, useLocation } from 'react-router';
import './Conversa.css';
import {login, createRoom, addUserToRoom, updateMessages, findRoomByName } from '../firebaseConfig';
import { presentToast } from '../toast';
import Logo from '../images/crlogolight.png';

import {database} from '../firebaseConfig';


const Conversa: React.FC = () => {

  const history = useHistory();
  const location:any = useLocation(); 
  const room = location.state.room;

  const [update, setUpdate] = useState(false);
  const [messages, setMessages] = useState([]);
  //setUpdate(false);
/*
  findRoomByName(room).then(result=>{
    database.ref('rooms/'+result.key+'/messages').on('value', (result)=>{
      if(JSON.stringify(messages)!==JSON.stringify(result.val())){
        setMessages(result.val());
        console.log(messages);
      }
    });
  });
  */
  updateMessages(room, messages, setMessages);

  console.log('renderizou');
  
  
  return (
    <IonPage>
      <IonHeader>
          <IonToolbar color="light">
            
            <div id="bar-conversa">
              {room}
            </div>
          </IonToolbar>
        </IonHeader>
      <IonContent color="dark">
      { messages? messages.map((message:any, index:number)=>{
            return message+',';
      }):''}
        <div id="input-conversa-container">
            <IonItem color="light" id="input-conversa">
                <IonLabel position="floating">Digite aqui...</IonLabel>
                <IonInput type="text" ></IonInput>
            </IonItem>
            <IonButton id="botao-enviar-conversa">Enviar</IonButton>
            
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Conversa;
