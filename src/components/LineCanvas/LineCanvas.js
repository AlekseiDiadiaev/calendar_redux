
import './lineCanvas.scss';
import { useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';

const LineCanvas = () => {
    const { x: modalX, y: modalY} = useSelector(state => state.coordinatesEventModal);
    const { x: cellX, y: cellY} = useSelector(state => state.coordinatesСhosenCell);

    const canvasTrigger = useSelector(state => state.canvasTrigger) 
    const idSelectedEvent = useSelector(state => state.idSelectedEvent) 
    const userEvents = useSelector(state => state.userEvents) 
    const canvasRef = useRef(null);


    useEffect(() => {
        const canvas = canvasRef.current
        if(canvas) {
        
        let lineColor ;
        const eventData = userEvents.find(event=> event.id === idSelectedEvent);
        const eventColor = eventData ? eventData.color : '';
        switch (eventColor) {
            case 'blue':
                lineColor = '#0EA5E9';
                break;
            case 'red':
                lineColor = '#F43F5E';
                break;
            case 'green':
                lineColor = '#10B981';
                break;
            case 'purple':
                lineColor = '#8B5CF6';
                break; 
            case 'orange':
                lineColor = '#F59E0B';
                break;
            default: 
                lineColor = '#71717A';
                break;         
        }

        const context = canvas.getContext('2d');
    
        const bodyNode = document.querySelector('.table__wrapper-body');
        const rect = bodyNode.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        context.strokeStyle = lineColor;
        context.lineWidth = 1;

        const startX = idSelectedEvent ? cellX - 69: cellX;
        const startY = cellY;
        const endX = modalX;
        const endY = modalY;
        
        context.beginPath();
        context.arc(startX, startY, 5, 0, 2 * Math.PI);
        context.fillStyle = lineColor;
        context.fill();


        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
    }
    },[canvasTrigger])

    return (
        <canvas ref={canvasRef} id="line-canvas"></canvas>  
    )
}

export default LineCanvas;


