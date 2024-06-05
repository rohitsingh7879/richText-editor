import { useState, useContext, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import { userContext } from './_app';
import axios from 'axios';
import styles from '../styles/Sidebar.module.css';
import NextLink from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

interface ContentItem {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
}

interface SidebarProps {
  // Define any props for the Sidebar component here
}

interface SidebarHandles {
  getContentList: () => void;
}

const Sidebar = forwardRef<SidebarHandles, SidebarProps>((_props, ref) => {
  const { userData } = useContext(userContext);
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const { data: session } = useSession();

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

  const getContentList = () => {
    if (userData) {
      axios.get<ContentItem[]>(`http://localhost:5000/api/content/${userData.email}`)
        .then(res => {
          setContentList(res.data);
        }).catch(err => {
          showToast(err.message);
        });
    }
  };

  useEffect(() => {
    getContentList();
    console.log(userData);
    console.log(contentList);
  }, [session]);

  useImperativeHandle(ref, () => ({
    getContentList,
  }));

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
      <nav className={styles.sidebar}>
        <div className={styles.navbar}>
          <h3 className={styles.title}>RichText Editor</h3>
        </div>
        <ul className={styles.contentList}>
          {
            !userData && contentList.length === 0 ?
              <p className="text-secondary mt-2 mx-2 p-0">Login to see your past Contents</p>
              :
              <p className="text-secondary mt-2 mx-2 p-0">Your Past Contents</p>
          }
          {contentList && contentList
            .sort((a, b) => {
              const updatedDiff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
              if (updatedDiff !== 0) return updatedDiff;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .map((data) => (
              <NextLink key={data._id} href={`/${data._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <li className={styles.contentItem}>
                  {typeof data.title === 'string' ? data.title : 'Untitled'}
                </li>
              </NextLink>
            ))}
        </ul>
      </nav>
    </>
  );
});

export default Sidebar;
