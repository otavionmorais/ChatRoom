import {IonContent,  IonProgressBar, IonHeader, IonToolbar, IonButtons, IonPage, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import React, { useState } from 'react';
import {  useHistory, useLocation } from 'react-router';
import './Conversa.css';
import {updateMessages, sendMessage } from '../firebaseConfig';
import Message from '../components/Message'


const Conversa: React.FC = () => {

  const history = useHistory();
  const location:any = useLocation(); 
  const room = location.state.room;
  const user = location.state.user;
  const [messages, setMessages] = useState([]);
  const [digitado, setDigitado] = useState("");
  
  updateMessages(room, messages, setMessages);

  const enviarMensagem = async () => {
    await sendMessage(room, digitado, user);
    setDigitado("");
  }

  //padrao msgs
  /*
    {
      name:
      email:
      content:
      timestamp:
    }
  */
  
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
            return <Message key={index} children={{key:index, user, message}}/>;
      }):''}
        <div id="input-conversa-container">
            <IonItem color="light" id="input-conversa">
               
                <IonInput type="text" value={digitado} placeholder="Digite aqui..." onIonChange={(e:any) => setDigitado(e.target.value)} ></IonInput>
            </IonItem>
            <IonButton id="botao-enviar-conversa" onClick={enviarMensagem}>Enviar</IonButton>
            
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Conversa;
