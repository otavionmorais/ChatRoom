import { IonIcon, IonContent, IonProgressBar, IonPage, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import './Cadastro.css';
import { presentToast } from '../toast';
import { createUser } from '../firebaseConfig';
import { arrowBack } from 'ionicons/icons';
import Logo from '../images/crlogolight.png'

const Cadastro: React.FC = () => {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
  const [nome, setNome] = useState('');
  const history = useHistory();
  const [mostrarLoading, setMostrarLoading] = useState(false);

    const cadastrar = async() => {
        setMostrarLoading(true);
        if(nome.length>3 && senha.length>5 && senhaConfirmacao===senha
            && (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email))){

            const success = await createUser({name:nome, email, password:senha});
            if(success){
                presentToast('Cadastro efetuado!');
                history.replace('/login');
            } else {
                presentToast('Erro ao registrar.');
            }

        } else presentToast('Dados incorretos.');

        setMostrarLoading(false);
    }

  return (
    <IonPage>
     

      <IonContent color="dark">
        <div id="cadastro-container">
            <IonIcon icon={arrowBack} onClick={()=>history.replace('/login')} color="light"/>
            <img src={Logo} id="logo-cadastro" alt=""/>
            <div id="titulo-cadastro">Cadastro</div>
            <div id="cadastro-campos-container">
                <IonItem color="light" className="input-cadastro">
                    <IonLabel position="floating">Nome de exibição</IonLabel>
                    <IonInput type="text" onIonChange={(e:any) => setNome(e.target.value)}></IonInput>
                </IonItem>
                <IonItem color="light" className="input-cadastro">
                    <IonLabel position="floating">E-mail</IonLabel>
                    <IonInput type="email" onIonChange={(e:any) => setEmail(e.target.value)}></IonInput>
                </IonItem>
                <IonItem color="light" className="input-cadastro">
                    <IonLabel position="floating">Senha</IonLabel>
                    <IonInput type="password" onIonChange={(e:any) => setSenha(e.target.value)}></IonInput>
                </IonItem>
                <IonItem color="light" className="input-cadastro">
                    <IonLabel position="floating">Repita a senha</IonLabel>
                    <IonInput type="password" onIonChange={(e:any) => setSenhaConfirmacao(e.target.value)}></IonInput>
                </IonItem>
            </div>
            <div id="loading-login">{(mostrarLoading ? <IonProgressBar type="indeterminate" color="medium"></IonProgressBar> : '')}</div>
            <IonButton onClick={async()=>{await cadastrar()}}>Efetuar cadastro</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Cadastro;
