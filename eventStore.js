//A private array to hold our events
const eventArray = [
    {
        "id": "Event1",
        "date": "2019/9/1",
        "name": "Dev Career first get together",
        "venue": "ICC UI"
    }
];

// function to calculate the number of days before an event take place.
//The prop is calculated and added to the event whenever there is a request that 
//need sending an event over to the sender, since this is a dynamic property that 
//changes based on when the request is made
function addDaysToEventProp(event){
            
        let today = new Date();
        today = (new Date(`${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()}`)).getTime();
        let dayOfEvent = new Date(event.date).getTime();
        let daysToEvent = dayOfEvent - today;
        if(daysToEvent < 0){
            event.daysToEvent = "Event passed";
        }
        else if(daysToEvent === 0){
            event.daysToEvent = "Event happening today";
        }
        else {
            const aDayInMillis = 86400000;
            event.daysToEvent = Math.floor(daysToEvent/aDayInMillis);
        }
}

module.exports = {
    getAllEvents: () => {           //method property to fetch all events in the event array
        eventArray.forEach(event => {
            addDaysToEventProp(event);
        });
        return eventArray;
    },

    getEventCount: () => {       //method property to get the number of events in our event array
        return eventArray.length;
    },

    getEvent: (eventID) => {    //method property to get a single event
        const event = eventArray.find(
            e => e.id == eventID
        );
        if(event){
            addDaysToEventProp(event); //calculate and add daysToEvent prop before sending over
            return event;
        }
    },

    addEvent: (event) => {      //method property to add new event
        eventArray.push(event);
    },

    deleteEvent: (eventID) => {     //method property to delete an event
       const eventIndex = eventArray.indexOf(eventArray.find(
           e => e.id == eventID
       ));
       if(eventIndex !== -1){  //if event exists
           addDaysToEventProp(eventArray[eventIndex]); //calculate and add daysToEvent prop before sending over
           return eventArray.splice(eventIndex, 1)[0]; //delete and return the event
       }
    },

    update: (eventID, newEvent) => { //method property to update an event
        const eventIndex = eventArray.indexOf(eventArray.find(  //check to see if the event exists
            e => e.id == eventID
        ));
        if(eventIndex !== -1){  //if exists
            eventArray[eventIndex] = newEvent; //update the event 
            addDaysToEventProp(eventArray[eventIndex]); //calculate and add daysToEvent prop before sending over
            return eventArray[eventIndex];  //return the updated event
        }
    }

}
