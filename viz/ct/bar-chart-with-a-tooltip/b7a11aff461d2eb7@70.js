// https://observablehq.com/@anreut/bar-chart-with-a-tooltip@70
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Bar Chart with a tooltip`
)});
  main.variable(observer("data")).define("data", function(){return(
[
  { name: 'apple', price: 100 },
  { name: 'limon', price: 300 },
  { name: 'strawberry', price: 150 },
  { name: 'blueberry', price: 250 },
]
)});
  main.variable(observer("chart")).define("chart", ["d3","svgWidth","svgHeight","graphHeight","graphWidth","data","x","y","tooltip","graphMarginLeft","graphMarginTop","yAxis","xAxis"], function(d3,svgWidth,svgHeight,graphHeight,graphWidth,data,x,y,tooltip,graphMarginLeft,graphMarginTop,yAxis,xAxis)
{
    const svg = d3.create("svg")
      .attr('viewBox', [0, 0, svgWidth, svgHeight])
      .attr('height', svgHeight)
      .attr('width', svgWidth);
  
    const graph = svg
      .append('g')
      .attr('height', graphHeight)
      .attr('width', graphWidth)
      .attr(
        'transform',
        `translate(${(svgWidth - graphWidth) / 2}, ${
          (svgHeight - graphHeight) / 2
        })`,
      );
  
    graph
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('width', x.bandwidth)
      .attr('height', (d) => graphHeight - y(d.price))
      .attr('x', (d) => x(d.name))
      .attr('y', (d) => y(d.price))
      .attr('fill', 'green')
      .on('mouseover', function (e, d, i) {
        tooltip
          .html(
            `<div>${d.name}</div>`)
          .style('visibility', 'visible');

        d3.select(this).attr('fill', 'blue');
      })
      .on('mousemove', function (e) {
        tooltip
          .style('top', e.pageY + 10 + 'px')
          .style('left', e.pageX + 10 + 'px');
      })
      .on('mouseout', function () {
        tooltip.html(``).style('visibility', 'hidden');
        d3.select(this).transition().attr('fill', 'green');
      });
  
    svg
      .append('g')
      .attr(
        'transform',
        `translate(${graphMarginLeft}, ${graphMarginTop})`,
      )
      .call(yAxis);

    svg
      .append('g')
      .attr(
        'transform',
        `translate(${graphMarginLeft}, ${
          svgHeight - graphMarginTop
        })`,
      )
      .call(xAxis);
  
  return svg.node();
}
);
  main.variable(observer("tooltip")).define("tooltip", ["d3"], function(d3){return(
d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('padding', '10px')
      .style('background', 'rgba(0,0,0,0.6)')
      .style('border-radius', '4px')
      .style('color', '#fff')
)});
  main.variable(observer("x")).define("x", ["d3","data","graphWidth"], function(d3,data,graphWidth){return(
d3
    .scaleBand()
    .domain(data.map((it) => it.name))
    .range([0, graphWidth])
    .paddingInner(0.2)
    .paddingOuter(0.2)
)});
  main.variable(observer("y")).define("y", ["d3","maxPrice","graphHeight"], function(d3,maxPrice,graphHeight){return(
d3
      .scaleLinear()
      .domain([0, maxPrice])
      .range([graphHeight, 0])
)});
  main.variable(observer("yAxis")).define("yAxis", ["d3","y"], function(d3,y){return(
d3.axisLeft(y)
)});
  main.variable(observer("xAxis")).define("xAxis", ["d3","x"], function(d3,x){return(
d3.axisBottom(x)
)});
  main.variable(observer("maxPrice")).define("maxPrice", ["d3","data"], function(d3,data){return(
d3.max(data, (d) => d.price)
)});
  main.variable(observer("svgHeight")).define("svgHeight", function(){return(
600
)});
  main.variable(observer("svgWidth")).define("svgWidth", function(){return(
600
)});
  main.variable(observer("graphHeight")).define("graphHeight", function(){return(
500
)});
  main.variable(observer("graphWidth")).define("graphWidth", function(){return(
500
)});
  main.variable(observer("graphMarginLeft")).define("graphMarginLeft", ["svgHeight","graphHeight"], function(svgHeight,graphHeight){return(
(svgHeight - graphHeight) / 2
)});
  main.variable(observer("graphMarginTop")).define("graphMarginTop", ["svgWidth","graphWidth"], function(svgWidth,graphWidth){return(
(svgWidth - graphWidth) / 2
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@^6.2")
)});
  return main;
}
