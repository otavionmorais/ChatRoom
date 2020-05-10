import {
    IonIcon,
  } from '@ionic/react';
  
  import React from 'react';
  import { useLocation, useHistory } from 'react-router-dom';
  import { enterOutline } from 'ionicons/icons';
  import './Chat.css';
  
  const Chat: React.FC = (props:any) => {
    
    const history=useHistory();
    
    return (
    <div id="chat-container" onClick={()=>history.push('/conversa', {user: props.children.user, room: props.children.room})}>
        <span id="chat-title">{props.children.room}</span>
        <IonIcon icon={enterOutline} size="large"/>
    </div>
    );
  };
  
  export default Chat;
  