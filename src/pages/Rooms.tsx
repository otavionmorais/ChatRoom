import { IonButtons, IonContent, IonHeader, IonAlert, IonActionSheet, IonMenuButton, IonPage, IonToolbar, IonButton, IonIcon } from '@ionic/react';
import React, { useState } from 'react';
import { useLocation, Redirect } from 'react-router';
import './Rooms.css';
import { presentToast } from '../toast';

import Menu from '../components/Menu';
import Chat from '../components/Chat';
import { updateUser, createRoom, removeUserFromRoom } from '../firebaseConfig';
import { addOutline, trash, close } from 'ionicons/icons';
import LongPressable from 'react-longpressable';
import OMMessageBox from '../components/OMMessageBox'

const ROOM_NAME_REGEX = /^([a-z]{2,10}[0-9]{0,3})$/

const Rooms: React.FC = () => {

  const location:any = useLocation();
  const [user, setUser]:any = useState(location.state?.user);
  const [showAlert1, setShowAlert1] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedRoom, setSelectedRoom]:any = useState(null);

  const longPress = (roomName) =>{
    setSelectedRoom(roomName);
    setShowActionSheet(true);
  }

  if(!location.state || !user){
    return <Redirect to="/login"/>;
  }

  updateUser(user.email, user, setUser);
  if(localStorage.getItem('user'))
    localStorage.setItem('user', JSON.stringify(user));
  location.state.user = user;

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
            <IonButtons slot="end">
            <IonAlert
              isOpen={showAlert1}
              onDidDismiss={() => setShowAlert1(false)}
              header={'Criar ou entrar em sala'}
              inputs={[
                {
                  name: 'roomName',
                  type: 'text',
                  placeholder: 'Nome da sala'
                }
              ]}
              
              buttons={[
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {}
                },
                {
                  text: 'Ok',
                  handler: async (data) => {
                    const nomeFinal = data.roomName?.toLowerCase();
                    if(ROOM_NAME_REGEX.test(nomeFinal)){
                      await createRoom(nomeFinal, user);
                      presentToast('Entrou na sala com sucesso.');
                    } else {
                      presentToast('O nome da sala deve conter somente letras e números, sem acentos ou espaços.');
                    }
                  }
                }
              ]}
            />
              <IonButton onClick={()=>setShowCreateRoom(!showCreateRoom)}><IonIcon icon={addOutline}></IonIcon> </IonButton>
              
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      <IonContent color="dark">
      { showCreateRoom && (
                <OMMessageBox children={{user, set: setShowCreateRoom}}/>
              )}
        <Menu/>
        <div id="rooms-container">
          {user.rooms? user.rooms.map((room:any, index:number)=>{
            return <LongPressable key={index} onShortPress={()=>{}} onLongPress={()=>{longPress(room)}} ><Chat key={index} children={{room, user}}/></LongPressable>
          }):''}
          
        </div>
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header = {selectedRoom}
          buttons={[{
            text: 'Sair da sala',
            icon: trash,
            handler: async () => {
              await removeUserFromRoom(user.email, selectedRoom);
              presentToast('Sala '+selectedRoom+" removida.")
            }
          }, {
            text: 'Cancelar',
            icon: close,
            handler: () => {}
          }]}/>
      </IonContent>
    </IonPage>
  );
};

export default Rooms;
