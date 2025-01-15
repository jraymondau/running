$(document).ready(function(){
    
    // Events
    $( "#fadeFromSlide").slider({
        slide: function( event, ui ) {
            console.log(ui.value);
            $('#fadeFrom').val( ui.value );
            calcSplits();
          }
    });
    $( "#fadeTimeSlide").slider({
        slide: function( event, ui ) {
            $('#fadeTime').val( ui.value );
            calcSplits();
          }
    });
    $('#distance').change(function(){
        calcSplits();
    });
    $('#hours').change(function(){
        calcSplits();
    });
    $('#mins').change(function(){
        calcSplits();
    });
    $('#calculate').click(function(){
        calcSplits(); 
    })

    // Functions
    function validateForm(){
        var valid = false;

        if($('#fadeFrom').val() != 0 && $('#fadeTime').val() != 0){
            valid = true;
        }
        return valid;
    };

    function calcSplits(){
        
        var dist = $('#distance').val();
        var h = $('#hours').val() * 60 *60;
        var m = $('#mins').val() *60;
        var fadeFrom = $('#fadeFrom').val();
        var fadeTime = $('#fadeTime').val();
        var raceTime = new Date();

        
        raceTime.setHours(h,m,0);
        
        // get using seconds
        var totalSecs = h + m;
    
        if($('#distance').val() != 0 && ($('#hours').val() + $('#mins').val() != 0)){
            
            var avgPace = ((totalSecs/dist)/60);
            //todo prefade pace
            //todo postfade pace
            // fade distance * fade time = fade total, the amount of slow down. Which == amount that needs to be recovered at the start.
            // then calculate prefade distance / fade total
            var fadeTotal = (dist - fadeFrom) * fadeTime;
            var preFadeBuffer = parseInt(fadeTotal / fadeFrom);
            //console.log(fadeTotal + ' ' + preFadeBuffer);
        
        
        
            //console.log(avgPace);
            var renderedPace;
            var adjustedRenderedPace;
            var calcSeconds = 0;
            var calcMins = Math.floor(avgPace);

            if((avgPace%1)> 0){
                calcSeconds = Math.round(avgPace%1*60)
                renderedPace = calcMins + ':' + calcSeconds;
            }else{
                renderedPace = avgPace + ':00';
            }
            
        }
    
    
        //console.log(renderedPace);
        var calcDate = new Date();
        calcDate.setHours(0,0,0);
        var progDate = new Date();
        progDate.setHours(0,0,0);
        
        if(renderedPace != undefined){
            $('#avgPace').text(renderedPace);
        }
        
        if(validateForm()){
                
            
            var htmlString = '';
            var renderedSeconds = '';
            
            for(var i= 1; i <= dist; i++){
                
                //console.log(i);
                
                //todo calculate cumulative pace
        
                if(i >= fadeFrom){
                    //if > fade then calc new fade pace. if greater than 60 add to minutes.
                    //console.log(calcSeconds + ' - ' + fadeTime);
        
                    /*if((parseInt(calcSeconds) + parseInt(fadeTime)) >= 60){
                        calcMins+= 1;
                        calcSeconds = ((parseInt(calcSeconds) + parseInt(fadeTime)) - 60);
                        //renderedPace = (calcMins + 1) + ':' + ((calcSeconds + fadeTime) - 60);
                    }else{
                        calcSeconds = parseInt(calcSeconds) + parseInt(fadeTime);
                        //renderedPace = (calcMins) + ':' + (parseInt(calcSeconds) + parseInt(fadeTime));
                    }*/
                    //renderedPace = calcMins + ':' + calcSeconds;
                    if((parseInt(calcSeconds) + parseInt(fadeTime)) >= 60){
                        adjustedRenderedPace = (calcMins + 1) + ':' + ((parseInt(calcSeconds) + parseInt(fadeTime)) - 60);
                        //console.log(calcSeconds + ' ' +  fadeTime);
                    }else{
                        renderedSeconds = (parseInt(calcSeconds) + parseInt(fadeTime)).toString();
                        
                        if(renderedSeconds.length == 1){
                            renderedSeconds = '0' + renderedSeconds;
                        }
                        adjustedRenderedPace = (calcMins) + ':' + renderedSeconds;
                    }
                    renderedPace = adjustedRenderedPace;
                }else{
                    if((parseInt(calcSeconds) - preFadeBuffer) <= 0){
                        adjustedRenderedPace = (calcMins - 1) + ':' + ((calcSeconds - preFadeBuffer) + 60);
                    }else{
                        renderedSeconds = (parseInt(calcSeconds) - parseInt(preFadeBuffer)).toString();
                        //console.log(renderedSeconds.length);
                        if(renderedSeconds.length == 1){
                            renderedSeconds = '0' + renderedSeconds;
                        }
                        adjustedRenderedPace = (calcMins) + ':' + renderedSeconds;
                    }
                    renderedPace = adjustedRenderedPace;
                }
                
                htmlString+= '<div class="paceCell">';
                
                //htmlString+= '"> ';
        
                htmlString+= i;
                htmlString+= 'km ';
                htmlString+= renderedPace + ' ';
                
                
                htmlString+= '</div>';
                if(i%5 == 0){
                    htmlString+= ' <br>';
                }
            };
            $('#pacingTable').html(htmlString);
            
        }
    };


});
