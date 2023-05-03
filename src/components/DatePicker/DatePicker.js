import './datePicker.scss'
import 'react-day-picker/dist/style.css';

import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { useState, useEffect } from 'react';
import { setSelectedDate, setScrollToHour } from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux';

const DatePicker = () => {
    
    const selectedDate = useSelector(state => state.selectedDate)
    const dispatch = useDispatch();
    const [selectedMonth,setSelectedMonth] = useState()

    useEffect(() => {
        setSelectedMonth(selectedDate)
    },[selectedDate])

    const handleSelectDate = (date) => {
        let parseDate = Date.parse(date)
        dispatch(setScrollToHour(6))  
        dispatch(setSelectedDate(parseDate))
    }
    
    return (
        <DayPicker
        required
        defaultMonth={new Date()}
        onMonthChange={(e) => setSelectedMonth(e)}
        month={selectedMonth}
        mode="single"
        selected={new Date(selectedDate)}
        onSelect = {handleSelectDate}
        />
    );
}

export default DatePicker;