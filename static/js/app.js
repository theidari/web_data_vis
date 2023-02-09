const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

function getName() {
    // Select dropdown menu id and assign it to a variable
    var dropdownMenu = d3.select('#selDataset');
    // Read "names" values from json file and append into dropdown menu
    d3.json(url)
        .then(subject => subject.names
            .forEach(name => dropdownMenu
                .append('option')
                .text(name)
                .property('value'),

                // Initialize page with default metadata and plots   
                getMetadata(subject.names[0]),
                getBar(subject.names[0]),
                getGauge(subject.names[0])
            ),
        );
};

// Function called by DOM changes
function optionChanged(id) {
    getMetadata(id);
    getBar(id);
    getGauge(id);
};

// -------------------------------- Demographic Info -----------------------------------------------
function getMetadata(id) {
    // Read "metadata" from json file for each subject and assign it to a variable
    d3.json(url)
    .then(({ metadata }) => {
      const subjectData = metadata.find(subject => subject.id.toString() === id);
      const subjectMetadata = d3.select('#sample-metadata');
      subjectMetadata.html('');
  
      const table = subjectMetadata.append('table');
      const tbody = table.append('tbody');
  
      Object.entries(subjectData).forEach(([key, value]) => {
        const tr = tbody.append('tr').style("width", "220px");
        tr.append('td').html(`<span class="panel-keys">${key}:</span>`);
        tr.append('td').html(`<span class="panel-values">${value}</span>`).style("text-align", "right")
        .style("width", "220px");
      });
    });
  };
getName();
// ----------------------------------------------------------------------------------------------
// Bar chart
function getBar(id) {
    d3.json(url)
      .then(data => {
        const sortedSample = data.samples.filter(sample => sample.id === id)[0];
        const barTrace = {
          x: sortedSample.sample_values.slice(0, 10).reverse(),
          y: sortedSample.otu_ids.slice(0, 10).map(otuid => `OTU ${otuid}`).reverse(),
          text: sortedSample.otu_labels.slice(0, 10).reverse(),
          hoverlabel: { font: { size: 10 } },
          marker: {
            color: '#c83026',
            opacity: 0.7,
          },
          type: 'bar',
          orientation: 'h'
        };
  
        Plotly.newPlot('bar', [barTrace], {
          title: {text: `Top 10 Operational Taxonomic Units`,font: { size: 16, color: '#22666a', family: 'calibri'}},
          height: 500,
          width: 600,
          xaxis: {
            tickwidth: 10,
            tickcolor: '#ffffff',
            tickfont: { family: 'calibri', color: 'black' },
            title: {text: "Sample Values", font: {size: 16, color: '#22666a', family: 'calibri'}}
          },
          yaxis: {
            automargin: true,
            tickwidth: 20,
            tickcolor: '#71594d',
            tickfont: { family: 'calibri', color: '#71594d'},
            title: {text: 'Operational Taxonomic Units',font: {size: 16, color: '#22666a', family: 'calibri'}}
          }
        });
      });
  }  
// ----------------------------------------------------------------------------------------------
// Gauge chart ----------------------------------------------------------------------------------
function getGauge(id) {
    d3.json(url)
        .then(data => {
            var subjectData = data.metadata.filter(subject => subject.id.toString() === id)[0];
            var value = subjectData.wfreq;

            var data = [{
                domain: { x: [0, 1], y: [0, 1] },
                type: 'indicator',
                mode: 'gauge+number+delta',
                value: value,
                title: { text: 'Washing Frequency<br>(Belly Button Scrubs per Week)', font: { size: 16, color: '#22666a', family: 'calibri' } },
                delta: { reference: 2.83, increasing: { color: "#5aa9b5" } },
                gauge: {
                    axis: { range: [0, 9], tickwidth: 1, tickcolor: '#71594d', tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], nticks:9},
                    bar: { color: "#c83026", thickness: 0.2 },
                    borderwidth: 1,
                    bordercolor: "#71594d",
                    steps: [
                        { range: [0   , 2.35], color: "#f2f2f2" },
                        { range: [2.35, 2.83], color: "#9d3d3650" },
                        { range: [2.83, 3.31], color: "#5aa9b550" },
                        { range: [3.31, 9   ], color: "#f2f2f2" },
                    ],
                    threshold: { line: { color: "ffa600", width: 2 }, thickness: 1, value: 2.83 }
                }
            }];
            var layout = { width: 350, height: 330,
                margin: { t: 0, r: 20, l: 20, b: 0 },
                font: { size: 14, color: '151518', family: 'calibri' }
            };
            Plotly.newPlot('gauge', data, layout);
        });
};
// ----------------------------------------------------------------------------------------------
