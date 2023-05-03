import './mainArea.scss'
import NavArrows from '../NavArrows/NavArrows';
import SearchBar from '../SearchBar/SearchBar';
import Table from '../Table/Table';
import { toggleSidePanel } from '../../redux/actions'
import { useDispatch} from 'react-redux';

const MainArea = () => {
    const dispatch = useDispatch();
    return (
        <div className="main-area" onClick={() =>  dispatch(toggleSidePanel(false))}>
            <nav className="nav-items">
                <NavArrows/>
                <h1 className="title"> My life plan</h1>
                <SearchBar/>                
            </nav>
            <Table/>
        </div>
    )
}

export default MainArea;