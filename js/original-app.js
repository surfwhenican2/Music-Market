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
        new AllSongList();
        console.log("Loaded Page Two View");
      },

      pageThree: function(){
        new PortfolioView();
        console.log("Loaded Portfolio View");
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
        this.$el.html(_.template($("#ipo-view").html()));
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
             var liststr = '<ul data-role="listview" id="song-list" data-filter="true" data-theme="g" >'
            collection.each(function(object) {
              //console.warn(object);
              var title = object.get("SongName");
              console.log(title)
              var price = object.get("CurrentPrice");
               liststr += '<li><a href="#" class="btn-bro" id="page-five">';
               liststr += title;
               liststr += '</a><span>       $';
               liststr += price;
               liststr += '</span></li>';
            
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

    var AllSongList = Parse.View.extend({

      el:$('#mainapp'),

      events: {
        "click li": 'showDetail',
        'click button#add': 'addItem'
      },
      initialize:function(){
      _.bindAll(this, 'render', 'addItem', 'appendItem', 'showDetail'); // remember: every function that uses 'this' as the current object should be in here
      
      this.collection = new SongList();
      this.collection.bind('add', this.appendItem); // collection event binder

      this.counter = 0;
      this.render();  
      },

      appendItem: function(item){
        $('ul', this.el).append("<li>"+item.get('part1')+" "+item.get('part2')+"</li>");
      },

      render: function(){
      var self = this;      
          $(this.el).append("<button id='add'>Add list item</button>");
          $(this.el).append("<ul></ul>");
          _(this.collection.models).each(function(item){ // in case collection is not empty
            self.appendItem(item);
          }, this);
      },

      showDetail: function(){
        console.log("called show detail");
      },

    addItem: function(){
      this.counter++;
      var item = new Song();
      item.set({
        SongName: item.get('part2') + this.counter // modify item defaults
      });
      this.collection.add(item); // add item to collection; view is updated via event 'add'
    },

  });
    

    var PortfolioView = Parse.View.extend({
      
      tageName:'ul',

      initialize: function(){
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function(holding){
          $(self.el).append(new HoldingItemView({model:holding}).render().el);
        });
      },

      render: function(){
        _.each(this.models.models, function(holding){
          $(this.el).append(new HoldingItemView({model:holding}).render().el);
        }, this);
        return this;
      }

    });
<!--
    var PortfolioView = Parse.View.extend({
      
      events: {

      },

      el: ".main",

      initialize: function() {
        var self = this;
        
        _.bindAll(this, 'render');
        this.$el.html(_.template($("#portfolio-view").html()));
        
        var user = Parse.User.current();
        var userId = user.id;

        var userInfo = Parse.Object.extend("User");
        var query = new Parse.Query(userInfo);
        query.get(userId, {
          success: function(userInfo) {
            var netWorth = userInfo.get("NetWorth");
            netWorth = netWorth.toString();
            console.log(netWorth);
            var netWorthString = '<h3> Networth: ' + netWorth + '</h3>';
            console.log(netWorthString);
            
            $('.net-worth-div').append(netWorthString);
            
          },
          error: function(object, error) {
            console.log(error);
          }
        });



        this.render();
      },

      render: function() {
        this.delegateEvents();
      }

    });
-->

    var HoldingItemView = Parse.View.extend({
      
      tagname:"li",

      template: _.template($('#holding-item-view').html()),

      events: {
        'click': 'showDetail'
      },

      initialize: function(){
          this.model.bind("change", this.render, this);
      },

      render: function(eventname) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      },

      showDetail: function(){
        var stockDetail = new StockDetailView();
        new StockDetailView({})
      }

    });

    var StockDetailView = Parse.View.extend({

      template: _.template($('#page-five-view').html()),

      initialize:function(){
        this.model.bind("change", this.render, this);

      },
      render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      },
      events:{
        "change input":"change"
      },

      change: function(event){
        var target = event.target;
        console.log('changing' + target.id + 'from:' + target.defaultValue + ' to: ' + target.value);
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
        
        
        var Portfolio = Parse.Object.extend("Portfolio");

        var topinvestors = new Parse.Query(Portfolio);
        
        topinvestors.greaterThan("NetWorth", 0);
        topinvestors.descending("NetWorth");
        topinvestors.limit(4);
        topinvestors.find({
          success: function(results) {
              var topInvestorString = '<table class="profiles"><tr>';
              var len=results.length;
              for(var i=0; i<len; i++) {
                topInvestorString += '<tr>'
                var object = results[i];
                var worth = object.get("NetWorth");
                var numShares = object.get("NumberShares");
                var soldPrice = object.get("SoldPrice");
                topInvestorString += '<img src="images/blank_profile.png" alt="Blank Profile" />'
                topInvestorString += '<p>Worth:' + worth + '</p><p>Something Relevant:' + numShares + '</p><p>Rating: ' + soldPrice + "</p>";
                topInvestorString += '</tr>';
              }
              console.log(topInvestorString);
              $('.main2').append(topInvestorString);
            
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });


        this.render();
      },

      render: function() {
        this.delegateEvents();
      }

    });
    
    var PageFiveView = Parse.View.extend({

      events: {
        "click #buyButton":"buyShares",
        "click #sellButton":"sellShares"
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
      },

      buyShares: function(){
        console.log("Clicked Shares Bought");
        var numShares = document.getElementById('input-buy').value;
        
      },

      sellShares: function(){
        console.log("Clicked Shares Sold");
        var numShares = document.getElementById('input-sell').value;
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
          var Portfolio = Parse.Object.extend("Portfolio");
          var portfolio = new Portfolio();
          portfolio.set("NetWorth", 1000);
          portfolio.set("user", user);
          portfolio.save(null, {
            success: function(portfolio){
              var query = new Parse.Query(Portfolio);
              query.equalTo("user", user);
              query.find({
                success: function(usersPortfolio){
                  console.log(usersPortfolio.get("NetWorth"));
                }
              });
            }
          });
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

  var Holding = Parse.Object.extend("Holding");

  var HoldingCollection = Parse.Collection.extend({
      model:Holding,
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
      "click" : "viewDetail"
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
      window.alert("Clicked List Item");
    }

  });

 	var state = new AppState;

	new AppView;
	//Parse.history.start();
});






