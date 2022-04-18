import { useState,useEffect } from 'react'
import { database } from '../services/Firebase';
import { useAuth } from './UseAuth';

type FirebaseQuestions = Record<string, {
    author: {
      name: string;
      avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes:Record<string,{
      authorId: string
    }>
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
    likeCount:number;
    likeId:string | undefined;
  }

export function useRoom(roomId: string) {
    const { user } = useAuth();
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
                    likeCount:Object.values(value.likes ?? {}).length,
                    likeId:Object.entries(value.likes ?? {})
                    .find(([key,like]) => like.authorId === user?.id)?.[0]
                    // hasLiked:Object.values(value.likes ?? {})
                    // .some(like => like.authorId === user?.id)
                }
            });
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

        return () => {
          roomRef.off('value')
        }
    },[roomId,user?.id])

    return { questions, title }
}