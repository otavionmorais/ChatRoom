import {IonContent,  IonProgressBar, IonHeader, IonToolbar, IonAlert, IonPage, IonItem, IonLabel, IonInput, IonButton, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import {  useHistory, useLocation } from 'react-router';
import './Conversa.css';
import {updateMessages, sendMessage } from '../firebaseConfig';
import Message from '../components/Message'
import { isArray } from 'util';


const Conversa: React.FC = () => {

  const history = useHistory();
  const location:any = useLocation(); 
  const room = location.state.room;
  const user = location.state.user;
  const [messages, setMessages]:any = useState(null);
  const [digitado, setDigitado] = useState("");
  const [mostrarLoading, setMostrarLoading] = useState(false);
  const container:any = document.getElementById('conversa-container');
  const botaoEnviar:any = document.getElementById('botao-enviar-conversa');
  
  updateMessages(room, messages, setMessages);

  if(container){
    container.scrollTop = container.scrollHeight;
  }

  const enviarMensagem = async () => {
    if(digitado.replace(/ /g,'') !== ''){
      botaoEnviar.disabled = true;
      setMostrarLoading(true);
      await sendMessage(room, digitado, user);
      setDigitado("");
      botaoEnviar.disabled = false;
      setMostrarLoading(false);
    }
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
        <div id="conversa-container">
          { messages? Object.keys(messages).map((message:any, index:number)=>{
              let myMessage = (messages[message].email===user.email);
              return <Message key={index} children={{key:index, message: messages[message], myMessage}}/>;
          }):<IonAlert isOpen={true} header={'Carregando mensagens...'}/>}
        </div>
        <div id="campos-conversa">
          <IonItem color="light" id="input-conversa">
              <IonInput type="text" value={digitado} placeholder="Digite aqui..." onIonChange={(e:any) => setDigitado(e.target.value)} ></IonInput>
          </IonItem>
          <IonButton id="botao-enviar-conversa" onClick={enviarMensagem}>
            <div id="botao-enviar-content">
              Enviar
              {(mostrarLoading ? <IonProgressBar type="indeterminate" color="medium" id="progress-bar-conversa"></IonProgressBar> : '')}
            </div>
            
          </IonButton>
        </div>
        
      </IonContent>
    </IonPage>
  );
};

export default Conversa;
