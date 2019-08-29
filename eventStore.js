//A private JSON object to hold our events
const eventJSON = {
   Event1: {
        "id": "Event1",
        "date": "2019/9/1",
        "name": "Dev Career first get together",
        "venue": "ICC UI"
    }
}

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
            event['daysToEvent'] = "Event passed";
        }
        else if(daysToEvent === 0){
            event['daysToEvent'] = "Event happening today";
        }
        else {
            const aDayInMillis = 86400000;
            event['daysToEvent'] = Math.floor(daysToEvent/aDayInMillis);
        }
}

module.exports = {
    getAllEvents: () => {        //method property to fetch all events in the eventJSON
        for(const key in eventJSON){
            addDaysToEventProp(eventJSON[key]);
        }        
        return eventJSON;
    },

    getEventCount: () => {       //method property to get the number of events in eventJSON
        return Object.keys(eventJSON).length;
    },

    getEvent: (eventID) => {    //method property to get a single event
        if(eventJSON.hasOwnProperty(eventID)){
            addDaysToEventProp(eventJSON[eventID]);          //calculate and add daysToEvent prop before sending over
            return eventJSON[eventID];
        }
    },

    addEvent: (event) => {      //method property to add new event
        eventJSON[event.id] = event;
    },

    deleteEvent: (eventID) => {     //method property to delete an event
        if(eventJSON.hasOwnProperty(eventID)){
            addDaysToEventProp(eventJSON[eventID]);     //calculate and add daysToEvent prop before sending over
            event = eventJSON[eventID];
            delete eventJSON[eventID];             //
            return event;
        }
    },

    update: (eventID, newEvent) => { //method property to update an event
        if(eventJSON.hasOwnProperty(eventID)){
            addDaysToEventProp(eventJSON[eventID]); //calculate and add daysToEvent prop before sending over
            eventJSON[eventID] = newEvent;      //set the new properties
            return eventJSON[eventID];
        }
    }

}
