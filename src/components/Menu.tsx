import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonPage,
} from '@ionic/react';

import React from 'react';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import { closeOutline, logoAmazon, logOutOutline } from 'ionicons/icons';
import './Menu.css';
import { menuController } from "@ionic/core";



const Menu: React.FC = () => {
  const location:any = useLocation();
  const user = location.state?.user;
  const history = useHistory();
  console.log(user)

  if(!user)
    return (<IonPage></IonPage>)

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
     
        <div id="fechar-menu" onClick={async()=>{menuController.close()}}>
          <IonIcon icon={closeOutline} color="dark"/>
        </div>
        
        
        <IonList id="inbox-list">
          <IonListHeader>{user.name}</IonListHeader>
          <IonNote>{user.email}</IonNote>
         
                <IonItem lines="none">
                  <IonIcon slot="start" icon={logoAmazon} />
                  <IonLabel>oi</IonLabel>
                </IonItem>
            
        </IonList>

        <IonList id="labels-list">
            <IonItem  onClick={ async()=>{
              await menuController.close();
              delete location.state.user;
              localStorage.removeItem('user');
              history.push('/login');
              //return <Redirect to="/login"/>
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
