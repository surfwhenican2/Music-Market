$(function() {

	Parse.$ = jQuery;

	Parse.initialize("WExMK2xE0zaL2b7vfMypKv7GfCgaDGFJQLJoJAm1", 
    	"Unhrs7BicyGIyQnoXIOnpo37ZsZZsngPMe6LDf2s");

	// This is the transient application state, not persisted on Parse
  	var AppState = Parse.Object.extend("AppState", {
   		defaults: {
   		filter: "all"
   		}
  	});

  	var ManageAppView = Parse.View.extend({

      el: ".content",

  		events: {
  			"click .log-out":    "logOut",
	        "click #page-one":   "pageOne",
	        "click #page-two":   "pageTwo",
	        "click #page-three": "pageThree",
	        "click #page-four":  "pageFour",
	        "click #page-five":  "pageFive",
	        "click #page-settings": "pageSettings"
  		},

  		initialize: function() {
  			var self = this;
        
  			_.bindAll(this, 'render', 'logOut', 'pageOne','pageTwo', 'pageThree', 'pageFour', 'pageFive', 'pageSettings');
        this.$el.html(_.template($("#logged-in-view").html()));
        this.render();
  		},

  		logOut: function(e) {
  			Parse.User.logOut();
        console.log("User Logged Out");
  			new LogInView();
  			this.undelegateEvents();

  			delete this;
  		},

  		render: function() {
        this.delegateEvents();
  		},

      pageOne: function(){
        new PageOneView();
        console.log("Loaded Page One View");
      },

      pageTwo: function(){
        new PageTwoView();
        console.log("Loaded Page Two View");
      },

      pageThree: function(){
        new PageThreeView();
        console.log("Loaded Page Three View");
      },

      pageFour: function(){
        new PageFourView();
        console.log("Loaded Page Four View");
      },
      
      pageFive: function() {
	      new PageFiveView();
	      console.log("Loaded Page Five View");
      },
      
      pageSettings: function() {
	      new PageSettingsView();
	      console.log("Loaded Page Settings View");
      }

  	});

    var PageOneView = Parse.View.extend({
      
      events: {

      },

      el: ".main",

      initialize: function() {
        var self = this;
        _.bindAll(this, 'render');
        this.$el.html(_.template($("#page-one-view").html()));
        this.render();
      },

      render: function() {
        this.delegateEvents();
      }

    });

    var PageTwoView = Parse.View.extend({
      
      events: {
      },

      el: ".main",

      initialize: function() {
        var self = this;
        
        _.bindAll(this, 'render', 'addOne', 'addAll', 'render');
        this.$el.html(_.template($("#page-two-view").html()));

 

       this.songs = new SongList;
        var Songs = Parse.Object.extend("Songs");
        var query = new Parse.Query(Songs);
        this.songs = query.collection();

        this.songs.fetch({
  success: function(collection) {
     var liststr;
    collection.each(function(object) {
      //console.warn(object);
      var title = object.get("SongName");
      console.log(title)
      var price = object.get("CurrentPrice");
       liststr += '<li>';
       liststr += title;
       liststr += '<span>       $';
       liststr += price;
       liststr += '</span>';
       liststr += '</li>';
    });
     liststr += "</ul>";
     $('.list').append(liststr);
  },
  error: function(collection, error) {
    console.log(error);
  }
}); 

        this.addAll();
        this.render();
      },

      render: function() {
        this.delegateEvents();
        this.refresh();
      },

      addOne: function(song){
        var view = new SongView({model: song});
        this.$("song-list").append(view.render().el);
      },

      addAll: function(){
        this.$("song-list").html("");
        this.songs.each(this.addOne);

      },

      refresh: function(){
        $('.list').listview();
        $('.list').listview('refresh');
        console.log("Refresh was called");
      }


    });

    var PageThreeView = Parse.View.extend({
      
      events: {

      },

      el: ".main",

      initialize: function() {
        var self = this;
        
        _.bindAll(this, 'render');
        this.$el.html(_.template($("#page-three-view").html()));
        this.render();
      },

      render: function() {
        this.delegateEvents();
      }

    });

    var PageFourView = Parse.View.extend({
      
      events: {
 
      },

      el: ".main",

      initialize: function() {
        var self = this;
        
        _.bindAll(this, 'render');
        this.$el.html(_.template($("#page-four-view").html()));
        this.render();
      },

      render: function() {
        this.delegateEvents();
      }

    });
    
    var PageFiveView = Parse.View.extend({

      events: {
 
      },

      el: ".main",

      initialize: function() {
        var self = this;
        
        _.bindAll(this, 'render');
        this.$el.html(_.template($("#page-five-view").html()));
        this.render();
      },

      render: function() {
        var usdtoeur = ["0","1","2"];

        var chart1 = new Highcharts.StockChart({
          chart: {
            renderTo: 'container'
          },
          rangeSelector: {
            selected: 1
          },
          series: [{
            name: 'USD to EUR',
            data: usdtoeur // predefined JavaScript array
          }]
        });
        this.delegateEvents();
      }

    });
    
    var PageSettingsView = Parse.View.extend({
      
      events: {
 
      },

      el: ".main",

      initialize: function() {
        var self = this;
        
        _.bindAll(this, 'render');
        this.$el.html(_.template($("#page-settings-view").html()));
        this.render();
      },

      render: function() {
        this.delegateEvents();
      }
    });


  var LogInView = Parse.View.extend({

    events: {
      "submit form.login-form": "logIn",
      "submit form.signup-form": "signUp"
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "logIn", "signUp");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      Parse.User.logIn(username, password, {
        success: function(user) {
          new ManageAppView();
          location.reload();
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          this.$(".login-form button").removeAttr("disabled");
        }
      });

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();
      
      Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
        success: function(user) {
          new ManageAppView();
          location.reload();
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".signup-form .error").html(error.message).show();
          this.$(".signup-form button").removeAttr("disabled");
        }
      });

      this.$(".signup-form button").attr("disabled", "disabled");

      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));


      this.delegateEvents();
    }
  });

	var AppView = Parse.View.extend({
    	// Instead of generating a new element, bind to the existing skeleton of
    	// the App already present in the HTML.
    	el: $("#mainapp"),

    	initialize: function() {
      		this.render();
    	},

    	render: function() {
    		if (Parse.User.current()) {
    			console.log("Parse User Logged In");
    	    new ManageAppView();
      	} else {
        	new LogInView();
        	console.log("Login In View Loaded");
      	}
    	}
  	});

  var Song = Parse.Object.extend("Song", {

    defaults: {
      SongName: "NULL",
      CurrentPrice: "NULL"
    },

    initialize: function(){
      if (!this.get("SongName")) {
        this.set({"SongName": this.defaults.SongName});
      }
      if (!this.get("CurrentPrice")) {
        this.set({"CurrentPrice": this.defaults.CurrentPrice});
      }
    }


  });

  var SongList = Parse.Collection.extend({
    
    model: Song

  });

  var SongView = Parse.View.extend({
    
    tagname: "li",

    //template: _.template($('#song-item-template').html()),

    events: {
      //"click .li" : "viewDetail"
    },

    initialize: function() {
      var self = this;
      _.bindAll(this, 'render', 'viewDetail');
      this.$el.html(_.template($('#song-item-template').html()));
      this.render();
    },

    render: function() {
      var JSONString = this.model.toJSON();
      console.log("JSON Representation for SongView");
      console.log(JSONString);

      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    viewDetail: function() {
      window.alert("Click List Item");
    }

  });

 	var state = new AppState;

	new AppView;
	//Parse.history.start();
});






