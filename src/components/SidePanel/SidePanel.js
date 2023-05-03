import './sidePanel.scss'
import UserStatus from '../UserStatus/UserStatus';
import DatePicker from '../DatePicker/DatePicker'
import { toggleSidePanel } from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux';

const SidePanel = () => { 
    const dispatch = useDispatch();
    const sidePanelShown = useSelector(state => state.sidePanelShown)

    return (
        <div className={`side-panel ${sidePanelShown ? 'side-panel_active': null}`}>
            <button 
                className="side-panel__side-btn" 
                onClick={() => dispatch(toggleSidePanel(!sidePanelShown))}>
                   
                   {sidePanelShown  ? '\u2039' :  '\u203A'}
            </button>
            <UserStatus/>
            <DatePicker/>
        </div>
    )
}

export default SidePanel;