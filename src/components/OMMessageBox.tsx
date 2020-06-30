import React, { useState } from 'react';
import './Message.css';
import moment from 'moment';
import './OMMessageBox.css'

const OMMessageBox: React.FC = (props:any) => {
  
  const user = props.children.user;
  const set = props.children.set;
  const [checkboxSelected, setCheckboxSelected] = useState(false);

  return (
      <div id='message-box'>
          <div onClick={()=>set(false)} style={{position:'absolute', right:'10px', top: '10px', fontWeight:'bold'}}>X</div>
          <span style={{fontWeight:'bold'}}>Entrar ou criar sala</span>
          <div>
              Nome da sala<br/>
            <input type='text' style={{width: '100%'}}/>
          </div>
          <div>
            <label htmlFor='checkbox-senha'>Senha </label>
            <input type='checkbox' id='checkbox-senha' onChange={()=> {setCheckboxSelected(!checkboxSelected)}}/>
          </div>
          { checkboxSelected && (
            <div>
                Senha<br/>
                <input type='text' style={{width: '100%'}}/>
            </div>
          )}
          <button style={{height:'30px'}}>Entrar</button>
      </div>
      
  );
};

export default OMMessageBox;
  