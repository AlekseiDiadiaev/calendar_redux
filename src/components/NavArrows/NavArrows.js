
import './navArrows.scss'
import PrevImg from '../../resources/prev_arrow.png'
import NextImg from '../../resources/next_arrow.png'
import { navBtnsClick, setSelectedDate, setScrollToHour } from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux'

const NavArrows = () => {
    
    const dispatch = useDispatch();
    const numberOfColumns = useSelector(state => state.numberOfColumns);

    const handleClick = (value) => {
        if (value === 0) {
            const todayDate = new Date().setHours(0, 0, 0, 0);
            dispatch(setSelectedDate(todayDate));
        } else {
            dispatch(navBtnsClick(value))
        } 
        dispatch(setScrollToHour(6))     
    }
    return (
        <div className="arrows-nav">
            <button className="arrows-nav__btn arrows-nav__btn__prev" onClick={() => handleClick(-numberOfColumns)}>
                <img src={PrevImg} alt="prev button"/>
            </button>
            <button className="arrows-nav__btn arrows-nav__btn__today" onClick={() => handleClick(0)}>
                Today
            </button>
            <button className="arrows-nav__btn arrows-nav__btn__next" onClick={() => handleClick(numberOfColumns)}>
                <img src={NextImg} alt="next button"/>
            </button> 
        </div>
    )
}

export default NavArrows;

