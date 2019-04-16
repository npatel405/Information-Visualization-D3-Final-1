// Samuel Shapiro & Nick Patel

var width = 500;
var height = 500;

var lastSelectedDot = 500;

d3.csv("calvinCollegeSeniorScores.csv", function(csv) {
    for (var i = 0; i < csv.length; ++i) {
		csv[i].GPA = Number(csv[i].GPA);
		csv[i].SATM = Number(csv[i].SATM);
		csv[i].SATV = Number(csv[i].SATV);
		csv[i].ACT = Number(csv[i].ACT);
    }
    var satmExtent = d3.extent(csv, function(row) { return row.SATM; });
    var satvExtent = d3.extent(csv, function(row) { return row.SATV; });
    var actExtent = d3.extent(csv,  function(row) { return row.ACT;  });
    var gpaExtent = d3.extent(csv,  function(row) {return row.GPA;   });


    var satExtents = {
	"SATM": satmExtent,
	"SATV": satvExtent
    };


    // Axis setup
    var xScale = d3.scaleLinear().domain(satmExtent).range([50, 470]);
    var yScale = d3.scaleLinear().domain(satvExtent).range([470, 30]);

    var xScale2 = d3.scaleLinear().domain(actExtent).range([50, 470]);
    var yScale2 = d3.scaleLinear().domain(gpaExtent).range([470, 30]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);

    //Create SVGs and <g> elements as containers for charts
    var chart1G = d3.select("#chart1")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height)
                    .append('g');


    var chart2G = d3.select("#chart2")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height)
                    .append('g');


	 /******************************************

		BRUSHING CODE

	 ******************************************/

    var brushContainer1G = chart1G.append('g')
        .attr('id', 'brush-container1');

    var brushContainer2G = chart2G.append('g')
        .attr('id', 'brush-container2');

    var brush1 = d3.brush()
        .extent([[-10, -10], [width + 10, height + 10]]);

    var brush2 = d3.brush()
        .extent([[-10, -10], [width + 10, height + 10]]);

    brush1.on('start', handleBrushStart1)
        .on('brush', handleBrushMove1)
        .on('end', handleBrushEnd1);

    brush2.on('start', handleBrushStart2)
        .on('brush', handleBrushMove2)
        .on('end', handleBrushEnd2);

    brushContainer1G.call(brush1);
    brushContainer2G.call(brush2);

    function handleBrushStart1() {
        console.log('%cBrush 1 START!!', 'color: green');
        brushContainer2G.call(brush1.move, null);
    }

    function handleBrushStart2() {
        console.log('%cBrush 2 START!!', 'color: green');
        brushContainer1G.call(brush2.move, null);
    }

    function handleBrushMove1() {
        console.log('%cBrush 1 MOVING....', 'color: blue');

        var sel = d3.event.selection;
        if (!sel) {
            // sel is null when we clear the brush
            return;
        }

        // The d3.event.selection contains the boundary of your current brush. It is a nested array that has
        //  the form [[x0, y0], [x1, y1]], where (x0, y0) is the coordinate of the top-left corner and
        //  (x1, y1) is the coordinate of the bottom right corner.

        // You can also think is as [[left, top], [right, bottom]] if that is more intuitive to you

        // Get the boundaries.
        var [[left, top], [right, bottom]] = sel;
        console.log({left, top, right, bottom})

        // Check all the dots in first graph, highlight the ones inside the brush
        d3.selectAll('.dot2')
            .classed('selected2', function(d) {
                var cx = xScale(d['SATM']);
                var cy = yScale(d['SATV']);
                return left <= cx && cx <= right && top <= cy && cy <= bottom;
            });
    }

    function handleBrushMove2() {
        console.log('%cBrush 2 MOVING....', 'color: blue');

        var sel = d3.event.selection;
        if (!sel) {
            // sel is null when we clear the brush
            return;
        }

        // Get the boundaries.
        var [[left, top], [right, bottom]] = sel;
        console.log({left, top, right, bottom})

        // Check all the dots in second graph, highlight the ones inside the brush
        d3.selectAll('.dot1')
            .classed('selected', function(d) {
                var cx = xScale2(d['ACT']);
                var cy = yScale2(d['GPA']);
                return left <= cx && cx <= right && top <= cy && cy <= bottom;
            });
    }

    function handleBrushEnd1() {
        console.log('%cBrush 1 END!!', 'color: red');

        // Clear existing styles when the brush is reset (click)
        if (!d3.event.selection) {
            clearSelected();
        }
    }

    function handleBrushEnd2() {
        console.log('%cBrush 2 END!!', 'color: red');

        // Clear existing styles when the brush is reset (click)
        if (!d3.event.selection) {
            clearSelected();
        }
    }

    function clearSelected() {
        d3.selectAll('.dot1').classed('selected', false);
        d3.selectAll('.dot2').classed('selected2', false);
    }

	 //add scatterplot points
    var temp1 = chart1G.selectAll("circle")
	   .data(csv)
	   .enter()
	   .append("circle")
       .classed("dot1", true)
	   .attr("id", function(d, i) { return "g1-" + i; } )
	   .attr("stroke", "black")
	   .attr("cx", function(d) { return xScale(d.SATM); })
	   .attr("cy", function(d) { return yScale(d.SATV); })
	   .attr("r", 5)
	   .on("click", function(d, i) {
           if (lastSelectedDot != 500) {
               d3.select("#g1-" + lastSelectedDot).classed("selected", false);
               d3.select("#g2-" + lastSelectedDot).classed("selected", false);
           }
           d3.select("#g2-" + i).classed("selected", true);
           d3.select("#satm").text(d.SATM);
           d3.select("#satv").text(d.SATV);
           d3.select("#act").text(d.ACT);
           d3.select("#gpa").text(d.GPA);
           lastSelectedDot = i;
       });

    var temp2 = chart2G.selectAll("circle")
	   .data(csv)
	   .enter()
	   .append("circle")
       .classed("dot2", true)
	   .attr("id", function(d, i) { return "g2-" + i; } )
	   .attr("stroke", "black")
	   .attr("cx", function(d) { return xScale2(d.ACT); })
	   .attr("cy", function(d) { return yScale2(d.GPA); })
	   .attr("r", 5)
	   .on("click", function(d, i) {
           if (lastSelectedDot != 500) {
               d3.select("#g1-" + lastSelectedDot).classed("selected", false);
               d3.select("#g2-" + lastSelectedDot).classed("selected", false);
           }
           d3.select("#g1-" + i).classed("selected", true);
           d3.select("#satm").text(d.SATM);
           d3.select("#satv").text(d.SATV);
           d3.select("#act").text(d.ACT);
           d3.select("#gpa").text(d.GPA);
           lastSelectedDot = i;
       });



    chart1G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0, "+ (width - 30) + ")")
		.call(xAxis) // call the axis generator
		.append("text")
        .attr("fill", "black")
		.attr("class", "label")
		.attr("x", width - 16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("SATM");

    chart1G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis)
		.append("text")
        .attr("fill", "black")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("SATV");

    chart2G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0, "+ (width - 30) + ")")
		.call(xAxis2)
		.append("text")
        .attr("fill", "black")
		.attr("class", "label")
		.attr("x", width - 16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("ACT");

    chart2G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis2)
		.append("text")
        .attr("fill", "black")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("GPA");
	});
