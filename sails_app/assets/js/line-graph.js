function LineGraph(id, d, w, h, t, yMin, yMax, inverted){
	var data = d;
	var margin = {top: 10, right: 10, bottom: 10, left: 10},
	    width = w - margin.left - margin.right,
	    height = h - margin.top - margin.bottom;
	var xDomain = 20;
    var xRange = [0, width];
    var yRange = [height, 0];
   

    if (yMin === undefined || yMin === null) {
        yMin = 20;
    }

    if (yMax === undefined || yMax === null) {
        yMax = 60;
    }

    var yDomain = [yMin, yMax];
    var threshold =  t || 40;
	var parseDate = d3.time.format("%Y%m%d").parse;

	var x = d3.scale.linear()
		.range(xRange);
	var y = d3.scale.linear()
	    .range(yRange);
	var origin= null;

    if(void(0) !== inverted && inverted === true ){
        origin = function(d){
            return y(threshold);
        };
    }else{
        origin = function(d){
            return y(yMin);
        };
    }
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d,i) { return x(i); })
	    .y(function(d) { return y(threshold); });
	    
	var area = d3.svg.area()
	    .interpolate("basis")
	    .x(function(d,i) { return x(i); })
	    .y0(origin)
	    .y1(function(d) { 
	    return y(d.temperature); });
	
	 var svg = d3.select(id).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	  
	  x.domain([0, xDomain]); //hardcoded x-domain points
	  y.domain(yDomain);//d3.extent(data, function(d) { return d.temperature; }));

	  svg.append("clipPath")
	      .attr("id", "clip-above"+id)
	    .append("rect")
	      .attr("width", width)
	      .attr("height", y(threshold));

	  svg.append("clipPath")
	      .attr("id", "clip-below"+id)
	    .append("rect")
	      .attr("y", y(threshold))
	      .attr("width", width)
	      .attr("height", height - y(threshold));
	  	try{
	  	var path = svg.selectAll(".line-graph-area")
	      .data(["above", "below"])
	      .enter().append("path")
	      .attr("class", function(d,i) { 
	    	  var css= "line-graph-area ";
	    	  if(inverted){
	    		  css+=" inverted-"
	    	  }
	    	  return css + d; 
	    	  
	      })
	      .attr("clip-path", function(d) { return "url(#clip-" + d +id +")"; })
	      .datum(data)
	      .attr("d",area);
	  	
	  	svg.append("g").attr("id","thresholdG")
	  	.attr("opacity", 0.8).append("svg:line")
	    .attr("x1", function(){ return x(0);})
	    .attr("y1", function(){ return y(threshold);})
	    .attr("x2", function(){ return x(xDomain);})
	    .attr("y2", function(){ return y(threshold);})
	                        .attr("stroke", "#455569")
                            .attr("stroke-width", 0.5)
                            .attr("fill", "none");


        // Text width hack
        var uuid = Math.floor(Math.random()*10000);
        $("body").append("<div id='line-graph-hidden-element-" + uuid + "' style='visibility: hidden; display:inline; font-family: \"Lato\", \"Helvetica Neue\", \"Calibri\", \"Arial\", sans-serif; font-weight: 100; font-size: 18px;'>" + threshold + "\u00B0C" + "</div>");
        var textWidth = $("#line-graph-hidden-element-" + uuid).outerWidth();
        $("#line-graph-hidden-element-" + uuid).remove();
	  		
	  	svg.select("#thresholdG").append("rect")
	  	.attr("x", 0)
	  	.attr("y", function(){return y(threshold)-12;})
	  	.attr("rx", 2)
	  	.attr("ry", 2)
	  	.attr("width", textWidth + 7)
	  	.attr("height", 22)
	  	.attr("fill", "#555555");

	  	svg.select("#thresholdG").append("text")
	  		.attr("x", function(d) { return 4; })
	  		.attr("y", function(d) { return y(threshold)+5; })
	  		.text( function (d) { return threshold+"\u00B0C"; })
	  		.attr("font-family", '"Lato", "Helvetica Neue", "Calibri", "Arial", sans-serif')
            .attr("font-weight", "100")
            .attr("font-size", "18px")
	  		.attr("fill", "white");

	  	}catch(e){
	  		console.log(e);
	  	}
	  	
	  	var update = function(t){

	  		data.push(t);
			  // redraw the line, and slide it to the left
			 path
			  	.attr("d",area)
			    .attr("transform", null)
			    .transition()
			      .duration(1000)
			      .ease("linear")
			      .attr("transform", "translate(" + x(-1) - margin.left + ",0)")
			  if(data.length > xDomain){
				  data.shift();
			  }
	  	
	  	};
	  	
	  	return update;
}

