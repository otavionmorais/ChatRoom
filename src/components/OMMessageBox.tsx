import React, { useState } from 'react';
import './Message.css';
import moment from 'moment';
import './OMMessageBox.css'
import {IonContent,  IonProgressBar, IonPage, IonItem, IonLabel, IonInput, IonButton, useIonViewDidEnter } from '@ionic/react';
import { createRoom } from '../firebaseConfig';
import { presentToast } from '../toast';

const OMMessageBox: React.FC = (props:any) => {
  
  const user = props.children.user;
  const set = props.children.set;
  const [checkboxSelected, setCheckboxSelected] = useState(false);
  const [nomeSala, setNomeSala] = useState('');
  const [senhaSala, setSenhaSala] = useState('');

  const ROOM_NAME_REGEX = /^([a-z]{2,10}[0-9]{0,3})$/

  const handleCreate = async() => {
    const nomeFinal = nomeSala.toLowerCase();
    
    if(ROOM_NAME_REGEX.test(nomeFinal) && await createRoom(nomeFinal, user, senhaSala)){
      //await createRoom(nomeFinal, user, senhaSala);
      presentToast('Entrou na sala com sucesso.');
    } else {
      presentToast('Falha ao entrar na sala.');
    }
    set(false);
  }

  return (
      <div id='message-box'>
          <div onClick={()=>set(false)} style={{position:'absolute', right:'10px', top: '10px', fontWeight:'bold'}}>X</div>
          <span style={{fontWeight:'bold'}}>Entrar ou criar sala</span>
          <div>
            <IonItem color="light" >
                <IonLabel position="floating">Nome da sala</IonLabel>
                <IonInput type="text" onIonChange={(e:any) => setNomeSala(e.target.value)}></IonInput>
            </IonItem>
          </div>
          <div>
            <label htmlFor='checkbox-senha'>Senha </label>
            <input type='checkbox' id='checkbox-senha' onChange={()=> {setCheckboxSelected(!checkboxSelected)}}/>
          </div>
          { checkboxSelected && (
            <div>
              <IonItem color="light" >
                <IonLabel position="floating">Senha</IonLabel>
                <IonInput type="password" onIonChange={(e:any) => setSenhaSala(e.target.value)}></IonInput>
              </IonItem>
            </div>
          )}
          <button style={{height:'30px'}} onClick={handleCreate}>Entrar</button>
      </div>
      
  );
};

export default OMMessageBox;
  