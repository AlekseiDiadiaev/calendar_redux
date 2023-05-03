import './app.scss';


import MainArea from "../MainArea/MainArea";
import SidePanel from "../SidePanel/SidePanel";
import JoinModal from "../JoinModal/JoinModal";
import LoginModal from "../LoginModal/LoginModal";

import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

function App() { 
    const joinModalShowed = useSelector(state => state.joinModalShowed)   
    const loginModalShowed = useSelector(state => state.loginModalShowed)  
    return (   
        <>  
            <CSSTransition
                    in={joinModalShowed}
                    timeout={300}
                    classNames="anim-join-modal"
                    unmountOnExit
                >
                    <JoinModal/>
            </CSSTransition>
            <CSSTransition
                    in={loginModalShowed}
                    timeout={300}
                    classNames="anim-login-modal"
                    unmountOnExit
                >
                    <LoginModal/>
            </CSSTransition>
            <div className="container">
                <div className="wrapper">
                    <SidePanel/>
                    <MainArea/>
                </div>
            </div>
        </>
       
    )
}

export default App;
