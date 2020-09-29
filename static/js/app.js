// ----------------Function: Initiate Default Chartz----------------

function main() {
  d3.json("samples.json").then((data) => {
     
    IDs = data.names;

    IDs.forEach((id) => {
      d3.select("#selDataset")
      .append("option")
      .text(id)
      .property("value", id);
    });

    //default subject
    createChartz(IDs[0]);
  });
}

// ----------------Function: Create Chartz----------------

function createChartz(ID) {
  d3.json("samples.json").then((data) => {
    var s = data.samples;
    var ZDaddy = s.filter(object => object.id == ID)[0];
    var sampleValues = ZDaddy.sample_values;
    var otuIDs = ZDaddy .otu_ids;
    var otuLabels = ZDaddy .otu_labels;
    var m = data.metadata;
    var MFizzle= m.filter(object => object.id == ID)[0];
    createBarChart(sampleValues, otuIDs, otuLabels);
    createBubbleChart(sampleValues, otuIDs, otuLabels);
    displayDemographicInfo(MFizzle);
    createGaugeChart(MFizzle);
  });
};

// ----------------Function: Create Bar Chart----------------

function createBarChart(sampleValues, otuIDs, otuLabels) {

  // Top 10 sample values for a selected subject
  var sampleValues10 = sampleValues.slice(0, 10).reverse();

  // The corresponding OTU IDs for the top 10 sample values
  var otuIDs10 = otuIDs.slice(0, 10).reverse().map(id => `OTU ${id}`);

  // otuLabels10 = The corresponding OTU labels for the top 10 sample values
  var otuLabels10 = otuLabels.slice(0, 10).reverse();

  var trace1 = {
    x: sampleValues10,
    y: otuIDs10,
    type: 'bar',
    text: otuLabels10,
    orientation: 'h',
    marker: {
      color: 'rgb(0,0,255)'
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: 'Top 10 Bacteria Cultures Found',
    showlegend: false,
    xaxis: {
      tickangle: -45
    },
    yaxis: {
      zeroline: false,
      gridwidth: 2
    },
    bargap :0.05,
    margin: {l: 75, r: 25, t: 40, b: 100}
  };

    Plotly.newPlot('bar', data, layout);
  
}

// ----------------Function: Create Bubble Chart----------------

function createBubbleChart(sampleValues, otuIDs, otuLabels) {

  var trace1 = {
    x: otuIDs,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
      color: otuIDs,
      size: sampleValues,
      colorscale: 'Jet',
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: 'Bacteria Cultures Per Sample',
    showlegend: false,
    margin: {t:25}
  };
  
  Plotly.newPlot('bubble', data, layout);


}

// ----------------Function: Create Demographics Table----------------

function displayDemographicInfo(metaDataz) {

  var panel = d3.select("#sample-metadata");

  panel.html("");

  Object.entries(metaDataz).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`)
  });  

};


function createGaugeChart(metaDataz) {

  var data = [
    {
      value: metaDataz.wfreq,
      title: { text: "Belly Button Washing Frequency:<br>Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number",
      delta: { reference: 400 },
      gauge: { axis: { range: [null, 9] } }
    }
  ];
  
  var layout = { width: 600, height: 400 };
  Plotly.newPlot('gauge', data, layout);

}

function optionChanged(selectedSubject) {
  createChartz(selectedSubject);
  }

main();

