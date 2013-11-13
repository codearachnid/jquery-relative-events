/**
 * jQuery Relative Events
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
        // hold events
        this.eventData = {
            item: [],
            map: [],
            group: []
        };
        this.init();
    }

    Plugin.prototype = {
        init: function () {
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
        setEventData: function(){
            if( this._debug ) {
                console.time(this._name + "-setEventData");
                console.log(this._name + ".setEventData()");
            }

            var $this = this, eventList = $(this.element).find('.events .event');
            eventList.each(function(i, item){
                item = $(item);
                // if the event dom does not have an ID set we need to specify one
                if( typeof item.attr('id') === 'undefined' ){
                    itemID = 'event-' + i;
                    item.attr('id', itemID);
                }else{
                    itemID = item.attr('id');
                }
                var startTime = parseInt(item.attr('data-hour')) * 60 + parseInt(item.attr('data-minute'));
                var endTime = startTime + parseInt(item.attr('data-duration'));
                // load up eventData items with our event item and calculated start/end by minutes
                $this.eventData.item[ itemID ] = {
                    start: startTime,
                    end: endTime,
                    column: 0 // which column is the event positioned
                };
                // load up events to map
                $this.insertEventToMap( itemID, startTime, endTime, false );
                // load up events to groups
                $this.insertEventToGroup( itemID, startTime, endTime, false );

                // when finished looping let's exit gracefully
                if( i == eventList.length-1 ){
                    if( $this._debug ) {
                        // stop debug timer
                        console.timeEnd($this._name + "-setEventData");
                        console.log($this.eventData);
                    }
                }
            });
            return true;
        },
        setEventPositions: function(){
            if( this._debug ) {
                console.time(this._name + "-setEventPositions");
                console.log(this._name + ".setEventPositions()");
            }

            var $this = this, columnWidth = $(this.element).find('.events').width();
            // console.log(columnWidth);

            // loop through event groups and begin painting event positions
            for( var i=0; i<this.eventData.group.length; i++){
                // set width of each contiguous event in the group
                itemWidth = parseInt( columnWidth ) / parseInt( this.eventData.group[i].maxWidth );
                // loop through event ids to paint offsets and dimension
                for( var ii=0; ii< this.eventData.group[i].id.length; ii++ ){
                    item = this.eventData.item[ this.eventData.group[i].id[ii] ];
                    itemOffset = {};
                    itemOffset.top = item.start + parseInt(this.settings.eventOffset.top);

                    // build left offset (faster if we know the maxWidth > 1)
                    if( parseInt( this.eventData.group[i].maxWidth ) > 1 && item.column > 1 ){
                        itemOffset.left = ( itemWidth * (item.column-1) ) + parseInt(this.settings.eventOffset.left);
                        //console.log( this.eventData.group[i].id[ii] + " itemWidth:" + itemWidth + " offsetLeft:" + itemOffset.left);
                    }
                    
                    $( '#' + this.eventData.group[i].id[ii] )
                        .width( itemWidth + parseInt(this.settings.eventOffset.width) )
                        .height( parseInt(item.end) - parseInt(item.start) + parseInt(this.settings.eventOffset.height) )
                        .offset(itemOffset);
                };
            }

            // stop debug timer
            if(this._debug)
                console.timeEnd(this._name + "-setEventPositions");
        },
        insertEventToGroup: function( eID, start, end, groupID ){
            if( this._debug ) {
                console.time(this._name + "-insertEventToGroup");
                console.log(this._name + ".insertEventToGroup(" + eID + "," + start + "," + end + "," + groupID + ")");
            }

            if( this.eventData.group.length == 0 || this.eventData.group.length <= groupID ){
                this.eventData.group[this.eventData.group.length] = {
                    id: [ eID ],
                    range: {
                        start: start,
                        end: end
                    },
                    maxWidth: 1 // set max width (columns) of contigious events in group
                };
                groupID = this.eventData.group.length-1;

                // stop debug timer
                if(this._debug)
                    console.timeEnd(this._name + "-insertEventToGroup");
            } else {
                // with a specified group ID we will insert the eID into the group or search for available group
                if( groupID !== false ){
                    // insert event ID to id group
                    this.eventData.group[groupID].id.push( eID );

                    // extend the range if the current event stretches beyond our end
                    if( this.eventData.group[groupID].range.end < end ){
                        this.eventData.group[groupID].range.end = end;
                    }

                    // update max width (columns) of contigious events in group
                    if( this.eventData.group[groupID].maxWidth < this.eventData.item[ itemID ].column){
                        this.eventData.group[groupID].maxWidth = this.eventData.item[ itemID ].column;
                    }
                } else {
                    // set group ID to be extreme length of the group before looping
                    groupID = this.eventData.group.length;
                    for( var i=0; i<this.eventData.group.length; i++){
                        // set matching group ID if start time is within the range of the group
                        if( this.eventData.group[i].range.start <= start && this.eventData.group[i].range.end > start){
                            groupID = i;
                            break;
                        }
                    }

                    // stop debug timer
                    if(this._debug)
                        console.timeEnd(this._name + "-insertEventToGroup");

                    // explicit insert event ID to group
                    this.insertEventToGroup( eID, start, end, groupID );
                }
            }
        },
        insertEventToMap: function( eID, start, end, columnID ){
            if( this._debug ) {
                console.time(this._name + "-insertEventToMap");
                console.log(this._name + ".insertEventToMap(" + eID + "," + start + "," + end + "," + columnID + ")");
            }

            // add column to event map if it meets the conditions
            if( this.eventData.map.length == 0 || this.eventData.map.length <= columnID ){
                this.eventData.map.push( this.arrayFill(0,1440, '') );
                columnID = this.eventData.map.length-1;
            }

            // with a specified columnID we will insert the eID into the range or search for available slot
            if( columnID !== false ){
                // fill map with event ID
                for (var i=start;i<end;i++){
                    this.eventData.map[columnID][i] = eID;
                }
                // update event column actual position
                this.eventData.item[ itemID ].column = columnID+1;

                // stop debug timer
                if(this._debug)
                    console.timeEnd(this._name + "-insertEventToMap");
            } else {
                // loop through the time slots in each column and check to see if we can insert the event
                var cleanSpace = true;
                // loop through available map columns
                for (var i=0;i<this.eventData.map.length;i++){
                    cleanSpace = true;
                    // loop through the time slots in each column
                    for (var ii=start;ii<end;ii++){
                        if (this.eventData.map[i][ii] != '') {
                            cleanSpace = false;
                            break;
                        }
                    }
                    // break out of the loop if opening is found
                    if( cleanSpace ){
                        columnID = i;
                        break;
                    // if there are no available spaces and loop is ending then set column to increment to next
                    } else if( !cleanSpace && i == this.eventData.map.length-1 ){
                        columnID = this.eventData.map.length;
                    }
                }

                // stop debug timer
                if(this._debug)
                    console.timeEnd(this._name + "-insertEventToMap");

                // determined available column to insert event
                this.insertEventToMap( eID, start, end, columnID );
            }
        },
        setStartOfDay: function(){
            if( this._debug ) {
                console.time(this._name + "-setStartOfDay");
                console.log(this._name + ".setStartOfDay()");
            }

            var calendarWrap = $(this.element);
            var morningStart = calendarWrap.find('.grid li[data-hour=' + parseInt(this.settings.dayStart) + ']');
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
        }
    };

    // prevent against multiple instantiations with plugin wrapper for constuctor
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );