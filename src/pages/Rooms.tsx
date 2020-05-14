import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory, useLocation, Redirect } from 'react-router';
import './Rooms.css';
import { presentToast } from '../toast';

import Menu from '../components/Menu';
import Chat from '../components/Chat';
import { updateUser } from '../firebaseConfig';

const Rooms: React.FC = () => {

  const history = useHistory();
  const location:any = useLocation();
  const [user, setUser]:any = useState(location.state?.user);

  if(!location.state || !user){
    return <Redirect to="/login"/>;
  }

  updateUser(user.email, user, setUser);

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
            return <Chat key={index} children={{room, user}}/>
          }):''}
          
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Rooms;
