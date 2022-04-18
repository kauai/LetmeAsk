import { useState,FormEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../services/Firebase';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../Hooks/UseAuth';
import '../styles/room.scss'
import { Question } from '../components/Question';
import { useRoom } from '../Hooks/UseRoom';


type RoomParams = {
    id: string;
}
  

export function AdminRoom() {
    const { user } = useAuth();
    console.log('USER',user)
    const params = useParams<RoomParams>()
    const [ newQuestion, setNewQuestion ] = useState('')
    const roomId = params.id;

    const { title, questions } = useRoom(`${roomId}`);

    async function handleSendQuestion(e:FormEvent) {
        e.preventDefault();

        if(newQuestion.trim() === '') {
            return;
        }

        if(!user) {
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
              name: user.name,
              avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false
          };

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');
    }

    return (
       <div id="page-room">
           <header>
                <div className="content">
                        <img src={logoImg} alt="logo app"/>
                        <div>
                            <RoomCode code={`${roomId}`}/>
                            <Button isOutlined>Encerrar sala</Button>
                        </div>
                </div>
            </header>

           <main className="content">
               <div className="room-title">
                   <h1>Sala {title}</h1>
                   {!!questions.length && <span>{questions.length} perguntas</span>}
               </div>

               <div className="question-list">
                { questions.map((item) => <Question key={item.id}  {...item}/>)}
               </div>
           </main>
       </div>
    )
}