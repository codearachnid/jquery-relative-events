/**
 * DEMO EVENTS
 */
var demo_events = [
    { name: 'Event 1', id: "event-1", hour: "9", min: "00", duration: "120" },
    { name: 'Event 2', id: "event-2", hour: "9", min: "00", duration: "30" },
    { name: 'Event 3', id: "event-3", hour: "9", min: "00", duration: "30" },
    { name: 'Event 4', id: "event-4", hour: "9", min: "00", duration: "30" },
    { name: 'Event 5', id: "event-5", hour: "9", min: "00", duration: "30" },
    { name: 'Event 6', id: "event-6", hour: "9", min: "00", duration: "30" },
    { name: 'Event 7', id: "event-7", hour: "9", min: "00", duration: "30" },
    { name: 'Event 8', id: "event-8", hour: "10", min: "00", duration: "60" },
    { name: 'Event 9', id: "event-9", hour: "10", min: "00", duration: "30" },
    { name: 'Event 10', id: "event-10", hour: "10", min: "00", duration: "30" },
    { name: 'Event 11', id: "event-11", hour: "10", min: "00", duration: "30" },
    { name: 'Event 12', id: "event-12", hour: "10", min: "00", duration: "30" },
    { name: 'Event 13', id: "event-13", hour: "10", min: "00", duration: "30" },
    { name: 'Event 14', id: "event-14", hour: "11", min: "00", duration: "30" },
    { name: 'Event 15', id: "event-15", hour: "11", min: "30", duration: "90" },
    { name: 'Event 16', id: "event-16", hour: "12", min: "15", duration: "300" },
    { name: 'Event 17', id: "event-17", hour: "13", min: "00", duration: "60" },
    { name: 'Event 18', id: "event-18", hour: "14", min: "00", duration: "60" },
    { name: 'Event 19', id: "event-19", hour: "14", min: "00", duration: "60" },
    { name: 'Event 20', id: "event-20", hour: "14", min: "00", duration: "30" },
    { name: 'Event 21', id: "event-21", hour: "14", min: "30", duration: "60" },
    { name: 'Event 22', id: "event-22", hour: "14", min: "30", duration: "60" },
    { name: 'Event 23', id: "event-23", hour: "15", min: "00", duration: "60" },
    { name: 'Event 24', id: "event-24", hour: "14", min: "00", duration: "30" }
];
/**
 * EVENT OVERLAP DEMO
 */
jQuery(document).ready(function($){
    // DUMMY DATA
    // loop through dummy event data and create the divs
    $.each(demo_events, function(i,item){
        // create event divs
        $('#demoEvents').append($('<div>').attr( {
            class: 'event',
            id: item.id,
            'data-hour':item.hour,
            'data-minute': item.min,
            'data-duration':item.duration
        }).text(item.name));
        if( demo_events.length-1 == i ){
            $('.calendar').relativeEvents({
                dayStart: 8,
                showHourRange: 8,
                eventOffset: {
                    top: -51, // offset because of 51 borders for hour and half hour dividers
                    left: 65,
                    height: -5, // offset height because of the event borders
                    width: -5, // offset width because of the event borders
                },
                debug: true
            });
        }
    });
});
