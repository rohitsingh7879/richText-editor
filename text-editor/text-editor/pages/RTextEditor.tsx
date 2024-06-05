import React, { useState, useRef, useMemo, useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { userContext } from './_app';
import axios from 'axios';
import Sidebar from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import Login from './Login';
import { AxiosResponse } from 'axios';

// Dynamically import JoditEditor with ssr: false
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface ExampleProps {
    placeholder?: string;
}

interface UserContextType {
    userData: { email: string } | null;
    setUserdata: (userData: { email: string } | null) => void;
}

const Example: React.FC<ExampleProps> = ({ placeholder }) => {
    const childRef = useRef<{ getContentList: () => void }>(null);
    const editor = useRef<any>(null);
    const [content, setContent] = useState<string>('');

    const config = useMemo(
        () => ({
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            placeholder: placeholder || 'Start typing...',
        }),
        [placeholder]
    );

    const { userData, setUserdata } = useContext<UserContextType>(userContext);
    const [title, setTitle] = useState<string>('');
    const [userEmail, setEmail] = useState<string>('rohit@email.com');

    useEffect(() => {
        if (userData) {
            setEmail(userData.email);
        }
        console.log(userData);
    }, [userData]);

    const showToast = (message: string) => {
        toast(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };

    const postContent = async () => {
        if (title && content && userEmail) {
            console.log(title, content, userEmail);
            try {
                const res: AxiosResponse = await axios.post("http://localhost:5000/api/content", { title, content, userEmail });
                if (res.statusText === "OK") {
                    showToast("Post Created Successfully");
                    if (childRef.current) {
                        childRef.current.getContentList();
                    }
                    setContent('');
                    setTitle('');
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const resetContent = () => {
        setContent('');
        setTitle('');
    };

    return (
        <>
            <ToastContainer
                className="mt-5"
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div>
                <header className="App-header">
                    <Login />
                </header>
                <div className="d-flex">
                    <Sidebar ref={childRef} />
                    <div className="container mt-5" style={{ border: '2px solid white', backgroundColor: 'white', boxShadow: '5px 5px 5px #aaaaaa' }}>
                        <h3>What going in your mind ?</h3>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Post Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="write your"
                                onChange={(e) => {
                                    userData ? setTitle(e.target.value) : showToast("Please Login First");
                                }}
                                value={title}
                            />
                        </div>
                        <p>Post Content</p>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={config}
                            tabIndex={5} // tabIndex of textarea
                            onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => setContent(newContent)}
                            height={400}
                        />
                        <div className="d-flex justify-content-center m-3">
                            <button className="btn btn-primary mx-3" onClick={postContent} disabled={!userData}>
                                Create Content
                            </button>
                            <button className="btn btn-danger mx-3" onClick={resetContent}>
                                Reset Content
                            </button>
                        </div>
                        <div>
                            <h4>Your Content will be stored in HTML format</h4>
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Example;
