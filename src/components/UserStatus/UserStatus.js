import './userStatus.scss'
import { toggleJoinModalShowed, toggleLoginModalShowed, userFetched, userFetching, toggleEventModal, toggleSidePanel } from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '../../firebase';
import { collection, getDocs } from "firebase/firestore"; 
import { useState } from 'react'
import Spinner from '../Spinner/Spinner';

const UserStatus = () => {
    const [userName, setUserName] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user)
    const loadingUser = useSelector(state => state.loadingUser)

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {            
            dispatch(userFetched(user.uid))
        } else {
            dispatch(userFetched(null))
        }
    });

    const handleLogout = () => {
        setIsDisabled(true)
        dispatch(userFetching(true)) 
        dispatch(toggleEventModal(false))
        setTimeout(() =>{
            auth.signOut()
                .then(() => {
                    setIsDisabled(false)
                    dispatch(userFetched(null))
                }).catch((error) => {
                    console.error(error)
                });   
        },1000)
    }
    
    async function getUser() {
        if (!user || loadingUser) return;
        
        const users = await getDocs(collection(db, 'users'));
        users.forEach(item => {
            if (item.data().uid === user) {
                setUserName(item.data().name)
            }
        })    
    }
    getUser();

    const handleLogin = () => {
        dispatch(toggleLoginModalShowed())
        dispatch(toggleSidePanel(false))
    }

    const handleJoin = () => {
        dispatch(toggleJoinModalShowed())  
        dispatch(toggleSidePanel(false))
    }

    const btnsAuthNone = !user && !loadingUser ? <>
                            <button className="user-status__btn btn" onClick={handleLogin}>Log in</button>
                            <button className="user-status__btn btn" onClick={handleJoin}>Join</button>
                          </> : null;
    const btnsAuthDone = user && !loadingUser ? <> 
                                <div className='user-status__name'>{userName}</div>
                                <div></div>
                                <button className="user-status__btn btn" 
                                        onClick={handleLogout}
                                        disabled={isDisabled}>Log out</button>
                            </>: null;
    const spinner = loadingUser && <Spinner/>                       

    return (
        <>
            <div className="user-status">
                <div className="user-status__ico" style={{backgroundColor: `${user ? '#0369A1' : '#BE123C'}`}}></div>
                {btnsAuthNone}
                {btnsAuthDone}
                {spinner}
            </div>   
        </>     
    )
}

export default UserStatus;