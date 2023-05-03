import './eventModal.scss';
import Spinner from '../Spinner/Spinner';

import { toggleEventModal, setCoordinatesEventModal, activeCanvasTrigger } from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import getTimeStringForModal from '../../services/TimeStringForModalGetter';
import  { useEffect, useRef, useState } from 'react';
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";  
import { db } from '../../firebase';
import LineCanvas from '../LineCanvas/LineCanvas';
import { format, formatDuration } from 'date-fns'

const EventModal = ({fetchUserEvents}) => {
    
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
   
    const [listItemInputs, setListItemInputs] = useState([])
    const [eventTasks, setEventTasks] = useState([''])
    const [eventTitle, setEventTitle] = useState('')
    const [eventColor, setEventColor] = useState("red")
    const [eventDuration, setEventDuration] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    
    const dispatch = useDispatch()
    const eventModalDate = useSelector(state => new Date(state.eventModalDate))
    const coordinatesEventModal = useSelector(state => state.coordinatesEventModal);
    const user = useSelector(state => state.user);
    const idSelectedEvent = useSelector(state => state.idSelectedEvent);
    const userEvents = useSelector(state => state.userEvents);
    const didPastCellClick = useSelector(state => state.didPastCellClick);
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
    const getOptionHours = () => {
        let freeNextHours;

        const eventHour = format(eventModalDate, "H");
        const eventDate = format(eventModalDate, "yyyy-MM-dd")
        const nextEvents = userEvents.filter(event => {
            if(event.date.slice(0, 10) === eventDate && 
                +event.hours > +eventHour && 
                +event.hours < +eventHour + 10){
                return true
            } return false;  
        }).sort((a, b) => a.hours - b.hours)
        
        if(nextEvents.length < 1) {
            freeNextHours = 24 - +eventHour;
        } else {
            freeNextHours = +nextEvents[0].hours - +eventHour;
        }   
         
        for (let i = 1; i <= freeNextHours; i++) {
            const hourStr = formatDuration({hours: i}, { format: ['hours']});
            optionsHours.push(   
                 <option key={i} value={i}>{hourStr}</option>
            )
        }
    } 
    getOptionHours();

    const postEvent = async () => {
        setLoading(true)
        setError(false)
        const eventData = {
            date: format(eventModalDate, "yyyy-MM-dd-H"),
            hours: format(eventModalDate, "H"),
            title: eventTitle,
            tasks: eventTasks,
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
        setEventTitle('')
        setEventColor('red')
        setEventDuration('1')
        setEventTasks([''])
        setListItemInputs([])
    }

    const handleDeleteEvent = async() => {
        await deleteDoc(doc(db, `events-${user}`, idSelectedEvent));
        dispatch(toggleEventModal(false));
        fetchUserEvents();
    }


    const handleChangeInputTasks = (e, i) => {
        setEventTasks(oldState => {
            const newState = [...oldState]
            newState[i] = e.target.value
            return newState;  
        }) 
    }

    const handleClose = () => {
       dispatch(toggleEventModal(false))
    }

    useEffect(() => {
        if(eventTasks[eventTasks.length - 1].length > 0 ) {
            if(eventTasks.length > 9) return; 
            setListItemInputs(oldState => {
                const newState = [...oldState]
                newState[eventTasks.length - 1] = (
                    <li className="event-modal__list-item" key={eventTasks.length}>
                        <input 
                        className="event-modal__list-item-input" 
                        type="text" 
                        placeholder="Title of your event..."
                        value={eventTasks[eventTasks.length]}
                        onChange={(e) => handleChangeInputTasks(e, eventTasks.length)}
                        />    
                    </li>
                )
                return newState; 
            }) 
        } else {
            setListItemInputs(oldState => {
                const newState = [...oldState]
                newState.pop()
                return newState; 
            }) 
            if(eventTasks.length > 1){
                setEventTasks(oldState => {
                    const newState = [...oldState]
                    newState.pop()
                    return newState; 
                })
            }                
        }
    },[eventTasks[eventTasks.length - 1], eventTasks.length])
    

    if (idSelectedEvent) {
       const eventData = userEvents.find(event=> event.id === idSelectedEvent);
       if (eventData) {
            const colorClass = `event-modal_${eventData.color}`
        return (  
            <div className='anim-modal'>
                <div className={`event-modal ${colorClass}`} ref={modalNode}>            
                    <div className="event-modal__time">
                        {getTimeStringForModal(eventModalDate).timeString}
                        <span>&nbsp;&nbsp;{getTimeStringForModal(eventModalDate).dateString}</span>
                        <button className="event-modal__close" onClick={handleClose}>
                        </button>       
                    </div>
                    <div className="event-modal__event-title">{eventData.title}</div>
                    <ul className="event-modal__tasks">{eventData.tasks[0].length > 0 && eventData.tasks.map((item,i) => <li key={i}>{item}</li>)}</ul>
                    <button className="btn event-modal__reset" onClick={handleDeleteEvent}>Delete</button>
                    
                </div>
                {coordinatesEventModal && <LineCanvas/>}
            </div>         
         );
       }   
    }

    if (didPastCellClick && !idSelectedEvent) {
        return (
            <div className="anim-modal">
                <div className={`event-modal`} ref={modalNode}> 
                    <div className="event-modal__time">
                        <span>You can't set an event to a past date</span>
                        <button className="event-modal__close" onClick={handleClose}>
                        </button>       
                    </div>
                   
                </div>  
            </div>
        );
    }

    if (!user) {
        return (
            <div className="anim-modal">
                <div className={`event-modal`} ref={modalNode}> 
                    <div className="event-modal__time">
                        <span>Please join to use the application</span>
                        <button className="event-modal__close" onClick={handleClose}>
                        </button>       
                    </div>
                   
                </div>  
            </div>
        );
    }

    return (
        <div className="anim-modal">
            {coordinatesEventModal.x ? <LineCanvas/> : null}
            <div className="event-modal" ref={modalNode}> 
                {loading ? <div className="event-modal__spinner" ><Spinner/></div> :
                <>
                    <div className="event-modal__time">
                        {getTimeStringForModal(eventModalDate).timeString}
                        <span>&nbsp;&nbsp;{getTimeStringForModal(eventModalDate).dateString}</span>
                        <button className="event-modal__close" onClick={handleClose}></button>
                    </div>

                    <div className="event-modal__hours">
                        <div>Chose duration of event      </div>
                        
                        <select className="event-modal__select" onChange={(e) => setEventDuration(e.target.value)}>
                            {optionsHours}
                        </select>
                    </div>

                    <label htmlFor="event-modal__title" className="event-modal__input-text-label">Title</label>
                    <input 
                        className="event-modal__title" 
                        id="event-modal__title"
                        type="text" 
                        placeholder="Title of your event..."
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        >
                    </input>

                    <div className="event-modal__input-text-label">Your tasks</div>
                    <ol type="1" className="event-modal__list">
                        <li className="event-modal__list-item" >
                            <input 
                            className="event-modal__list-item-input" 
                            type="text" 
                            placeholder="Title of your event..."
                            value={eventTasks[0]}
                            onChange={(e) => handleChangeInputTasks(e, 0)}
                             />    
                        </li>
                        {listItemInputs}                   
                    </ol> 
                                           
                    <div className='color-radio'>
                        <input 
                            type="radio" 
                            id="red-radio"
                            name="event-color" 
                            value="red"
                            checked={eventColor === "red"}
                            onChange={(e) => setEventColor(e.target.value)}/>
                        <label htmlFor="red-radio" className="color-radio__red" ></label>
                        <input 
                            type="radio" 
                            id="blue-radio"
                            name="event-color" 
                            value="blue"
                            checked={eventColor === "blue"}
                            onChange={(e) => setEventColor(e.target.value)}/>
                        <label htmlFor="blue-radio" className="color-radio__blue"></label>
                        <input 
                            type="radio" 
                            id="green-radio"
                            name="event-color" 
                            value="green"
                            checked={eventColor === "green"}
                            onChange={(e) => setEventColor(e.target.value)}/>
                        <label htmlFor="green-radio" className="color-radio__green"></label>                  
                        <input 
                            type="radio" 
                            id="purple-radio"
                            name="event-color" 
                            value="purple"
                            checked={eventColor === "purple"}
                            onChange={(e) => setEventColor(e.target.value)}/>
                        <label htmlFor="purple-radio" className="color-radio__purple"></label>                 
                        <input 
                            type="radio" 
                            id="orange-radio"
                            name="event-color" 
                            value="orange"
                            checked={eventColor === "orange"}
                            onChange={(e) => setEventColor(e.target.value)}/>
                        <label htmlFor="orange-radio" className="color-radio__orange"></label>
                    </div>
                    <button className="btn event-modal__create" onClick={postEvent}>Create event</button>
                    <button className="btn event-modal__reset"  onClick={handleReset}>Reset</button>
                </>
                }
                {error && <div> Поризошла ошибка</div>}
            </div>
        </div>
    )
}

export default EventModal;