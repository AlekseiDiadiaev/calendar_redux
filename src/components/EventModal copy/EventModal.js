import './eventModal.scss';
import Spinner from '../Spinner/Spinner';

import { toggleEventModal, setCoordinatesEventModal, activeCanvasTrigger } from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import getTimeStringForModal from '../../services/TimeStringForModalGetter';
import  { useEffect, useRef, useState } from 'react';
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../../firebase';
import LineCanvas from '../LineCanvas/LineCanvas';
import { format } from 'date-fns'

const EventModal = ({fetchUserEvents}) => {
    
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [eventText, setEventText] = useState('')
    const [eventColor, setEventColor] = useState("red")
    const [eventDuration, setEventDuration] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    
    const dispatch = useDispatch()
    const eventModalDate = useSelector(state => new Date(state.eventModalDate))
    const coordinatesEventModal = useSelector(state => state.coordinatesEventModal);
    const user = useSelector(state => state.user);
    const modalNode = useRef()

    useEffect(()=> {
        dispatch(activeCanvasTrigger())
        const centerX = modalNode.current.offsetLeft;
        const centerY = modalNode.current.offsetTop;
        dispatch(setCoordinatesEventModal({x: centerX, y: centerY}))
    },[windowSize.height, windowSize.width])

    useEffect(() => {
        function handleResize() {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }   
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [windowSize]);

    const optionsHours = [];   
    for (let i = 1; i < 11; i++) {
        optionsHours.push(
            <option key={i} value={i}>{i}</option>
        )
    }


    const postEvent = async () => {
        setLoading(true)
        setError(false)
        const eventData = {
            date: format(eventModalDate, "yyyy-MM-dd-H"),
            hours: format(eventModalDate, "h' 'a"),
            text: eventText,
            color: eventColor,
            duration: eventDuration
        }
        try {
            await addDoc(collection(db, `events-${user}`), eventData);
            setLoading(false)    
            dispatch(toggleEventModal(false));
            fetchUserEvents();
        } catch (e) {
            setLoading(false)
            setError(true)
            fetchUserEvents();
            console.error("Error adding document: ", e);
        }      
    }

    const handleReset = () => {
        setEventText('')
        setEventColor('red')
        setEventDuration('1')
    }

    return (
        <>
            {coordinatesEventModal.x ? <LineCanvas/> : null}
            <div className="event-modal" ref={modalNode}> 
                {loading ? <Spinner/> :
                <>
                    <div className="event-modal__time">
                        {getTimeStringForModal(eventModalDate).timeString}
                        <span>&nbsp;&nbsp;{getTimeStringForModal(eventModalDate).dateString}</span>
                        <button className="event-modal__close" onClick={() => dispatch(toggleEventModal(false))}></button>
                    </div>

                    <div className="event-modal__hours">
                        <div>Chose duration of event      </div>
                        <select className="event-modal__select" onChange={(e) => setEventDuration(e.target.value)}>
                            {optionsHours}
                        </select>
                    </div>

                    <input 
                        className="event-modal__textarea" 
                        type="text" 
                        placeholder="Write discription of your event..."
                        value={eventText}
                        onChange={(e) => setEventText(e.target.value)}
                        >
                    </input>
                            
                    <div className='color-radio'>
                        <input 
                            type="radio" 
                            id="red-radio"
                            name="event-color" 
                            value="red"
                            checked={eventColor === "red"}
                            onChange={(e) => setEventColor(e.target.value)}/>
                        <label htmlFor="red-radio" className="color-radio__red" >Red</label>
                        <input 
                            type="radio" 
                            id="blue-radio"
                            name="event-color" 
                            value="blue"
                            checked={eventColor === "blue"}
                            onChange={(e) => setEventColor(e.target.value)}/>
                        <label htmlFor="blue-radio" className="color-radio__blue">Blue</label>
                        <input 
                            type="radio" 
                            id="green-radio"
                            name="event-color" 
                            value="green"
                            checked={eventColor === "green"}
                            onChange={(e) => setEventColor(e.target.value)}/>
                        <label htmlFor="green-radio" className="color-radio__green">Green</label>                  
                        <input 
                            type="radio" 
                            id="purple-radio"
                            name="event-color" 
                            value="purple"
                            checked={eventColor === "purple"}
                            onChange={(e) => setEventColor(e.target.value)}/>
                        <label htmlFor="purple-radio" className="color-radio__purple">Purple</label>                 
                        <input 
                            type="radio" 
                            id="orange-radio"
                            name="event-color" 
                            value="orange"
                            checked={eventColor === "orange"}
                            onChange={(e) => setEventColor(e.target.value)}/>
                        <label htmlFor="orange-radio" className="color-radio__orange">Orange</label>
                    </div>

                    <button className="btn event-modal__create" onClick={postEvent}>Create event</button>
                    <button className="btn event-modal__reset"  onClick={handleReset}>Reset</button>
                </>
                }
                {error && <div> Поризошла ошибка</div>}
            </div>
        </>
    )
}

export default EventModal;