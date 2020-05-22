import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonNote,
  IonPage,
} from '@ionic/react';
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { closeOutline, informationCircle, logOutOutline } from 'ionicons/icons';
import './Menu.css';
import { menuController } from "@ionic/core";
import { fcm } from '../firebaseConfig';

const Menu: React.FC = () => {
  const location:any = useLocation();
  const user = location.state?.user;
  const history = useHistory();

  if(!user)
    return (<IonPage></IonPage>)

  return (
    <IonMenu contentId="main" type="overlay" id="menu">
      <IonContent>
     
        <div id="fechar-menu" onClick={async()=>{menuController.close()}}>
          <IonIcon icon={closeOutline} color="dark"/>
        </div>
        
        <IonList id="inbox-list">
          <IonListHeader>{user.name}</IonListHeader>
          <IonNote>{user.email}</IonNote>
         
                <IonItem lines="none">
                  <IonIcon slot="start" icon={informationCircle} />
                  <IonLabel>Em breve</IonLabel>
                </IonItem>
            
        </IonList>

        <IonList id="labels-list">
            <IonItem  onClick={ async()=>{
              await menuController.close();
              user?.rooms?.forEach((room:any)=>{
                fcm.unsubscribeFrom({ topic: room }).catch(()=>{});
              });
              delete location.state.user;
              localStorage.removeItem('user');
              history.replace('/login');
            }} lines="none">
              <IonIcon slot="start" icon={logOutOutline} />
              <IonLabel>Sair</IonLabel>
            </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
