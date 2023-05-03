
const getTimeStringForModal = (timestamp) =>{
    const date = new Date(timestamp); 
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM'; 
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const nameDay = days[date.getUTCDay()].toUpperCase(); 
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 
    const month = months[date.getMonth()]; 
    const day = date.getDate(); 

   
    const timeString = `${hours % 12}:00 ${ampm}`;
    const dateString = `${nameDay} ${day} ${month}`;
    return {dateString, timeString}
}

export default getTimeStringForModal;
