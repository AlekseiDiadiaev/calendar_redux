import './cellBody.scss';
import { toggleEventModal, 
            setEventModalDate, 
            setCoordinatesСhosenCell, 
            setIdСhosenCell, 
            activeCanvasTrigger, 
            setSelectedEvent, 
            togglePastCell } from '../../../redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';


const CellBody = ({children, hour, dateStamp, id, bodyRef, cellNow, pastCell}) => {

    const dispatch = useDispatch()
    const cellRef = useRef(null);
    
    const canvasTrigger = useSelector(state => state.canvasTrigger) 
    const idСhosenCell = useSelector(state => state.idСhosenCell) 
    const eventModalShowed = useSelector(state => state.eventModalShowed);

    useEffect(() => {
        if (cellRef.current.id !== idСhosenCell) return; 

        const rect = cellRef.current.getBoundingClientRect();
        const centerX = cellRef.current.offsetLeft  + rect.width / 2 - bodyRef.current.scrollLeft;
        const centerY = cellRef.current.offsetTop + rect.height / 2 - bodyRef.current.scrollTop;

        dispatch(setCoordinatesСhosenCell({x: centerX, y: centerY}))
    },[canvasTrigger])  
    
    const handleClick = async (e) => {
        if (eventModalShowed) {
            dispatch(toggleEventModal(false))
                let isEvent = false;
                let eventId; 
                if(e.currentTarget.firstElementChild) {
                    eventId = e.currentTarget.firstElementChild.id;
                    isEvent = true;
                }  
                const resultDate = dateStamp + parseInt(hour) * 60 * 60 * 1000;  
                const rect = cellRef.current.getBoundingClientRect();
                const centerX = cellRef.current.offsetLeft  + rect.width  / 2 - bodyRef.current.scrollLeft;
                const centerY = cellRef.current.offsetTop + rect.height / 2 - bodyRef.current.scrollTop;
            setTimeout(() => {
                dispatch(togglePastCell(pastCell))
                if(isEvent) {
                    dispatch(setSelectedEvent(eventId))
                } else {
                    dispatch(setSelectedEvent(null))
                } 
                dispatch(activeCanvasTrigger())
                dispatch(setEventModalDate(resultDate))
                dispatch(setCoordinatesСhosenCell({x: centerX, y: centerY}))
                dispatch(setIdСhosenCell(cellRef.current.id))
                dispatch(toggleEventModal(true))
            },300)
        } else {
            openModal();
        }
        function openModal() {
            dispatch(togglePastCell(pastCell))
            if(e.currentTarget.firstElementChild) {
            const eventId = e.currentTarget.firstElementChild.id;     
            dispatch(setSelectedEvent(eventId))
            } else {
                dispatch(setSelectedEvent(null))
            }

            dispatch(activeCanvasTrigger())
            const resultDate = dateStamp + parseInt(hour) * 60 * 60 * 1000;

            dispatch(setEventModalDate(resultDate))
            dispatch(toggleEventModal(true))

            const rect = cellRef.current.getBoundingClientRect();
            const centerX = cellRef.current.offsetLeft  + rect.width  / 2 - bodyRef.current.scrollLeft;
            const centerY = cellRef.current.offsetTop + rect.height / 2 - bodyRef.current.scrollTop;

            dispatch(setCoordinatesСhosenCell({x: centerX, y: centerY}))
            dispatch(setIdСhosenCell(cellRef.current.id))
        }  
    }
    return (
        <div ref={cellRef} 
            className={`cell-body ${cellNow ? 'cell-body_now' : ''} ${pastCell ? 'cell-body_past' : ''}` } 
            onClick={e => handleClick(e)} 
            id={id}>
            {children}                                   
        </div>
    )
}

export default CellBody;
