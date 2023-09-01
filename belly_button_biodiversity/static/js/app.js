// set url 
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'
// get name function for selecting names from data and making dropdown menu and initializing plot
function get_name() {
    var dropdown_menu = d3.select('#selDataset');
    d3.json(url)
        .then(subject => subject.names
            .forEach(name => dropdown_menu
                .append('option')
                .text(name)
                .property('value'),
                get_metadata(subject.names[0]),
                get_bar(subject.names[0]),
                get_bubble(subject.names[0]),
                get_gauge(subject.names[0])
            ),
        );
};

// option change function
function optionChanged(id) {
    get_metadata(id);
    get_bar(id);
    get_bubble(id);
    get_gauge(id);
};
// ----------------------------------------------------------------------------------------------

// Demographic Info -----------------------------------------------------------------------------
function get_metadata(id) {
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
get_name();
// ----------------------------------------------------------------------------------------------

// Bar chart ------------------------------------------------------------------------------------
function get_bar(id) {
    d3.json(url)
      .then(data => {
        const sortedSample = data.samples.filter(sample => sample.id === id)[0];
        const barTrace = {
          x: sortedSample.sample_values.slice(0, 10).reverse(),
          y: sortedSample.otu_ids.slice(0, 10).map(otuid => `OTU ${otuid}`).reverse(),
          text: sortedSample.otu_labels.slice(0, 10).reverse(),
          hovertemplate:"<b>%{yaxis.title.text}:</b> %{y}<br>"+
          "<b>%{xaxis.title.text}:</b> %{x}<br>"+
          "<b>Bacteria:</b> %{text}"+
          "<extra></extra>",
          hovermode: "closest",
          hoverlabel: { font: { size: 12 ,color: "#151518", family: "calibri"},bgcolor: "#f2f2f2",bordercolor:"#71594d"},
          marker: {
            color: '#c83026',
            opacity: 0.7,
          },
          type: 'bar',
          orientation: 'h'
        };
  
        Plotly.newPlot('bar', [barTrace], {
          title: {text: `Top 10 Operational Taxonomic Units`,font: { size: 16, color: '#22666a', family: 'calibri'}},
          height: 400,
          width: 600,
          xaxis: {
            tickwidth: 10,
            tickcolor: '#ffffff',
            tickfont: { family: 'calibri', color: 'black' },
            title: {text: "Sample Values", font: {size: 14, color: '#151518', family: 'calibri'}}
          },
          yaxis: {
            automargin: true,
            tickwidth: 20,
            tickcolor: '#71594d',
            tickfont: { family: 'calibri', color: '#71594d'},
            title: {text: 'Operational Taxonomic Units',font: {size: 14, color: '#151518', family: 'calibri'}}
          },
          margin: {l: 50, r: 50, b: 50, t: 20, pad: 0
          }
        });
      });
  }  
// ----------------------------------------------------------------------------------------------

// Bubble chart ---------------------------------------------------------------------------------
function get_bubble(id) {
  d3.json(url).then(data => {
    const sortedSample = data.samples.filter(sample => sample.id === id)[0];
    const bubbleTrace = {
      x: sortedSample.otu_ids,
      y: sortedSample.sample_values,
      text: sortedSample.otu_labels,
      hovertemplate:"<b>%{xaxis.title.text}:</b> %{x}<br>"+
          "<b>%{yaxis.title.text}:</b> %{y}<br>"+
          "<b>Bacteria:</b> %{text}"+
          "<extra></extra>",
      hovermode: "closest",
      hoverlabel: { font: { size: 12 ,color: "#151518", family: "calibri"},bgcolor: "#ffffff",bordercolor:"#71594d"},
      mode: 'markers',
      marker: {
        size: sortedSample.sample_values,
        color: sortedSample.otu_ids,
        colorscale: 'RdBu',
        opacity: 0.7,
        line: {
          color: '#71594d',
          width: 0.5
        }
      }
    };
    Plotly.newPlot('bubble',[bubbleTrace],{
        plot_bgcolor: "#f2f2f2",
        paper_bgcolor: "#f2f2f2",
        title: {text: `Belly Button Biodiversity`,font: { size: 16, color: '#22666a', family: 'calibri'}},
        height: 750,
        width: 1100,
        xaxis: {
          tickfont: { family: 'calibri', color: '#71594d'},
          title: {text: 'Operational Taxonomic Units',font: {size: 14, color: '#151518', family: 'calibri'}}
        },
        yaxis: {
          automargin: true,
          tickfont: { family: 'calibri', color: '#71594d'},
          title: {text: 'Sample Values',font: {size: 14, color: '#151518', family: 'calibri'}}
        },
        margin: {l: 50, r: 50, b: 70, t: 50, pad: 0}
        });
  });
}
// ----------------------------------------------------------------------------------------------

// Gauge chart ----------------------------------------------------------------------------------
function get_gauge(id) {
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
