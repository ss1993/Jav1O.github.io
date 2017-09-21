//Margenes del elemento svg

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//Generacion escalas ordinales para variable anios

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

//Generacion escala lineal para variables homicidios

var y = d3.scale.linear()
    .range([height, 0]);

// Color para tipo de homicidio

var color = d3.scale.ordinal()
    .range(["#98abc5", "#a05d56"]);


//Creacion ejes x,y

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".%"));


//Generacion elemento svg

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Cargar los datos

//Podrias hacer uso de las Arrow Functions de ES6 para mejorar la legibilidad del código
d3.csv("/static/data/data.csv", (error, data) => {
  if (error) throw error;

  var ageNames = d3.keys(data[0]).filter(key => key !== "State");

  data.forEach(d => {
    d.ages = ageNames.map(name => ({name: name, value: +d[name]}) );
  });

  x0.domain(data.map(d => d.State ));
  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, d => d3.max(d.ages, d => d.value ))]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

  var state = svg.selectAll(".state")
      .data(data)
      .enter().append("g")
      .attr("class", "state")
      .attr("transform", d => `translate(${x0(d.State)},0)`); // Aquí puedes hacer uso de los string con `` para interpolar valores

  state.selectAll("rect")
      .data(function(d) { return d.ages; })
      .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(ageNames.slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size","20px")
      .text(d => d);

});
