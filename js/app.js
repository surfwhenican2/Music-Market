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
  			"click .log-out": "logOut",
        "click #page-one": "pageOne",
        "click #page-two": "pageTwo"
  		},

  		initialize: function() {
  			var self = this;
        
  			_.bindAll(this, 'render', 'logOut');
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

        //var template = _.template( $("#logged-in-view").html(), {} );
            // Load the compiled HTML into the Backbone "el"
        //this.$el.html( template );
        this.delegateEvents();
  		},

      pageOne: function(){
        new PageOneView();
        console.log("Loaded Page One View");
      },

      pageTwo: function(){
        new PageTwoView();
        console.log("Loaded Page Two View");
      }

  	});

    var PageOneView = Parse.View.extend({
      
      events: {
        "click .log-out": "logOut",
        //"click #page-one": "pageOne",
        "click #page-two": "pageTwo"
      },

      el: ".main",

      initialize: function() {
        var self = this;
        _.bindAll(this, 'render', 'logOut', 'pageTwo');
        this.$el.html(_.template($("#page-one-view").html()));
        this.render();
      },

      render: function() {
        this.delegateEvents();
      },

      logOut: function(e) {
        Parse.User.logOut();
        console.log("User Logged Out");
        new LogInView();
        this.undelegateEvents();
        delete this;
      },

      pageTwo: function(){
        new PageTwoView();
        console.log("Loaded Page Two View");
      }

    });

    var PageTwoView = Parse.View.extend({
      
      events: {
        "click .log-out": "logOut",
        "click #page-one": "pageOne",
        //"click #page-two": "pageTwo"
      },

      el: ".main",

      initialize: function() {
        var self = this;
        
        _.bindAll(this, 'render', 'logOut', 'pageOne');
        this.$el.html(_.template($("#page-two-view").html()));
        this.render();
      },

      render: function() {
        this.delegateEvents();
      },

      logOut: function(e) {
        Parse.User.logOut();
        console.log("User Logged Out");
        new LogInView();
        this.undelegateEvents();
        delete this;
      },

      pageOne: function(){
        new PageOneView();
        console.log("Loaded Page One View");
      },


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

 	var state = new AppState;

	new AppView;
	//Parse.history.start();
});






