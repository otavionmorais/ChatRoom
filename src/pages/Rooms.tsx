import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import './Rooms.css';
import { presentToast } from '../toast';

import Menu from '../components/Menu';
import Chat from '../components/Chat';
import { updateUserMessages } from '../firebaseConfig';



const Rooms: React.FC = () => {

  const history = useHistory();
  const [messages, setMessages] = useState([]);
  const location:any = useLocation();
  const user = location.state?.user;

 // console.log(user);
  if(!user)
    return (<IonPage>Usuário inválido.</IonPage>);


  return (
    <IonPage>
        <IonHeader>
          <IonToolbar color="light">
            <IonButtons slot="start">
              <IonMenuButton id="botao-menu"/>
            </IonButtons>
            <div id="bar-rooms">
              Suas salas
            </div>
          </IonToolbar>
        </IonHeader>
      <IonContent color="dark">
        <Menu/>
        <div id="rooms-container">
          {user.rooms? user.rooms.map((room:any, index:number)=>{
            return <Chat key={index} children={{room}}/>
          }):''}
          
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Rooms;
