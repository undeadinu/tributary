
//The config model is the glue that binds together a particular configurtion
//of tributary components
tributary.Config = Backbone.Model.extend({
  defaults: {        
      endpoint: "tributary",
      public: true,
      require: [] //require modules will be like : {name:"crossfilter", url:"/static/lib/crossfilter.min.js"}
  },

  require: function(callback, ret) {
    //load scripts from the require array with require.js
    var modules = this.get("require");
    var scripts = _.pluck(modules, "url");

    var rcb = function() {
      return callback(ret, arguments);
    };
    require(scripts, rcb);
  },

  initialize: function() {
    //convenience event to trigger a hide event on all contexts (and thus their editors)
    this.on("hide", function() {
      this.contexts.forEach(function(context) {
        context.model.trigger("hide");
      });
    }, this);

  }


});

////////////////////////////////////////////////////////////////////////
// Config UI
////////////////////////////////////////////////////////////////////////
tributary.ConfigView = Backbone.View.extend({

  render: function() {
    var that = this;
    //show options for the various renderers (displays)
    d3.select(this.el).append("span")
      .classed("config_title", true)
      .text("Display:");
      

    var displays = d3.select(this.el).append("div")
      .classed("displays", true)
      .selectAll("div.display")
      .data(tributary.displays)
      .enter()
      .append("div")
      .classed("display", true);

    var initdisplay = this.model.get("display");
    displays.each(function(d) {
      console.log(d.name, initdisplay);
      if(d.name === initdisplay) { d3.select(this).classed("display_active",true); }
    });
    displays.append("span")
      .text(function(d) { return d.name; });
    displays.append("span")
      .text(function(d) { return " " + d.description; })
      .classed("description", true);


    displays.on("click", function(d) {
      d3.select(this.parentNode).selectAll("div.display")
        .classed("display_active", false);
      d3.select(this).classed("display_active", true);
      that.model.set("display", d.name);
    });



    //show options for time controls

  }

});

