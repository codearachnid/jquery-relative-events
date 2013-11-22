/**
 * DEMO EVENTS
 */
var single_day = [
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
var full_week = [
{ date: '2013-11-10', events: [
    { hour: "11", min: "00", duration: "30" },
    { hour: "11", min: "00", duration: "30" },
    { hour: "12", min: "00", duration: "30" },
    { hour: "13", min: "00", duration: "30" },
]},
{ date: '2013-11-11', events: [
    { hour: "9", min: "00", duration: "105" },
    { hour: "9", min: "00", duration: "30" },
    { hour: "9", min: "00", duration: "30" },
    { hour: "10", min: "00", duration: "60" },
    { hour: "10", min: "00", duration: "30" },
]},
{ date: '2013-11-12', events: [
	{ hour: "7", min: "00", duration: "30" },
	{ hour: "7", min: "00", duration: "30" },
	{ hour: "7", min: "15", duration: "30" },
	{ hour: "7", min: "45", duration: "45" },
    { hour: "8", min: "30", duration: "30" },
    { hour: "8", min: "30", duration: "30" },
]},
{ date: '2013-11-13', events: [
    { hour: "11", min: "00", duration: "30" },
    { hour: "11", min: "00", duration: "30" },
    { hour: "11", min: "00", duration: "30" },
    { hour: "11", min: "00", duration: "30" },
]},
{ date: '2013-11-14', events: [
    { hour: "7", min: "45", duration: "45" },
    { hour: "8", min: "30", duration: "120" },
    { hour: "8", min: "30", duration: "90" },
]},
{ date: '2013-11-15', events: []},
{ date: '2013-11-16', events: [
    { hour: "7", min: "45", duration: "300" },
]}];
/**
 * EVENT OVERLAP DEMO
 */
jQuery(document).ready(function($){

    // DUMMY DATA
    // loop through single day event data
    $.each(single_day, function(i,item){
        // create event divs for single day
        $('#single_day .day').append($('<div>').attr( {
                class: 'event',
                id: 'event-' + i,
                'data-hour':item.hour,
                'data-minute': item.min,
                'data-duration':item.duration
            }).text( "Event " + (i+1) ));
        if( single_day.length-1 == i ){

            // loop through full week event data
            $.each(full_week, function(index, column){
                
                // create daily event columns
                // <div class="events day" data-day="2013-11-11"></div> 
                $('#full_week').append( $('<div>').attr({
                    class: 'events day',
                    'data-date': column.date
                }));
            
                $.each(column.events, function(ii,item){
                    // create event divs
                    $('#full_week').find('.day[data-date=' +column.date+ ']').append($('<div>').attr( {
                            class: 'event',
                            id: 'event-' + ii,
                            'data-hour':item.hour,
                            'data-minute': item.min,
                            'data-duration':item.duration
                        }).text( "Event " + (ii+1) ));
                });

                // once done with full week fire off relativeEvents
                if( full_week.length-1 == index ){
                    $('.calendar').relativeEvents({
                        dayStart: 7,
                        debug: true,
                        eventOffset: {
                top: -61, // offset because of 48 borders for hour and half hour dividers
                left: 10,
                height: -5, // offset height because of the event borders
                width: -6, // offset width because of the event borders
            }
                    });
                }
            });
        }
    });
});
