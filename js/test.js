
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
        var Position = Parse.Object.extend("Position");
        var query = new Parse.Query(Position);
        query.equalTo("userId", userId);
        query.find({
          success: function(holdings) {
          	console.warn(holdings);

            var netWorth = userInfo.get("NetWorth");
            netWorth = netWorth.toString();
            var netWorthString = '<h3> Networth: ' + netWorth + '</h3>';
            $('.net-worth-div').append(netWorthString);
          },
          error: function(object, error) {
            console.log(error);
          }
        });

        //This query gets all the Positions for the current User

        var Position = Parse.Object.extend("Position");
        var query2 = new Parse.Query(Position);
        query2.equalTo("userId", userId);
        query2.find({
          success: function(results) {
            console.warn(results);
          },

          error: function(error) {
            console.log("Error: " + error + error.message );
          }
        });

        this.render();
      },

      render: function() {
        this.delegateEvents();
      }

    });
