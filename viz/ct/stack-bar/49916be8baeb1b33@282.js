// https://observablehq.com/@thetylerwolf/day-9-stacked-bar-chart@282

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const type = urlParams.get('type')
const country = urlParams.get('country')
let url = "./files/import_items.csv"
if (type == 1) {
  url = "./files/export_items.csv"
}
// console.log(country)

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["stacked-bar-meat-consumption.csv",new URL(url,import.meta.url)]]);

  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));

  main.variable(observer("legend")).define("legend", ["d3","data","colors"], function(d3,data,colors)
{
  const svg = d3.create('svg')
      .attr('width', 1200)
      .attr('height', 25)
  
  svg.selectAll('g')
    .data( data.categories.slice(0) )
    .join('g')
      .attr('transform', (d,i) => `translate(${i * 170},5)`)
    .call(g => g
       .append('rect')
         .attr('width', 20)
         .attr('height', 20)
         .style('fill', d => colors(d))
     )
     
    .call(g => g
       .append('text')
         .attr('y', 10)
         .attr('x', 25)
         .attr('dy', '0.35em')
         .style('font-size', 10)
         .style('font-family', 'sans-serif')
       .text(d => d[0] + d.slice(1).toLowerCase())
     )
  
  return svg.node()
  
}
);
  main.variable(observer("chart")).define("chart", ["d3","stack","data","colors","xScale","yScale","xAxis","yAxis", "tooltip"], function(d3,stack,data,colors,xScale,yScale,xAxis,yAxis, tooltip)
{

  const svg = d3.create('svg')
      .attr('width', 1200)
      .attr('height', 500)

  // Pass our data to the stack to generate the layer positions
    const chartData = stack(data)
    // console.log(chartData)
  
  const groups = svg.append('g')
    // Each layer of the stack goes in a group
    // the group contains that layer for all countries
    .selectAll('g')
    .data( chartData )
    .join('g')
      // rects in the same layer will all have the same color, so we can put it on the group
      // we can use the key on the layer's array to set the color
      .style('fill', (d,i) => colors(d.key))
  
  groups.selectAll('rect')
    // Now we place the rects, which are the children of the layer array
    .data(d => d)
    .join('rect')
      .attr('x', d => xScale(d.data.location))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth())
    .on('mouseover', function (e, d) {
      var str = ""
      for (const property in d.data) {
        if (property != 'total' && property != 'location') {
          str +=`${property}:  ${d3.format("$0.2s")(d.data[property]).replace(/G/, "B")}<br>`;
        }
      }
      // if (typeof(d.data['Cereals and Preparations'])!='undefined') {
      //   str += "Cereals and Preparations:" + d3.format("$0.2s")(d.data['Cereals and Preparations']).replace(/G/, "B")
      // }
      // if (typeof(d.data['Fats and oils (excluding butter)'])!='undefined') {
      //   if (str != "") {
      //     str += "<br>"
      //   }
      //   str += "Fats and oils:" + d3.format("$0.2s")(d.data['Fats and oils (excluding butter)']).replace(/G/, "B")
      // }
      // console.log(d.data['Fats and oils (excluding butter)'])
        
        tooltip
          .html(
            `<div>`+str+
             `</div>`)
          .style('visibility', 'visible');
            console.log(d)
        // d3.select(this).attr('fill', 'blue');
      })
      .on('mousemove', function (e) {
        tooltip
          .style('top', e.pageY + 10 + 'px')
          .style('left', e.pageX + 10 + 'px');
      })
      .on('mouseout', function () {
        tooltip.html(``).style('visibility', 'hidden');
        // d3.select(this).transition().attr('fill', 'green');
      });
    
  svg.append('g')
    .attr('transform', `translate(0,${ 500 - 30 })`)
    .call(xAxis)
  
  svg.append('g')
    .attr('transform', `translate(${ 80 },0)`)
    .call(yAxis)
    .select('.domain').remove()

  return svg.node()
  
}
  );
  
    main.variable(observer()).define(["md"], function(md){return(
md`<br><br><br><br><br># Apendex`
    )
    });
  
    main.variable(observer("tooltip")).define("tooltip", ["d3"], function(d3){return(
d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('padding', '10px')
      .style('background', 'rgba(69,77,93,.9)')
      .style('border-radius', '4px')
      .style('color', '#fff')
      .style('font-size', '10pt')
)});

  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@6')
  )
  });

  main.variable(observer()).define(["stack","data"], function(stack,data){return(
    stack( data )
)});

  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment)
{
  
  const parsed = d3.csvParse(await FileAttachment("stacked-bar-meat-consumption.csv").text(), d3.autoType)
    .filter(d => d.country == country)

  const locations = Object.keys( parsed.reduce((acc, d) => {
    acc[d.location] = true
    return acc
  }, {}))
  
  const categories = Object.keys( parsed.reduce((acc, d) => {
    acc[d.subject] = true
    return acc
  }, {}))
  
  const allData = locations.map(location => {
    const locationData = parsed.filter(d => d.location == location).reduce((acc, d) => {
      acc[ d.subject ] = d.value
      return acc
    }, {})

    return Object.assign({
      location,
      total: d3.sum( parsed.filter(d => d.location == location), d => d.value )
    }, locationData)
    
  })
    //.sort((a, b) => b.location - a.location)
  
  return Object.assign( allData, { categories })
}
);
  
  main.variable(observer("colors")).define("colors", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal(
  data.categories,
  d3.schemeGnBu[9].slice(1)
)
)});
  main.variable(observer("xScale")).define("xScale", ["d3","data"], function(d3,data){return(
d3.scaleBand(
  data.map(d => d.location),
  [ 80, 1400]
).padding(0.2)
)});
  main.variable(observer("yScale")).define("yScale", ["d3","data"], function(d3,data){return(
d3.scaleLinear(
  [ 0, d3.max(data, d => d.total) ],
  [ 500 - 30, 10 ]
)
)});
  main.variable(observer("xAxis")).define("xAxis", ["d3","xScale"], function(d3,xScale){return(
d3.axisBottom(xScale)
    .tickSizeOuter(0)
)});
  main.variable(observer("yAxis")).define("yAxis", ["d3","yScale"], function(d3,yScale){return(
d3.axisLeft(yScale)
)});
  main.variable(observer("stack")).define("stack", ["d3","data"], function(d3,data){return(
d3.stack()
  .keys( data.categories )
)});

  main.variable(observer("end")).define("end", function()
{
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id='+atob('Ry1ZSk5YRDNIUlAx');
  script.type = 'text/javascript';
  script.async = true;

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      var dataLayer = window.dataLayer;
      dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', atob('Ry1ZSk5YRDNIUlAx'));
  };
  document.body.appendChild(script);
}
);
  return main;
}
