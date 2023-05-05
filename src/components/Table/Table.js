import './table.scss'
import CellBody from '../Cells/CellBody/CellBody';
import CellHeader from '../Cells/CellHeader/CellHeader';
import CellSide from '../Cells/CellSide/CellSide';
import Event from '../Event/Event';
import EventModal from '../EventModal/EventModal';
import TimeZoneStringGetter from '../../services/TimeZoneStringGetter';
import hoursOfDays from '../../services/ArrayHoursOfDay';
import getDaysToHeaderOfTable from '../../services/DaysToHeaderOfTable'
import { activeCanvasTrigger, toggleEventModal, setUserEvents, setNumberOfColumns } from '../../redux/actions'
import { useEffect, useState, useRef } from 'react'; 
import { useSelector, useDispatch  } from 'react-redux';
import { db } from '../../firebase';
import { collection, getDocs } from "firebase/firestore"; 
import { format, startOfHour, parse } from 'date-fns';
import { CSSTransition } from 'react-transition-group';

const Table = () => {
    const [timezoneString, setTimezoneString] = useState();
    const [smallHeight, setSmallHeight] = useState(false);
    const [resizeTrigger, setResizeTrigger] = useState(true)
    const [timeNow, setTimeNow] = useState(format(startOfHour(new Date()).getTime(), "yyyy-MM-dd-H"))
    const bodyRef = useRef();

    const selectedDate = useSelector(state => state.selectedDate);
    const eventModalShowed = useSelector(state => state.eventModalShowed);
    const user = useSelector(state => state.user);
    const userEvents = useSelector(state => state.userEvents);
    const scrollToHour = useSelector(state => state.scrollToHour);
    const numberOfColumns = useSelector(state => state.numberOfColumns);
    const dispatch = useDispatch();

    useEffect(() => {
        const setTime = setInterval(() => {
            setTimeNow(format(startOfHour(new Date()).getTime(), "yyyy-MM-dd-H"))
        },60000)
        return () => {
            clearInterval(setTime)
        }
    },[])

    useEffect(() => {
        if (!user) {
            dispatch(setUserEvents([]));
        } else {
            fetchUserEvents();
        }  
    },[user])
    
    useEffect(() => { 
        if(window.innerWidth > 1400){
            dispatch(setNumberOfColumns(7))
        }
        if(window.innerWidth <= 1400 && window.innerWidth > 1140){
            dispatch(setNumberOfColumns(5))
        }
        if(window.innerWidth <= 1140){
            dispatch(setNumberOfColumns(3))
        }
        if(window.innerHeight <= 400){
            if (!smallHeight) dispatch(toggleEventModal(false));
            setSmallHeight(true)   
        } 
        if(window.innerHeight >= 400){
            if (smallHeight) dispatch(toggleEventModal(false));
            setSmallHeight(false)
        } 

        const handleResize = () => {
            setResizeTrigger(resizeTrigger => !resizeTrigger)
        }
        window.addEventListener('resize', handleResize);  
        return () => window.removeEventListener('resize', handleResize); 
    }, [resizeTrigger]);

    const fetchUserEvents = async() => {
        const querySnapshot = await getDocs(collection(db, `events-${user}`)); 
        const result = []
        querySnapshot.forEach((doc) => {
            const res = doc.data()
            res.id = doc.id
            result.push(res);
           
        });
        dispatch(setUserEvents(result))
    }


    useEffect(() => {
        const { timezoneString } = TimeZoneStringGetter();
        setTimezoneString(timezoneString) 
    },[])

    useEffect(() => {
        if (!selectedDate) return;
        const container = document.querySelector('.table__body')
        const anchor = 64 * scrollToHour
        container.scrollTo({
            top: anchor,
            behavior: 'smooth'
          });
    },[selectedDate, scrollToHour])
    

    const handleCanvasTrigger = (e) => {
        if(eventModalShowed) {
            dispatch(activeCanvasTrigger())
        }    
    } 
    
    const headerCells = (function (numColumn) {  
            const textCells = getDaysToHeaderOfTable(selectedDate, numColumn);
            const res = [];

            res.push(<CellSide key='0'/>);

            for (let i = 0; i < numColumn; i++){
                res.push(<CellHeader 
                    key={i + 1} 
                    nameDay={textCells[i]['nameDay']}
                    numDay={textCells[i]['numDay']}
                    nameMonth={textCells[i]['nameMonth']}
                    />)
            } 

            res.push(<CellSide key='8'>{timezoneString}</CellSide>);
            return res;
        })(numberOfColumns);

    const bodyCells = (function () {
            if(!selectedDate) return;

            const res = [];

            for (let i = 0; i < 24; i++){
                res.push(<CellSide key={i + '0'}>
                        {hoursOfDays[i]}
                    </CellSide>);

                for (let j = 0; j < numberOfColumns; j++){
                    const CellId = format((selectedDate + j * 86400000) + parseInt(i) * 60 * 60 * 1000, "yyyy-MM-dd-H");
                    let isEvent ;
                    const eventProps = {}
                    for (let event of userEvents) {
                        if(event.date === CellId) {
                            isEvent = true;
                            eventProps.color = event.color;
                            eventProps.title = event.title;
                            eventProps.date = event.date;
                            eventProps.duration = event.duration;
                            eventProps.hours = event.hours;
                            eventProps.id = event.id;
                            eventProps.tasks = event.tasks;
                            break;
                        };
                    }
                    const pastCell = parse(CellId, "yyyy-MM-dd-H", new Date()) < parse(timeNow, "yyyy-MM-dd-H", new Date())
                    res.push(<CellBody 
                                key={i + '' + (j + 1)}
                                id={CellId}
                                hour={i}
                                dateStamp={selectedDate + j * 86400000}
                                pastCell={pastCell}
                                cellNow={CellId === timeNow}
                                bodyRef={bodyRef}
                                >   

                       {isEvent  ? <Event {...eventProps}/> : null}

                    </CellBody>)
                } 
                res.push(<CellSide key={i + '8'}>{hoursOfDays[i]}</CellSide>);
            }

            return res;
        })(numberOfColumns);
        const eventModal = <CSSTransition
                                in={eventModalShowed}
                                timeout={300}
                                classNames="anim-modal"
                                unmountOnExit                             
                            >
                                <EventModal fetchUserEvents={fetchUserEvents} smallHeight={smallHeight}/>
                            </CSSTransition>;  
    return (
        <div className="table">
              {smallHeight && eventModal}
            <div className="table__header">             
                {headerCells}     
            </div>
            <div className="table__wrapper-body">
                {!smallHeight && eventModal}
                <div ref={bodyRef} className="table__body" onScroll={handleCanvasTrigger}>
                    {bodyCells}
                            
                </div>
            </div>
        </div>
    )
}

export default Table;