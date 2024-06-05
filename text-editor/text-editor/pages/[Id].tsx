import React, { useState, useRef, useMemo, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Sidebar from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    placeholder?: string;
}

// Dynamically import JoditEditor with ssr: false
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const Id: React.FC<Props> = ({ placeholder }) => {
    const router = useRouter();
    const { Id: serviceId } = router.query;

    const editor = useRef<any>(null);
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');

    const config = useMemo(
        () => ({
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            placeholder: content ? content : 'Start typing...'
        }),
        [content]
    );

    // get details of particular content
    const getContentData = () => {
        if (serviceId) {
            axios.get(`http://localhost:5000/api/content-by-id/${serviceId}`)
                .then(res => {
                    setContent(res.data.content);
                    setTitle(res.data.title);
                }).catch(err => {
                    console.log(err);
                });
        }
    };

    useEffect(() => {
        getContentData();
    }, [serviceId]);

    const resetContent = () => {
        setContent('');
        setTitle('');
    };

    const showToast = (message: string) => {
        toast(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleUpdateContent = () => {
        if (serviceId) {
            axios.put(`http://localhost:5000/api/content/${serviceId}`, { title, content })
                .then(res => {
                    if (res.statusText === "OK") {
                        showToast("Content Updated");
                        setTimeout(() => {
                            router.push("/RTextEditor");
                        }, 2000);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    const deleteContent = () => {
        axios.delete(`http://localhost:5000/api/content/${serviceId}`)
            .then(res => {
                if (res.statusText === "OK") {
                    showToast("Content Deleted");
                    setTimeout(() => {
                        router.push('/RTextEditor');
                    }, 2000);
                }
            })
            .catch(err => {
                showToast(err.message);
            });
    };

    if (serviceId) {
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
                        Update Your Content With Rich Text Editor
                    </header>
                    <div className="d-flex">
                        <div className="container mt-5" style={{ border: "2px solid white", backgroundColor: "white", boxShadow: "5px 5px 5px #aaaaaa" }}>
                            <h3>What is going in your mind to update this content?</h3>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Update Title</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="exampleFormControlInput1" 
                                    placeholder="write your title"
                                    onChange={(e) => setTitle(e.target.value)} 
                                    value={title || ''} 
                                />
                            </div>

                            <p>Update Content</p>

                            <JoditEditor
                                ref={editor}
                                value={content}
                                config={config}
                                tabIndex={5} // tabIndex of textarea
                                onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                onChange={newContent => setContent(newContent)}
                                height={400}
                            />
                            <div className='d-flex justify-content-center m-3'>
                                <button className="btn btn-primary mx-3" onClick={handleUpdateContent}>Update Content</button>
                                <button className="btn btn-danger mx-3" onClick={deleteContent}>Delete Content</button>
                                <button className="btn btn-warning mx-3" onClick={resetContent}>Reset Content</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return null;
};

export default Id;
