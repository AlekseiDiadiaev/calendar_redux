function getDaysToHeaderOfTable(timestamp, count) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const result = [];
  
    for (let i = 0; i < count; i++) {
      const date = new Date(timestamp + i * 86400000 + 86400000); 
      const nameDay = days[date.getUTCDay()].toUpperCase(); 
      const numDay = date.getUTCDate(); 
      const nameMonth = months[date.getUTCMonth()]; 
      result.push({ nameDay, numDay, nameMonth }); 
    }
  
    return result;
}

export default getDaysToHeaderOfTable;