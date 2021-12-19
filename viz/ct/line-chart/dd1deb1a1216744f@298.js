// https://observablehq.com/@vega/multi-series-line-chart-with-tooltip@298
import define1 from "./7764a40fe6b83ca1@427.js";
import define2 from "./45e5909f35596963@476.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const country = urlParams.get('country')
const type = urlParams.get('type')
let file = "https://chikakoto.github.io/viz/ct/line-chart/files/producer_price/producer_price_" + country + ".csv";
let label = ["Cereals", "Citrus Fruit", "Coarse Grain", "Fruit", "Meat", "Milk", "Pulses", "Roots and Tubers", "Treenuts", "Vegetables"]
if (type == 1) {
  file = "https://chikakoto.github.io/viz/ct/line-chart/files/consumer_price/consumer_price_" + country + ".csv";
  label = ["Food Indices", "General Indices"]
} else if (type == 2) {
  file = "https://chikakoto.github.io/viz/ct/line-chart/files/annual_growth/annual_growth_" + country + ".csv"
  label = ["Annual growth %"]
}

//
export default function define(runtime, observer) {
  const main = runtime.module();
  
  main.variable(observer("chart")).define("chart", ["vl","width"], function(vl,width)
{
  // The selection
  const hover = vl.selectSingle("hover")
    .on("mouseover")
    .encodings("x")
    .nearest(true)
    .clear("moouseout")
    .init({ x: { year: 2005, month: 1, date: 1 } });
  
  // The line and point marks. Notice how we filter the points on hover
  const lineAndPoint = vl.layer(
    vl.markLine(),
    vl.markPoint()
      .transform(vl.filter(hover))
  ).encode(
    vl.y().fieldQ("price"),
    vl.color().fieldN("symbol")    
  );
    
  var arr = [vl.fieldT("date")]
  arr = arr.concat(label)
    
  // The rule helps as a proxy for the hover. We draw rules all over the chart
  // so we can easily find the nearest one. We then hide them using opacity 0
  const rule =vl.markRule({ strokeWidth: 0.5, tooltip: true })
    // We pivot the data so we can show all the stock prices at once
    .transform(
      // vl.filter("datum.country == 'Afghanistan'" ),
      vl.pivot("symbol").value("price").groupby(["date"])
    )
    .encode(
      vl.opacity().value(0).if(hover, vl.value(0.7)),
      vl.tooltip(arr)
    )    
    .select(hover);
 
  return vl
    .layer(lineAndPoint, rule )
    .encode(vl.x().fieldT("date"))
    .data(file)
    .width(width - 200)
    .height(300)
    .render();
}
);

  const child1 = runtime.module(define1);
  main.import("vl", child1);
  const child2 = runtime.module(define2);
  main.import("vegaDataViewer", child2);
  return main;
}
