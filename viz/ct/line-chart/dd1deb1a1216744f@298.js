// https://observablehq.com/@vega/multi-series-line-chart-with-tooltip@298
import define1 from "./7764a40fe6b83ca1@427.js";
import define2 from "./45e5909f35596963@476.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const country = urlParams.get('country')
const file = "./files/test.csv"
const jsonFile = "input.json"
//console.log(file)
// const input = file.files[0];
//const reader = new FileReader();
//csv = reader.readAsText(file);
//console.log(csv)

//
function readTextFile(file)
{
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4)
    {
      if(rawFile.status === 200 || rawFile.status == 0)
      {
        var allText = rawFile.responseText;
        var arr = csv_To_Array(allText).filter(d => d.country == country )
        var json = JSON.stringify(arr)
        
        var fs = require('fs');
        fs.writeFile (jsonFile, json, function(err) {
          if (err) throw err;
            console.log('complete');
          }
        );
        // var data = json.filter(function (entry) {
        //   console.log(country)
        //   return entry.country == country
        // })
        console.log(json);
      }
    }
  }
  rawFile.send(null);
}

// readTextFile( file );

function csv_To_Array(str, delimiter = ",") {
  const header_cols = str.slice(0, str.indexOf("\n")).split(delimiter);
  const row_data = str.slice(str.indexOf("\n") + 1).split("\n");
  const arr = row_data.map(function (row) {
    const values = row.split(delimiter);
    const el = header_cols.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
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
      vl.tooltip([vl.fieldT("date"), "Africa", "Americas", "Asia", "Europe", "Oceania"])
    )    
    .select(hover);
 
  return vl
    .layer(lineAndPoint, rule )
    .encode(vl.x().fieldT("date"))
    .data(file)
    .width(width - 150)
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
