/**
 * DEMO EVENTS
 */
var demo_events = [
	// 3x1 events
	{ hour: "7", min: "00", duration: "30" },
	{ hour: "7", min: "00", duration: "30" },
	{ hour: "7", min: "15", duration: "30" },
	// 1x1 event
	{ hour: "7", min: "45", duration: "45" },
	// 2x1 events
    { hour: "8", min: "30", duration: "30" },
    { hour: "8", min: "30", duration: "30" },
    // 7x2.5 events
    { hour: "9", min: "00", duration: "105" },
    { hour: "9", min: "00", duration: "30" },
    { hour: "9", min: "00", duration: "30" },
    { hour: "9", min: "00", duration: "30" },
    { hour: "9", min: "00", duration: "30" },
    { hour: "9", min: "00", duration: "30" },
    { hour: "9", min: "00", duration: "30" },
    { hour: "10", min: "00", duration: "60" },
    { hour: "10", min: "00", duration: "30" },
    { hour: "10", min: "00", duration: "30" },
    { hour: "10", min: "00", duration: "30" },
    { hour: "10", min: "00", duration: "30" },
    // { hour: "10", min: "00", duration: "30" },
    // 4x1 event
    { hour: "11", min: "00", duration: "30" },
    { hour: "11", min: "00", duration: "30" },
    { hour: "11", min: "00", duration: "30" },
    { hour: "11", min: "00", duration: "30" },
    // 5x1 event
    { hour: "11", min: "30", duration: "30" },
    { hour: "11", min: "30", duration: "30" },
    { hour: "11", min: "30", duration: "30" },
    { hour: "11", min: "30", duration: "30" },
    { hour: "11", min: "30", duration: "30" },
    // 6x5 events
    { hour: "12", min: "00", duration: "90" },
    { hour: "12", min: "15", duration: "285" },
    { hour: "13", min: "00", duration: "60" },
    { hour: "13", min: "30", duration: "90" },
    { hour: "13", min: "45", duration: "60" },
    { hour: "14", min: "00", duration: "60" },
    { hour: "14", min: "00", duration: "45" },
    { hour: "14", min: "30", duration: "60" },
    { hour: "15", min: "00", duration: "45" },
    { hour: "15", min: "00", duration: "60" },
    { hour: "15", min: "15", duration: "60" },
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
            id: 'event-' + i,
            'data-hour':item.hour,
            'data-minute': item.min,
            'data-duration':item.duration
        }).text( "Event " + (i+1) ));
        if( demo_events.length-1 == i ){
            $('.calendar').relativeEvents({
            	dayStart: 7,
                eventOffset: {
                    top: -52, // offset because of 48 borders for hour and half hour dividers
                    left: 64,
                    height: -5, // offset height because of the event borders
                    width: -5, // offset width because of the event borders
                },
                debug: true
            });
        }
    });
});