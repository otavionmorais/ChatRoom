import {IonContent,  IonProgressBar, IonPage, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import React, { useState } from 'react';
import {  useHistory, Redirect } from 'react-router';
import './Login.css';
import {login, createRoom, addUserToRoom } from '../firebaseConfig';
import { presentToast } from '../toast';
import Logo from '../images/crlogolight.png';


const Login: React.FC = () => {

  const history = useHistory();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarLoading, setMostrarLoading] = useState(false);

  
  const logar = async() => {
    setMostrarLoading(true);
    const user = await login(email, senha);
    if(user){
        //localStorage.setItem('user', JSON.stringify(user));
        history.replace('/rooms', {user});
        
    } else {
        presentToast('Dados incorretos.')
    }
    setMostrarLoading(false);
  }
/*
  if(localStorage.getItem('user'))
    return <Redirect to={{
      pathname: '/rooms',
      state: {
        user: JSON.parse(localStorage.getItem('user')!)
      }
    }}/> */
 

  return (
    <IonPage>
      
      <IonContent color="dark">
        <div id="login-container">
            
            <img id="logo-login" width="200px" height="70px" src={Logo}/>
            <span id="descricao-login">Converse o que quiser, quando quiser. 💬 </span>

            <div id="login-campos-container">
                <IonItem color="light" className="input-login">
                    <IonLabel position="floating">E-mail</IonLabel>
                    <IonInput type="email" onIonChange={(e:any) => setEmail(e.target.value)}></IonInput>
                </IonItem>
                <IonItem color="light" className="input-login">
                    <IonLabel position="floating">Senha</IonLabel>
                    <IonInput type="password" onIonChange={(e:any) => setSenha(e.target.value)}></IonInput>
                </IonItem>
                <div id="loading-login">{(mostrarLoading ? <IonProgressBar type="indeterminate" color="medium"></IonProgressBar> : '')}</div>
                <IonButton onClick={async()=>{await logar()}} id="botao-login">Entrar</IonButton>
            </div>
            <div id="cadastro-login-container">
                Não tem conta? Cadastre-se! É Grátis!
                <IonButton onClick={()=>{history.push('/cadastro')}} id="botao-cadastro-login">Cadastro</IonButton>
            </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
