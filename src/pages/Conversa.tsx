import {IonContent,  IonProgressBar, IonHeader, IonToolbar, IonButtons, IonPage, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import React, { useState } from 'react';
import {  useHistory, useLocation } from 'react-router';
import './Conversa.css';
import {login, createRoom, addUserToRoom } from '../firebaseConfig';
import { presentToast } from '../toast';
import Logo from '../images/crlogolight.png';


const Conversa: React.FC = () => {

  const history = useHistory();
  const location:any = useLocation(); 
  const room = location.state.room;
  
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
