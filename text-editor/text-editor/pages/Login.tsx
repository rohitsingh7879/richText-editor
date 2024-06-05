import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { userContext } from './_app';
import { useContext, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

const Login: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const { userData, setUserdata } = useContext(userContext);

    useEffect(() => {
        if (session?.user) {
            setUserdata(session.user);
            console.log(session.user);
            router.push('/');
        }
    }, [session]);

    if (!session) {
        return (
            <>
                <header className="App-header">Rich Text Editor</header>
                <button 
                    className="btn btn-outline-success m-2" 
                    onClick={() => signIn()} 
                    style={{ height: "5vh", width: "8vw", position: "absolute", top: 0, right: 0 }}
                >
                    LogIn
                </button>
            </>
        );
    } else {
        return (
            <>
                <div className="d-flex justify-content-space-between">
                    <header className="App-header">Hello {session.user.name} Welcome</header>
                    <button 
                        className="btn btn-sm btn-outline-danger m-2" 
                        onClick={() => signOut()} 
                        style={{ height: "5vh", width: "8vw", position: "absolute", top: 0, right: 0 }}
                    >
                        SignOut
                    </button>
                </div>
            </>
        );
    }
};

export default Login;
