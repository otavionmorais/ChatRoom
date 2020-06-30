import {IonIcon} from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { enterOutline, caretForwardOutline, arrowForwardOutline } from 'ionicons/icons';
import './Chat.css';

const Chat: React.FC = (props:any) => {
  
  const history=useHistory();
  
  return (
  <div id="chat-container" onClick={()=>history.push('/conversa', {user: props.children.user, room: props.children.room})}>
      <span id="chat-title">{props.children.room}</span>
      <IonIcon icon={arrowForwardOutline} style={{fontSize:'12pt'}}/>
  </div>
  );
};

export default Chat;
  