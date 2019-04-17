// Samuel Shapiro & Nick Patel

var width = 1000;
var height = 600;

var lastSelectedDot = 5000;
var circleBorder = d3.rgb("#606060");

var xAxisValArr = ["ACT Median", "SAT Average", "Admission Rate", "Average Faculty Salary",
    "Average Family Income", "Mean Earnings 8 years After Entry", "Median Family Income",
    "Median Debt on Graduation"]

// Variable to represent the name of the currently selected axis
var selectedXAxisName = "Average Family Income";

d3.csv("colleges.csv", function(csv) {
    for (var i = 0; i < csv.length; ++i) {
        csv[i]["Average Cost"] = Number(csv[i]["Average Cost"]);
        csv[i]["ACT Median"] = Number(csv[i]["ACT Median"]);
        csv[i]["SAT Average"] = Number(csv[i]["SAT Average"]);
        csv[i]["Admission Rate"] = Number(csv[i]["Admission Rate"]);
        csv[i]["Average Faculty Salary"] = Number(csv[i]["Average Faculty Salary"]);
        csv[i]["Average Family Income"] = Number(csv[i]["Average Family Income"]);
        csv[i]["Mean Earnings 8 years After Entry"] = Number(csv[i]["Mean Earnings 8 years After Entry"]);
        csv[i]["Median Family Income"] = Number(csv[i]["Median Family Income"]);
        csv[i]["Median Debt on Graduation"] = Number(csv[i]["Median Debt on Graduation"]);
    }

    var avgCostExtent = d3.extent(csv, function(row) { return row["Average Cost"]; });
    var actMedExtent = d3.extent(csv, function(row) { return row["ACT Median"]; });
    var satAvgExtent = d3.extent(csv, function(row) { return row["SAT Average"]; });
    var admRateExtent = d3.extent(csv, function(row) { return row["Admission Rate"]; });
    var avgFacSalExtent = d3.extent(csv, function(row) { return row["Average Faculty Salary"]; });
    var avgFamIncExtent = d3.extent(csv, function(row) { return row["Average Family Income"]; });
    var meanEarn8Extent = d3.extent(csv, function(row) { return row["Mean Earnings 8 years After Entry"]; });
    var medFamIncExtent = d3.extent(csv, function(row) { return row["Median Family Income"]; });
    var medDebtGradExtent = d3.extent(csv, function(row) { return row["Median Debt on Graduation"]; });


    // Axis scale setup
    var yScale = d3.scaleLinear().domain(avgCostExtent).range([570, 30]);
    var xScaleAct = d3.scaleLinear().domain(actMedExtent).range([50, 970]);
    var xScaleSat = d3.scaleLinear().domain(satAvgExtent).range([50, 970]);
    var xScaleAdm = d3.scaleLinear().domain(admRateExtent).range([50, 970]);
    var xScaleFac = d3.scaleLinear().domain(avgFacSalExtent).range([50, 970]);
    var xScaleFamAvg = d3.scaleLinear().domain(avgFamIncExtent).range([50, 970]);
    var xScaleMean8 = d3.scaleLinear().domain(meanEarn8Extent).range([50, 970]);
    var xScaleFamMed = d3.scaleLinear().domain(medFamIncExtent).range([50, 970]);
    var xScaleDebt = d3.scaleLinear().domain(medDebtGradExtent).range([50, 970]);

    // Axis setup
    var yAxis = d3.axisLeft().scale(yScale);
    var xAxisAct = d3.axisBottom().scale(xScaleAct);
    var xAxisSat = d3.axisBottom().scale(xScaleSat);
    var xAxisAdm = d3.axisBottom().scale(xScaleAdm);
    var xAxisFac = d3.axisBottom().scale(xScaleFac);
    var xAxisFamAvg = d3.axisBottom().scale(xScaleFamAvg);
    var xAxisMean8 = d3.axisBottom().scale(xScaleMean8);
    var xAxisFamMed = d3.axisBottom().scale(xScaleFamMed);
    var xAxisDebt = d3.axisBottom().scale(xScaleDebt);

    /*
     *
     * BEGINNING OF CODE FOR FIRST GRAPH
     *
     */


    // Variables to represent the currently selected axis and axis scale
    var selectedXAxisScale = xScaleFamAvg;
    var selectedXAxis = xAxisFamAvg;

    // Create SVGs and <g> elements as containers for charts
    var chart1G = d3.select("#chart1")
                    .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height)
                    .append('g');


    function hasField(d, field) {
        return (d[field] == 0 ? "No value given" : d[field]);
    }

	// Add scatterplot points
    var temp1 = chart1G.selectAll("circle")
	    .data(csv)
	    .enter()
	    .append("circle")
        .classed("dot1", true)
	    .attr("id", function(d, i) { return "g1-" + i; } )
        .attr("stroke", circleBorder)
        .attr("stroke-width", 2)
        .attr("fill", "white")
        .attr("fill-opacity", 0)
	    .attr("cx", function(d) { 
            return selectedXAxisScale(d[selectedXAxisName]);
        })
	    .attr("cy", function(d) { 
            return yScale(d["Average Cost"]);
        })
	    .attr("r", function(d) {
            return (d[selectedXAxisName] == 0 || d["Average Cost"] == 0) ? 0 : 5;
        })
        .on("mouseenter", function(d) {
            d3.select(this).classed('hovered', true);
        })
        .on("mouseleave", function(d) {
            d3.select(this).classed('hovered', false);
        })
	    .on("click", function(d, i) {
            if (lastSelectedDot != 5000) {
                d3.select("#g1-" + lastSelectedDot).classed("selected", false);
            }
            d3.select("#g1-" + i).classed("selected", true);
            d3.select("#name").text(d.Name);
            d3.select("#avgCost").text(function(k) { return hasField(d, "Average Cost"); });
            d3.select("#actMed").text(function(k) { return hasField(d, "ACT Median"); });
            d3.select("#satAvg").text(function(k) { return hasField(d, "SAT Average"); });
            d3.select("#admRate").text(function(k) { return hasField(d, "Admission Rate"); });
            d3.select("#avgFacSal").text(function(k) { return hasField(d, "Average Faculty Salary"); });
            d3.select("#avgFamInc").text(function(k) { return hasField(d, "Average Family Income"); });
            d3.select("#meanEarn8").text(function(k) { return hasField(d, "Mean Earnings 8 years After Entry"); });
            d3.select("#medFamInc").text(function(k) { return hasField(d, "Median Family Income"); });
            d3.select("#medDebtGrad").text(function(k) { return hasField(d, "Median Debt on Graduation"); });
            lastSelectedDot = i;
        });


    // Add x-axis
    chart1G
        .append("g") // create a group node
        .attr("id", "xaxis")
        .attr("transform", "translate(0, "+ (height - 30) + ")")
		.call(selectedXAxis) // call the axis generator
        .append("text")
        .attr("id", "xaxistitle")
        .attr("fill", "black")
		.attr("class", "label")
		.attr("x", width - 16)
		.attr("y", -6)
		.style("text-anchor", "end")
        .text(selectedXAxisName + " (USD)")
        .attr("font-weight", "bold");

    // Add y-axis
    chart1G
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
        .text("Average Cost (USD)")
        .attr("font-weight", "bold");


    // Add dropdown menu
    var select = d3.select("#wrapper")
        .append("select")
        .attr("id", "xaxislabel")
        .attr("class", "xaxisdropdown")
        .style("border", "1px solid black")
        .on('change', chart1OnChange)

    // Fill dropdown with colors
    var options = select
        .selectAll('option')
    	.data(xAxisValArr).enter()
    	.append('option')
        .text(d => d)
        .property("selected", function(d) { return d === "Average Family Income"; });

    // Function to change selected color if dropdown selection is changed
    function chart1OnChange() {
        selectedXAxisName = d3.select("#xaxislabel").property("value");
        switch (d3.select("#xaxislabel").property("value")) {
            case "ACT Median":
                selectedXAxisScale = xScaleAct;
                selectedXAxis = xAxisAct;
                break;
            case "SAT Average":
                selectedXAxisScale = xScaleSat;
                selectedXAxis = xAxisSat;
                break;
            case "Admission Rate":
                selectedXAxisScale = xScaleAdm;
                selectedXAxis = xAxisAdm;
                break;
            case "Average Faculty Salary":
                selectedXAxisScale = xScaleFac;
                selectedXAxis = xAxisFac;
                break;
            case "Average Family Income":
                selectedXAxisScale = xScaleFamAvg;
                selectedXAxis = xAxisFamAvg;
                break;
            case "Mean Earnings 8 years After Entry":
                selectedXAxisScale = xScaleMean8;
                selectedXAxis = xAxisMean8;
                break;
            case "Median Family Income":
                selectedXAxisScale = xScaleFamMed;
                selectedXAxis = xAxisFamMed;
                break;
            case "Median Debt on Graduation":
                selectedXAxisScale = xScaleDebt;
                selectedXAxis = xAxisDebt;
                break;
            default:
                selectedXAxisScale = xScaleFamAvg;
                selectedXAxis = xAxisFamAvg;
        }
    }

    var xAxisButton = d3.select("#wrapper")
        .append("button")
        .attr("class", "xaxisbutton")
        .style("border", "1px solid black")
        .text("Apply New x-Axis")
        .on("click", function() {
            // Adjusts x axis and axis label
            chart1G.select("#xaxis")
                .transition()
                .duration(d => 1000)
                .call(selectedXAxis);

            chart1G.select("#xaxistitle")
                .transition()
                .duration(d => 1000)
                .text(function(d) {
                    var retName = selectedXAxisName;
                    if (retName == "ACT Median" || retName == "SAT Average") {
                            retName += " (Points)";
                    } else if (retName == "Admission Rate") {
                        retName += " (%)";
                    } else {
                        retName += " (USD)";
                    }
                    return retName;
                });

            // Moves every dot to new spot on adjusted x axis
            chart1G.selectAll(".dot1")
                .transition()
                .duration(function(d) {
                    return Math.random() * 1300;
                })
                .attr('cx', function(d) {
                    return selectedXAxisScale(d[selectedXAxisName]);
                })
                .attr('r', function(d) {
                    return (d[selectedXAxisName] == 0 || d["Average Cost"] == 0) ? 0 : 5;
                });
        });

    /*
     * 
     * END OF CODE FOR FIRST GRAPH
     * 
     */
});
