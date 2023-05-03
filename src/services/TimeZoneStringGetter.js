
const TimeZoneStringGetter =() => {
    
    const timezoneOffset = new Date().getTimezoneOffset();  

    const sign = timezoneOffset < 0 ? '+' : '-';

    const hours = Math.abs(Math.floor(timezoneOffset / 60));
    const minutes = Math.abs(timezoneOffset % 60); 

    let timezoneString = `GMT${sign}${hours}`; 

    if (minutes !== 0) {
        timezoneString += `:${minutes}`;     
    } 

    return { timezoneString };
}

export default TimeZoneStringGetter;