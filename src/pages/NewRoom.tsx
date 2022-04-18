import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { useAuth } from '../Hooks/UseAuth';
import { database } from '../services/Firebase';

import '../styles/auth.scss';

export function NewRoom() {

  const { user } = useAuth();
  const [ newRoom ,setNewRoom ] = useState('')

  let navigate = useNavigate();

  async function handleCreateRoom(e :FormEvent) {
    e.preventDefault();

    if(newRoom.trim() === '') { 
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    navigate("/room/"+firebaseRoom.key);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              onChange={e => setNewRoom(e.target.value)}
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}