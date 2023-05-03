import './event.scss';
import Ico from '../../resources/event_icon.svg';
import getTimeStringForModal from '../../services/TimeStringForModalGetter';

const Event = ({color, duration, date, hours, id, tasks, title}) => {
    let bgcolor;
    let textcolor;
    let bordercolor;

    switch (color) {
        case 'blue':
            bgcolor = 'rgba(14, 165, 233, 0.1)';
            textcolor = '#0369A1';
            bordercolor = '#0EA5E9';
            break;
        case 'red':
            bgcolor = 'rgba(255, 228, 230, 0.1)';
            textcolor = '#BE123C';
            bordercolor = '#F43F5E';
            break;
        case 'green':
            bgcolor = 'rgba(16, 185, 129, 0.1)';
            textcolor = '#047857';
            bordercolor = '#10B981';
            break;
        case 'purple':
            bgcolor = 'rgba(139, 92, 246, 0.1)';
            textcolor = '#6D28D9';
            bordercolor = '#8B5CF6';
            break; 
        case 'orange':
            bgcolor = 'rgba(245, 158, 11, 0.1)';
            textcolor = '#B45309';
            bordercolor = '#F59E0B';
            break;
        default: 
            bgcolor = 'rgba(14, 165, 233, 0.1)';
            textcolor = '#0369A1';
            bordercolor = '#0EA5E9';
            break;         
    }

    const tasksList = tasks[0].length > 0 ? tasks.map((item,i) => {
        return <li key={i}>{item}</li>
    }) : null;
    
    const dateStamp = new Date(date.slice(0,10)).setHours(0, 0, 0, 0) + +hours * 60 * 60 * 1000;

    return (
        <div 
        className="event" 
        style={{height: `${duration*100}%`, borderLeft: `4px solid ${bordercolor}`, background: `${bgcolor}`}} 
        id={id}
        >
        <div className="event__time" style={{color: `${textcolor}`}} >
            <span>{getTimeStringForModal(dateStamp).timeString}</span>
            
            <div className="event__ico" style={{background: `${textcolor}`}}>
                <img src={Ico} alt="event icon" />
            </div>                 
        </div>
        
        <div className="event__descr" style={{color: `${textcolor}`}}>
            <h3 className="event__title">{title}</h3>
            {duration > 1 && <ul className="event__list">
                {tasksList}
            </ul>}         
        </div>   
    </div>      
    )
}

export default Event;