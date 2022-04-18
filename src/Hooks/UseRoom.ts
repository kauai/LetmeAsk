import { useState,useEffect } from 'react'
import { database } from '../services/Firebase';

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

export function useRoom(roomId: string) {
    const [ questions, setQuestions ] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('');

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

    return { questions, title }
}