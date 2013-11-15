/**
 * jQuery Relative Events v.8
 *
 * A simple plugin to organize events in a daily view and positioned 
 * in relationship to each other.
 * 
 * @author Timothy Wood @codearachnid <tim@imaginesimplicity.com>
 * @license GPLV3
 * 
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {
    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    var pluginName = "relativeEvents",
        defaults = {
            debug: false,
            eventOffset: { top: 0, left:0, width:0, height:0 },
            sortEvents: false,
            setStartOfDay: true,
            dayStart: 8, // day starts at 8am
            dayStartOffset: 0, // should there be an offset
        };

    // plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this._debug = this.settings.debug;
        // hold events, each node will contain properties of item, group and map
        this.eventData = [],
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            // when in debug mode
            if( this._debug ) {
                console.time( this._name + "-init");
                console.log(this._name + ".init()");
            }

            // gather event data and set positions
            if( this.setEventData() )
                this.setEventPositions();

            // set the start of day for the day column
            if( this.settings.setStartOfDay )
                this.setStartOfDay();

            // stop debug timer
            if( this._debug )
                console.timeEnd(this._name + "-init");
        },
        updateEvents: function() {
            
            // when in debug mode
            if( this._debug ) {
                console.time( this._name + "-updateEvents");
                console.log(this._name + ".updateEvents()");
            }

            // flush eventData
            this.eventData = [];

            // parse updated event list
            this.init();
            
            // TODO: bug in update does not always refresh start of day
            if( this.settings.setStartOfDay )
                this.setStartOfDay();
            
            // stop debug timer
            if( this._debug )
                console.timeEnd(this._name + "-updateEvents");
        },
        setEventData: function(){
            // when in debug mode
            if( this._debug ) {
                console.time(this._name + "-setEventData");
                console.log(this._name + ".setEventData()");
            }

            // store instance in method global
            var $this = this;

            // loop through days on calendar
            $(this.element).find('.day').each(function(i, day) {

                // get or set unique id for parsing events
                if( typeof $(day).attr('id') === 'undefined' ) {
                    var uuid =  $this.getUUID();
                    $(day).attr('id', uuid );
                } else {
                    var uuid = $(day).attr('id');    
                }

                // add class "first" to first day column
                if( i == 0)
                    $(day).addClass('first');                

                // store event list objects for reference within loop
                var events = $(day).find('.event');

                // when event data node does not exist prefill
                if( typeof $this.eventData[ uuid ] === 'undefined')
                    $this.eventData[ uuid ] =  {
                        item: [],
                        map: [],
                        group: []
                    };
                
                // loop through available events within the set day
                events.each(function(ii, item){

                    // set jQuery object from event dom object
                    item = $(item);

                    // if the event dom does not have an ID set we need to specify one
                    if( typeof item.attr('id') === 'undefined' ){
                        itemID = 'event-' + ii;
                        item.attr('id', itemID);
                    }else{
                        itemID = item.attr('id');
                    }

                    // set time range of event
                    var startTime = parseInt(item.attr('data-hour')) * 60 + parseInt(item.attr('data-minute'));
                    var endTime = startTime + parseInt(item.attr('data-duration'));

                    // load up eventData items with our event item and calculated start/end by minutes
                    $this.eventData[ uuid ].item[ itemID ] = {
                        start: startTime,
                        end: endTime,
                        day: uuid, // id for which daily column this event originates
                        column: 0 // which column is the event positioned
                    };

                    // load up events to map
                    $this.insertEventToMap( itemID, startTime, endTime, uuid, false );

                    // load up events to groups
                    $this.insertEventToGroup( itemID, startTime, endTime, uuid, false );

                });

                // exit gracefully when finished looping all available events
                if( i == $($this.element).find('.day').length-1 ){
                    if( $this._debug ) {
                        // stop debug timer
                        console.timeEnd($this._name + "-setEventData");
                    }
                }

            });
            
            return true;
        },
        setEventPositions: function(){
            // when in debug mode
            if( this._debug ) {
                console.time(this._name + "-setEventPositions");
                console.log(this._name + ".setEventPositions()");
            }

            // store instance in method global
            var $this = this;

            // loop through available day in the event data array
            for ( var uuid in this.eventData){

                // determine column width for current day
                columnWidth = $(this.element).find( '#' + uuid ).width();

                // loop through event groups and begin painting event positions
                for( var i=0; i<this.eventData[ uuid ].group.length; i++){
                    // set width of each contiguous event in the group
                    itemWidth = ( parseInt( columnWidth ) / parseInt( this.eventData[ uuid ].group[i].maxWidth ) ) + parseInt(this.settings.eventOffset.width);
                    
                    // loop through event ids to paint offsets and dimension
                    for( var ii=0; ii< this.eventData[ uuid ].group[i].id.length; ii++ ){

                        // set simple var to hold values from global event object
                        item = this.eventData[ uuid ].item[ this.eventData[ uuid ].group[i].id[ii] ];

                        // calculate itemHeight by duration + offset
                        itemHeight = parseInt(item.end) - parseInt(item.start) + parseInt(this.settings.eventOffset.height);

                        itemOffset = {};
                        itemOffset.top = item.start + parseInt(this.settings.eventOffset.top);
                        

                        // build left offset (faster if we know the maxWidth > 1)
                        if( parseInt( this.eventData[ uuid ].group[i].maxWidth ) > 1 && item.column > 1 ){
                            itemOffset.left = ( itemWidth * (item.column-1) ) + ( parseInt(this.settings.eventOffset.left) * (item.column-1) );
                        }
                        
                        $( '#' + this.eventData[ uuid ].group[i].id[ii], $( '#' + uuid ) )
                            .width( itemWidth )
                            .height( itemHeight )
                            .css(itemOffset);

                        if( $this._debug) {
                            console.log(this._name + ".setEventPosition: column: #" + uuid + " item: #" + this.eventData[ uuid ].group[i].id[ii] + " width:" + itemWidth + "px height:" + itemHeight + "px offset-x:" + $( '#' + this.eventData[ uuid ].group[i].id[ii] ).offset().left + " offset-y:" + $( '#' + this.eventData[ uuid ].group[i].id[ii] ).offset().top );
                        }
                    };
                }
            }

            // stop debug timer
            if(this._debug)
                console.timeEnd(this._name + "-setEventPositions");
        },
        insertEventToGroup: function( eID, start, end, uuid, groupID ){
            // when in debug mode
            if( this._debug ) {
                console.time(this._name + "-insertEventToGroup");
                console.log(this._name + ".insertEventToGroup(" + eID + "," + start + "," + end + "," + uuid + "," + groupID + ")");
            }

            if( this.eventData[ uuid ].group.length == 0 || this.eventData[ uuid ].group.length <= groupID ){
                this.eventData[ uuid ].group[this.eventData[ uuid ].group.length] = {
                    id: [ eID ],
                    range: {
                        start: start,
                        end: end
                    },
                    maxWidth: 1 // set max width (columns) of contigious events in group
                };
                groupID = this.eventData[ uuid ].group.length-1;

                // stop debug timer
                if(this._debug)
                    console.timeEnd(this._name + "-insertEventToGroup");
            } else {
                // with a specified group ID we will insert the eID into the group or search for available group
                if( groupID !== false ){
                    // insert event ID to id group
                    this.eventData[ uuid ].group[groupID].id.push( eID );

                    // extend the range if the current event stretches beyond our end
                    if( this.eventData[ uuid ].group[groupID].range.end < end ){
                        this.eventData[ uuid ].group[groupID].range.end = end;
                    }

                    // update max width (columns) of contigious events in group
                    if( this.eventData[ uuid ].group[groupID].maxWidth < this.eventData[ uuid ].item[ itemID ].column){
                        this.eventData[ uuid ].group[groupID].maxWidth = this.eventData[ uuid ].item[ itemID ].column;
                    }
                } else {
                    // set group ID to be extreme length of the group before looping
                    groupID = this.eventData[ uuid ].group.length;
                    for( var i=0; i<this.eventData[ uuid ].group.length; i++){
                        // set matching group ID if start time is within the range of the group
                        if( this.eventData[ uuid ].group[i].range.start <= start && this.eventData[ uuid ].group[i].range.end > start){
                            groupID = i;
                            break;
                        }
                    }

                    // stop debug timer
                    if(this._debug)
                        console.timeEnd(this._name + "-insertEventToGroup");

                    // explicit insert event ID to group
                    this.insertEventToGroup( eID, start, end, uuid, groupID );
                }
            }
        },
        insertEventToMap: function( eID, start, end, uuid, columnID ){
            // when in debug mode
            if( this._debug ) {
                console.time(this._name + "-insertEventToMap");
                console.log(this._name + ".insertEventToMap(" + eID + "," + start + "," + end + "," + uuid + "," + columnID + ")");
            }

            // add column to event map if it meets the conditions
            if( this.eventData[ uuid ].map.length == 0 || this.eventData[ uuid ].map.length <= columnID ){
                this.eventData[ uuid ].map.push( this.arrayFill(0,1440, '') );
                columnID = this.eventData[ uuid ].map.length-1;
            }

            // with a specified columnID we will insert the eID into the range or search for available slot
            if( columnID !== false ){
                // fill map with event ID
                for (var i=start;i<end;i++){
                    this.eventData[ uuid ].map[columnID][i] = eID;
                }
                // update event column actual position
                this.eventData[ uuid ].item[ itemID ].column = columnID+1;

                // stop debug timer
                if(this._debug)
                    console.timeEnd(this._name + "-insertEventToMap");
            } else {
                // loop through the time slots in each column and check to see if we can insert the event
                var cleanSpace = true;
                // loop through available map columns
                for (var i=0;i<this.eventData[ uuid ].map.length;i++){
                    cleanSpace = true;
                    // loop through the time slots in each column
                    for (var ii=start;ii<end;ii++){
                        if (this.eventData[ uuid ].map[i][ii] != '') {
                            cleanSpace = false;
                            break;
                        }
                    }
                    // break out of the loop if opening is found
                    if( cleanSpace ){
                        columnID = i;
                        break;
                    // if there are no available spaces and loop is ending then set column to increment to next
                    } else if( !cleanSpace && i == this.eventData[ uuid ].map.length-1 ){
                        columnID = this.eventData[ uuid ].map.length;
                    }
                }

                // stop debug timer
                if(this._debug)
                    console.timeEnd(this._name + "-insertEventToMap");

                // determined available column to insert event
                this.insertEventToMap( eID, start, end, uuid, columnID );
            }
        },
        setStartOfDay: function(){
            // when in debug mode
            if( this._debug ) {
                console.time(this._name + "-setStartOfDay");
                console.log(this._name + ".setStartOfDay()");
            }

            var calendarWrap = $(this.element);
            var morningStart = calendarWrap.find('.grid li[data-hour=' + parseInt(this.settings.dayStart) + ']');
            
            // bad dom return gracefully
            if (morningStart.length == 0) {
                console.log(this._name + ".setStartOfDay() error: day start could not be found in dom");
                // stop debug timer
                if (this._debug)
                    console.timeEnd(this._name + "-setStartOfDay");
                return false;
            }
            
            calendarWrap.scrollTop( 
                morningStart.position().top -
                calendarWrap.scrollTop() +
                parseInt(this.settings.dayStartOffset) );

            // stop debug timer
            if(this._debug)
                console.timeEnd(this._name + "-setStartOfDay");
        },
        arrayFill: function (start_index, duration, mixed_val) {
			// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Waldo Malqui Silva
            // when in debug mode
			if( this._debug ) {
			    console.time(this._name + "-arrayFill");
			    console.log(this._name + ".arrayFill(" + start_index + "," + duration + "," + mixed_val + ")");
			}

			var tmp_arr = {};

			if (!isNaN(start_index) && !isNaN(duration)) {
				for (var i = 0; i < duration; i++) {
					tmp_arr[(i + start_index)] = mixed_val;
				}
			}

			// stop debug timer
			if(this._debug)
			    console.timeEnd(this._name + "-arrayFill");

			return tmp_arr;
        },
        getUUID: function() {
            // http://www.ietf.org/rfc/rfc4122.txt
            // when in debug mode
            if( this._debug ) {
                console.time(this._name + "-getUUID");
                console.log(this._name + ".getUUID()");
            }
            var s = [],hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            // bits 12-15 of the time_hi_and_version field to 0010
            s[14] = "4";  
            // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");

            // stop debug timer
            if(this._debug)
                console.timeEnd(this._name + "-getUUID");

            return uuid;
        }
    };

    // prevent against multiple instantiations with plugin wrapper for constuctor
    $.fn[ pluginName ] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, 'plugin_' + pluginName)) {

                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
                }
            });

        // If the first parameter is a string and it doesn't start
        // with an underscore or "contains" the `init`-function,
        // treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                  $.data(this, 'plugin_' + pluginName, null);
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

})( jQuery, window, document );
