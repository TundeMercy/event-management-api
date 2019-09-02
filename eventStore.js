//importing dependencies
const debug = require('debug')('event-manager');
const fs = require('fs');

//Variables that hold file data
let  eventJSON = {}
let currentCount;


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

//Function to back up used ID in a file to avoid ID conflict
function saveCurrentCount(){
    fs.writeFile(__dirname + '/rsc/eventIDTracker.json',JSON.stringify({"currentCount": ++currentCount}), 'utf8', (err) => {
        if(err){
            debug("Can't write to the file.");
        }
        else {
            debug("File written successfully!");
        }
    });
}

//function to write our events to a JSON file
function saveEvent(){
    fs.writeFile(__dirname + '/rsc/eventStore.json',JSON.stringify(eventJSON, null, 2), 'utf8', (err) => {
        if(err){
            debug("Can't write to the file.");
        }
        else {
            debug("File written successfully!");
        }
    });
}


//the Object that defines various interfaces to interact with the events
module.exports = {

    //function property to load program data from file to memory
    loadEvents: () => {

        //loading the events from eventstore file
        fs.readFile(__dirname + '/rsc/eventStore.json', 'utf8', (err, data) => {
            if(err){
                debug("Can't load the file");
            }
            else{
                eventJSON = JSON.parse(data);
                debug('File loaded successfully!');
            }
        });

        //loading ID tracker from file
        fs.readFile(__dirname + '/rsc/eventIDTracker.json','utf8', (err, data) => {
            if(err){
                debug("Cant't read from file eventIDTracker");
            }
            else {
                currentCount = parseInt(JSON.parse(data).currentCount);
                debug('eventCount initialized!');
            }
        });
    },

    
    getAllEvents: () => {        //method property to fetch all events in the eventJSON
        for(const key in eventJSON){
            addDaysToEventProp(eventJSON[key]);
        }        
        return eventJSON;
    },

    getUsedID: () => {       //method property to get used IDs to avoid ID conflict
        return currentCount;
    },

    getEvent: (eventID) => {    //method property to get a single event
        if(eventJSON.hasOwnProperty(eventID)){
            addDaysToEventProp(eventJSON[eventID]);          //calculate and add daysToEvent prop before sending over
            return eventJSON[eventID];
        }
    },

    addEvent: (event) => {      //method property to add new event
        addDaysToEventProp(event);
        eventJSON[event.id] = event;
        saveCurrentCount();
        saveEvent();
    },

    deleteEvent: (eventID) => {     //method property to delete an event
        if(eventJSON.hasOwnProperty(eventID)){
            addDaysToEventProp(eventJSON[eventID]);     //calculate and add daysToEvent prop before sending over
            event = eventJSON[eventID];
            delete eventJSON[eventID];
            saveEvent();             
            return event;
        }
    },

    update: (eventID, newEvent) => { //method property to update an event
        if(eventJSON.hasOwnProperty(eventID)){
            addDaysToEventProp(eventJSON[eventID]); //calculate and add daysToEvent prop before sending over
            eventJSON[eventID] = newEvent;      //set the new properties
            saveEvent();
            return eventJSON[eventID];
        }
    }

}
