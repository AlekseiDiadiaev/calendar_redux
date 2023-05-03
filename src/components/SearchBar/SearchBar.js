
import './searchBar.scss'
import Img from '../../resources/search-ico.svg'
import { useState, useEffect } from "react";
import { useSelector, useDispatch  } from 'react-redux';
import Fuse from 'fuse.js'
import { setSelectedDate, setScrollToHour } from '../../redux/actions'

const SearchBar = () => {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState('')
    const [foundEvents, setFoundEvents ] = useState([]);
    const userEvents = useSelector(state => state.userEvents);

    useEffect(() => {
        const options = {
            includeScore: true,
            keys: ['title', 'tasks']
          } 
        const fuse = new Fuse(userEvents, options)
        setFoundEvents(fuse.search(searchValue))
    },[searchValue])
    
    const handleClickFoundEvent = (date, hour) => {
        dispatch(setScrollToHour(+hour))  
        const dayOfFoundEvent = new Date(date.slice(0,10)).setHours(0, 0, 0, 0);
        dispatch(setSelectedDate(dayOfFoundEvent))
    }

    const foundList = foundEvents.map((item, i) => {  
        return (<li 
                    key={i} 
                    onClick={() => handleClickFoundEvent(item.item.date, item.item.hours)}>
                    <span>{item.item.date}</span>
                    <br/>{item.item.title}
                </li>)
    })
    

    return (
        <>
            <div className="search-bar">
                <input 
                type="search" 
                className="search-bar__input" 
                placeholder="Search..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}/>
                <img  src={Img} alt="search icon"/>
                <ul className="search-bar__found-list">
                    {foundList}
                </ul>
            </div>   
        </>
    )
}

export default SearchBar;


