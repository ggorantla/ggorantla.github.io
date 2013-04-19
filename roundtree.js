
var diameter = 700;

var tree = d3.layout.tree()
    .size([360, diameter / 2 - 120])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select('#fig').append("svg")
    .attr("width", diameter + 150)
    .attr("height", diameter + 150)
  .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


function getColor(val){
	  var col = "#4682b4";
    	if(val == "0"){
    		col = "#4682b4";
    	}
    	else if(val == "1"){
    		col = "#ff0000";    		
    	}
    return col;
};

var skills = {};
    
d3.json("skills.json", function(error, root) {
  var nodes = tree.nodes(root),
      links = tree.links(nodes);

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  node.append("circle")
      .attr("r", 4.5)
      .style("fill", function(d){return d.children.length == "0"? "#ffffff":"#696969"; });
      //.style("stroke",function(d){return decideColor(d.isDelta, d.hasDeltaSMP);})
      //.on("mouseover", mouseover)
      //.on("mouseout", mouseout);

  node.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
      .text(function(d) { console.log(d.name+" ;"+d.children.length); return d.name; })
      .style("fill",function(d){return d.progress == "1"? "orange":"#000000"; });
      //.on("mouseover", mouseover)
      //.on("mouseout", mouseout);

});

d3.select(self.frameElement).style("height", diameter - 150 + "px");

function mouseover(d) {

  if(d.level == 2){  
    var txt = "Key Intent: "+d.name +"<br>";
    txt = txt + "Status: "+(d.keyIsDelta == "true"?"Absent in Campaign":"Present in Campaign")+"<br>";
    txt = txt + "Synonym+Mispellings+Pluarals additions:"+(d.hasDeltaSMP? "Yes":"No")+"<br>";
    txt = txt + "Additional Mispellings: "+d.deltaMisspellings+"<br>";
    txt = txt + "Additional Plurals: "+d.deltaPlurals+"<br>";
    txt = txt + "Additional Synonyms: "+d.deltaSynonyms+"<br>";
    
    //if(d.deltaMisspellings.size>0)
    //  txt = txt + "Additional Synonyms: "+d.deltaSynonyms+"<br>";
    //else
    //  txt = txt + "Additional Mispellings: None <br>";
  }

  if(d.level == 1){
    var txt = "Topic : "+d.name+"<br>";
    txt = txt + "Additional Intents Present: "+"No";
  }
  
//  d3.select("#info").text(txt);
document.getElementById("nodeDetails").innerHTML = txt;

}

function mouseout(d) {
  svg.selectAll("path.link.source-" + d.key)
      .classed("source", false)
      .each(updateNodes("target", false));

  svg.selectAll("path.link.target-" + d.key)
      .classed("target", false)
      .each(updateNodes("source", false));
}
