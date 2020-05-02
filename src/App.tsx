import Menu from './components/Menu';
import React from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane, useIonViewDidEnter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useLocation } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { Plugins } from "@capacitor/core";
import { FCM } from "capacitor-fcm";
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Rooms from './pages/Rooms';
import { menuController } from "@ionic/core";
import Conversa from './pages/Conversa';
const { PushNotifications, SplashScreen } = Plugins;

const fcm = new FCM();

PushNotifications.register().then(()=>{
  fcm.subscribeTo({ topic: "teste" });
});



// <Menu />
const App: React.FC = () => {

  window.onload = () => {
    SplashScreen.hide();
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          
          <IonRouterOutlet id="main">
            <Route path="/conversa" component={Conversa} exact />
            <Route path="/rooms" component={Rooms} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/cadastro" component={Cadastro} exact />
            <Redirect from="/" to="/login" exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
