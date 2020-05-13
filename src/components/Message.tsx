
  import React from 'react';
  import { enterOutline } from 'ionicons/icons';
  import './Message.css';
  import moment from 'moment';
  
  const Message: React.FC = (props:any) => {
    
    const key = props.children.key;
    const username = props.children.message.username;
    const content =  props.children.message.content;
    const timestamp = props.children.message.timestamp;
    const date = moment(timestamp).format("DD-MM-YYYY HH:mm");
    const myMessage = props.children.myMessage;

    return (
        <div id={"message-container"+key} className={"message-container "+ (myMessage? "my-message":"") }>
            <div id={"message-baloon"+key} className="message-baloon">
                <span id={"message-title"+key} className="message-title">{username}</span>
                <span id={"message-content"+key} className="message-content">{content}</span>
                <span id={"message-timestamp"+key} className="message-timestamp">{date}</span>
            </div>
        </div>
        
    );
  };
  
  export default Message;
  