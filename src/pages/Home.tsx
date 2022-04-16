import { useNavigate } from 'react-router-dom'
import illusttrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIcon from '../assets/images/google-icon.svg'
import { Button } from '../components/Button';
import { useAuth } from '../Hooks/UseAuth';
import '../styles/auth.scss';

export function Home() {
    let navigate = useNavigate();
    const { user, signingWithGoogle } = useAuth();

    async function handleCreateRoom() {
        if(!user) {
            await signingWithGoogle();
        }
        navigate("/room/new");
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illusttrationImg} alt="Illustration" />
                <strong>Cria salas de QA</strong>
                <p>Tire as duvidas da sua audiencia em tempo real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="letmeask" />
                    <button onClick={handleCreateRoom} className='create-room'>
                    <img src={googleIcon} alt="Logo do google" />
                        Crie sua sala como Google
                    </button>
                    <div className="separator">Ou entre em uma sala</div>

                    <form>
                        <input 
                            type="text"
                            placeholder="Digite o codigo da sala" 
                        />
                        <Button type="submit">Digite o codigo</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}