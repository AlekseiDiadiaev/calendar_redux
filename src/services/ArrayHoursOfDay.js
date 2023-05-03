
const hoursOfDays = [];

for (let i = 0; i < 24; i++ ){
    let hour;
    let str;
    

    if(i < 12) {
        str = 'AM'
        hour = i;
    } else {
        str = 'PM';
        hour = i - 12;
    }

    if(i === 0 || i === 12) {
        hour = 12
    } 

    hoursOfDays.push(`${hour} ${str}`)
}

export default hoursOfDays;