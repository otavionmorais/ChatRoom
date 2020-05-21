import { IonButtons, IonContent, IonHeader, IonAlert, IonActionSheet, IonMenuButton, IonPage, IonToolbar, IonButton, IonIcon } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory, useLocation, Redirect } from 'react-router';
import './Rooms.css';
import { presentToast } from '../toast';

import Menu from '../components/Menu';
import Chat from '../components/Chat';
import { updateUser, addUserToRoom, createRoom, removeUserFromRoom } from '../firebaseConfig';
import { addCircleOutline, addOutline, trash, close } from 'ionicons/icons';
import LongPressable from 'react-longpressable';


const Rooms: React.FC = () => {

  const location:any = useLocation();
  const [user, setUser]:any = useState(location.state?.user);
  const [showAlert1, setShowAlert1] = useState(false);
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
                  handler: () => {
                   
                  }
                },
                {
                  text: 'Ok',
                  handler: async (data) => {
                    await createRoom(data.roomName, user);
                    presentToast('Entrou na sala com sucesso.')
                  }
                }
              ]}
            />
              <IonButton onClick={()=>setShowAlert1(true)}><IonIcon icon={addOutline}></IonIcon> </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      <IonContent color="dark">
        <Menu/>
        <div id="rooms-container">
          {user.rooms? user.rooms.map((room:any, index:number)=>{
            return <LongPressable onLongPress={()=>{longPress(room)}} ><Chat key={index} children={{room, user}}/></LongPressable>
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
            handler: () => {
              console.log('Cancel clicked');
            }
          }]}/>
      </IonContent>
    </IonPage>
  );
};

export default Rooms;
