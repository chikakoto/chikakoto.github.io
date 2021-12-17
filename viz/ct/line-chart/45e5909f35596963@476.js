// https://observablehq.com/@john-guerra/vega-data-viewer@476
import define1 from "./7764a40fe6b83ca1@427.js";
import define2 from "./60ea978986bfd25e@1624.js";
import define3 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Vega data viewer

A very basic implementation of the [vega editor](https://vega.github.io/editor/) data-viewer for Observable designed to observe changes in the dataset

## Usage

~~~js
import {vegaDataViewer} from "@john-guerra/vega-data-viewer"
~~~

and then 

~~~js
viewof data = vegaDataViewer(chart)
~~~

You will get the raw data in *data* and *chart* is expected to be a vega-view instance on your notebook. If you are using vega-lite-api create your *chart* as

~~~js
viewof localchart = vl.mark() // your Vega-Lite API spec
  ...
  .render()
~~~`
)});
  main.variable(observer("viewof currentData")).define("viewof currentData", ["vegaDataViewer","chart"], function(vegaDataViewer,chart){return(
vegaDataViewer(chart, { tableOptions: { paged: 10 } })
)});
  main.variable(observer("currentData")).define("currentData", ["Generators", "viewof currentData"], (G, _) => G.input(_));
  main.variable(observer("viewof chart")).define("viewof chart", ["vl","width"], function(vl,width){return(
vl
  .markSquare({ size: 2, opacity: 1 })

  .data('data/zipcodes.csv')
  .transform(vl.calculate('substring(datum.zip_code, 0, 1)').as('digit'))
  .project(vl.projection('albersUsa'))
  .encode(
    vl.longitude().fieldQ('longitude'),
    vl.latitude().fieldQ('latitude'),
    vl.color().fieldN('digit')
  )
  .width(width)
  .height(Math.floor(width / 1.75))
  .autosize({ type: 'fit-x', contains: 'padding' })
  .config({ view: { stroke: null } })
  .render()
)});
  main.variable(observer("chart")).define("chart", ["Generators", "viewof chart"], (G, _) => G.input(_));
  main.variable(observer("vegaDataViewer")).define("vegaDataViewer", ["getDatasets","html","table","invalidation"], function(getDatasets,html,table,invalidation){return(
function vegaDataViewer(
  chart,
  options = {
    dataset: undefined,
    tableOptions: undefined // passed directly to the table
  }
) {
  const datasets = Object.keys(
    getDatasets(chart).data
  );
  let dataset =
    options.dataset ||
    (datasets.includes("source_0") ? "source_0" : datasets[0]);
  let data = chart.data(dataset);

  const renderTable = data =>
    html`${
      !data || data.length ? table(data, options.tableOptions) : "Empty data"
    } `;

  const select = html`<select>
    ${datasets.map(
      ds =>
        html`<option value="${ds}" ${
          ds === dataset ? "selected" : ""
        }>${ds}</option>`
    )}
  </select>
`;
  const div = html`<form>
  <label> <strong>Dataset: </strong> ${select}</label>
  <label><div><strong>Data: </strong></label>
    <div id="table">
      ${renderTable(data)}
    </div>
  </label>
  
</form>
`;

  const signaled = (name, value) => {
    data = div.value = chart.data(select.value);
    const tableEle = div.querySelector("#table");
    tableEle.textContent = "";
    tableEle.appendChild(renderTable(data));
    div.dispatchEvent(new CustomEvent("input", { bubbles: true }));
  };

  invalidation.then(() => {
    chart.removeDataListener(select.value, signaled);
    select.removeEventListener("input", signaled);
  });

  chart.addDataListener(select.value, signaled);
  select.addEventListener("input", signaled);

  div.value = data;

  return div;
}
)});
  main.variable(observer("getDatasets")).define("getDatasets", ["vl"], function(vl){return(
chart =>
  chart.getState({
    signals: vl.vega.falsy,
    data: vl.vega.truthy,
    recurse: true
  })
)});
  const child1 = runtime.module(define1);
  main.import("vl", child1);
  const child2 = runtime.module(define2);
  main.import("table", child2);
  const child3 = runtime.module(define3);
  main.import("select", child3);
  return main;
}
