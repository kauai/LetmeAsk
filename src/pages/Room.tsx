import { useState,FormEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../services/Firebase';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../Hooks/UseAuth';
import '../styles/room.scss'
import { Question } from '../components/Question';

type FirebaseQuestions = Record<string, {
    author: {
      name: string;
      avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }>

type QuestionType = {
    id: string;
    author: {
      name: string;
      avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }

type RoomParams = {
    id: string;
}
  

export function Room() {
    const { user } = useAuth();
    console.log('USER',user)
    const params = useParams<RoomParams>()
    const [ newQuestion, setNewQuestion ] = useState('')
    const [ questions, setQuestions ] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('');
    
    const roomId = params.id;

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)
        // roomRef.once('value', room => {
        roomRef.on('value', room => {
            const databaseRoom = room.val()
            const firebaseQuestion:FirebaseQuestions = databaseRoom.questions ?? {};
            // const firebaseQuestion = databaseRoom.questions as FirebaseQuestions;
            
            const parsedQuestions = Object.entries(firebaseQuestion)
            .map(([ key, value ]) => {
                return { 
                    id:key, 
                    content:value.content, 
                    author:value.author, 
                    isHighlighted:value.isHighlighted, 
                    isAnswered:value.isAnswered,
                }
            });
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })
    },[roomId])

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
                        </div>
                </div>
            </header>

           <main className="content">
               <div className="room-title">
                   <h1>Sala {title}</h1>
                   {!!questions.length && <span>{questions.length} perguntas</span>}
               </div>

               <form onSubmit={handleSendQuestion}>
                    <textarea
                      onChange={e => setNewQuestion(e.target.value)}
                      value={ newQuestion }
                      placeholder="O que voce quer perguntar"
                    />
                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        ) }
                        <Button disabled={!user} type="submit">Enviar pergunta</Button>
                    </div>
               </form>

               <div className="question-list">
                { questions.map((item) => <Question key={item.id}  {...item}/>)}
               </div>
           </main>
       </div>
    )
}