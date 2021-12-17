// https://observablehq.com/@toltman/aiddata-world-map@319
import define1 from "./450051d7f1174df8@254.js";
import define2 from "./a33468b95d0b15b0@808.js";
import define3 from "./e93997d5089d7165@2303.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const type = urlParams.get('type')
let url = "./files/import.csv"
let trade = "Import"
if (type == 1) {
  url = "./files/export.csv"
  trade = "Export"
}

export default function define(runtime, observer) {  
  const main = runtime.module();
  const fileAttachments = new Map([["countries-110m.json",new URL("./files/5b7bb44872469fc6f9f4256d902fba909728666ad0d5263654ce95f4470ec90527fdc39a1d1b70490f457d65c31795d651a4afc0745f72351916e715fddc7352",import.meta.url)],["aiddata.csv",new URL(url,import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
//   main.variable(observer()).define(["md"], function(md){return(
// md`# Trade and Price World Map`
// )});
//   main.variable(observer()).define(["md"], function(md){return(
// md`The dataset comes from the [FAO](https://www.fao.org/faostat/en/#data).`
// )});
//   main.variable(observer()).define(["md"], function(md){return(
// md`Import Value Base Price is calculated as the total price of import value in a given year.

// *Mouse over the countries to see values.*
// `
//   )
//   });

  main.variable(observer("viewof year")).define("viewof year", ["Scrubber","years"], function(Scrubber,years){return(
Scrubber(years, {
  delay: 250,
  loop: false,
  initial: 2013,
  autoplay: false
})
)});
  main.variable(observer("year")).define("year", ["Generators", "viewof year"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","countries","path","year","cScale","showToolTip"], function(d3,width,height,countries,path,year,cScale,showToolTip)
{
  const svg = d3.create("svg").attr("viewBox", `0, 0, ${width}, ${height}`)
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
  
  svg.selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "#111")
    .attr("stroke-width", 0.5)
    .attr("fill", d => d.properties.data?.get(year) 
          ? cScale(d.properties.data.get(year)[0].net_donations) 
          : "lightgrey")
    .on("mouseover", function(event, d) {
      let text = d.properties.name
      let country = text
      const donations = d.properties.data.get(year)[0].donations
      const receipts = d.properties.data.get(year)[0].receipts
      
      if (donations > 0) {
        text = text + "\n"+trade+" Value Base Price: " + d3.format("$0.2s")(donations).replace(/G/, "B")
      }
    
      if (receipts > 0) {
        text = text + "\nReceipts: " + d3.format("$0.2s")(receipts).replace(/G/, "B")
      }
      
      showToolTip(text, [event.pageX, event.pageY])
    })
    .on("mousemove", function(event) {
      d3.select(".tooltip")
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px")
    })
    .on("mouseout", function() {
      d3.select(".tooltip").style("visibility", "hidden")
    })
    .on("click", function (event, d) {
      let country = d.properties.name
      window.parent.changeCountry(country);
    })
  
    
  return svg.node()
}
);
  main.variable(observer()).define(["legend","cScale"], function(legend,cScale){return(
legend({
  color: cScale,
  title: "Export Value Base Period Price",
  tickFormat: t => "$" + t/1e9 + "B",
  ticks: 5,
  width: 500
})
)});
//   main.variable(observer()).define(["html"], function(html){return(
// html`<small>
// <b>Note:</b> Countries not present in the dataset for the year selected are shown in grey. I use current country names and borders for the map, so countries with changing names and border may not be represented in all years. Additionally, several countries are not represented because their name is not consistent between datasets. This may be fixed in a future update.
// </small>`
// )});
  main.variable(observer()).define(["md"], function(md){return(
md`## Appendix`
)});
  main.variable(observer("showToolTip")).define("showToolTip", ["d3"], function(d3){return(
(text, coords) => {
  d3.select(".tooltip")
    .text(text)
    .style("top", coords[1] + "px")
    .style("left", coords[0] + "px")
    .style("visibility", "visible");
}
)});

  main.variable(observer("cScale")).define("cScale", ["d3","data"], function(d3,data){return(
d3.scaleSqrt()
  .domain([
   // d3.min(data, d => d.net_donations), 
    0,
    d3.max(data, d => d.net_donations)])
  .range([0, 1])
  .interpolate((a, b) =>  // a < 0 
              // ? t => d3.interpolateReds(1-t) 
                t => d3.interpolateBlues(t))
)});
  main.variable(observer("height")).define("height", ["d3","projection","width","outline"], function(d3,projection,width,outline)
{
  const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
  const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
  projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
  return dy;
}
);
  main.variable(observer("outline")).define("outline", function(){return(
{ type: "Sphere" }
)});
  main.variable(observer("projection")).define("projection", ["d3"], function(d3){return(
d3.geoNaturalEarth1()
)});
  main.variable(observer("path")).define("path", ["d3","projection"], function(d3,projection){return(
d3.geoPath(projection)
)});
  main.variable(observer("countries")).define("countries", ["d3","data","topojson","world"], function(d3,data,topojson,world)
{
  // group entities by name and year
  const entities = d3.group(data, d => d.country, d => d.year);
  
  // attach data to each country in properties
  const countries = topojson.feature(world, world.objects.countries);
  countries.features.forEach(country => {
    country.properties.data = entities.get(country.properties.name);
  })
  
  return countries
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("aiddata.csv").text(), d => {
  if (d.country === "United States") {
    d.country = "United States of America"
  }
  return {
    country: d.country,
    year: +d.year,
    donations: +d.donations,
    receipts: +d.receipts,
    net_donations: +d.net_donations }
})
)});
  main.variable(observer("years")).define("years", ["data"], function(data){return(
Array.from(new Set(data.map(d => d.year).sort()))
)});
  main.variable(observer("world")).define("world", ["FileAttachment"], async function(FileAttachment){return(
await FileAttachment("countries-110m.json").json()
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("legend", child2);
  const child3 = runtime.module(define3);
  main.import("slider", child3);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  main.variable(observer("styles")).define("styles", ["html"], function(html){return(
html`
  <style>

  .tooltip {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple   Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background: rgba(69,77,93,.9);
    border-radius: .1rem;
    color: #fff;
    display: block;
    font-size: 11px;
    max-width: 320px;
    padding: .2rem .4rem;
    position: absolute;
    text-overflow: ellipsis;
    white-space: pre;
    z-index: 300;
    visibility: hidden;
  }


  </style>`
)});
  return main;
}
