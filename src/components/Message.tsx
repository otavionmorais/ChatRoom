
  import React from 'react';
  import { enterOutline } from 'ionicons/icons';
  import './Message.css';
  import moment from 'moment';
  
  const Message: React.FC = (props:any) => {
    
    const key = props.children.key;
    const currentUserEmail = props.children.user.email;
    const username = props.children.message.username;
    const email = props.children.message.email;
    const content =  props.children.message.content;
    const timestamp = props.children.message.timestamp;
    const date = moment(timestamp).format("DD-MM-YYYY hh:mm");

    const container = document.getElementById('message-container'+key);
    console.log(key)
    if(container){
        if(currentUserEmail===email){
            document.getElementById('message-container'+key)!.classList.add('my-message');
            document.getElementById('message-container'+key)!.classList.remove('other-message');
        } else {
            document.getElementById('message-container'+key)!.classList.add('other-message');
            document.getElementById('message-container'+key)!.classList.remove('my-message');
        }
    }
        

    return (
        <div id={"message-container"+key} className="message-container">
            <div id={"message-baloon"+key} className="message-baloon">
                <span id={"message-title"+key} className="message-title">{username}</span>
                <span id={"message-content"+key} className="message-content">{content}</span>
                <span id={"message-timestamp"+key} className="message-timestamp">{date}</span>
            </div>
        </div>
    );
  };
  
  export default Message;
  