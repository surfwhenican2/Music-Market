$(function() {

  Parse.$ = jQuery;

  Parse.initialize("WExMK2xE0zaL2b7vfMypKv7GfCgaDGFJQLJoJAm1", 
      "Unhrs7BicyGIyQnoXIOnpo37ZsZZsngPMe6LDf2s");


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
        new AllSongsView();
      },
      pageThree: function(){
        new PortfolioView();
        console.log("Loaded Portfolio View");
      },
      pageFour: function(){
        new TopInvestorsView();
        console.log("Loaded Top Investors View");
      },
      pageFive: function() {
        new SongTradingView();
        console.log("Loaded Song Trading View");
      },
      pageSettings: function() {
        new PageSettingsView();
        console.log("Loaded Page Settings View");
      }
    });

    var PageOneView = Parse.View.extend({
      
      events: {
        "click #stock-detail-page": "showDetail"
      },

      el: ".main",

      initialize: function() {
        var self = this;
        _.bindAll(this, 'render', 'showDetail');
        this.$el.html(_.template($("#ipo-view").html()));

        this.render();
      },

      render: function() {
        this.delegateEvents();
      },

      showDetail: function() {
        var songName = ($('#song-name').text());
        console.log("Song name is: " + songName);
        var songid = $('#song-id').attr("name");
        console.log(songid);
        new SongTradingView({song:songid});
      }
    });

    var AllSongsView = Parse.View.extend({
      
      events: {  
      },

      el: ".main",

      initialize: function() {
        var self = this;
        
        _.bindAll(this, 'render', 'render');
        this.$el.html(_.template($("#page-two-view").html()));

       this.songs = new SongList;
        var Songs = Parse.Object.extend("Songs");
        var query = new Parse.Query(Songs);
        this.songs = query.collection();

        this.songs.fetch({
          success: function(collection) {
            console.warn(collection);
             var liststr = '<ul data-role="listview" id="song-list" data-filter="true" data-theme="g" >';
            collection.each(function(object) {
              var title = object.get("SongName");
              var artist = object.get("ArtistName");
              var price = object.get("CurrentPrice");
              var songImage = object.get("albumUrl"); 
              var objectId = object.id;
              var randomNum = -5 + (5+5)*Math.random();
              randomNum = Math.round(100*randomNum)/100;
              var color = 'red';
              if (randomNum > 0) color = 'green';
               liststr += '<li style="height=110"><div><div id="song" style="display: inline-block;"><img src="'+songImage+'" height="100" width="100"></div><div style="display: inline-block;padding-left:60px;"><strong>' + title;
               liststr += '</strong><input type="hidden" value="'+objectId+'"/> by '+artist+'<br>Price:  $';
               liststr += price+'<br>Todays Change: <font color="'+color+'" >'+randomNum+'</font></div></div></li>';
            });
            liststr += "</ul>";
            console.log(liststr);
            $('.list').html(liststr);
            $(".list").listview("refresh");
            $('#song-list li').click(function(){
                var objId = $(this).find('input').val();
                new SongTradingView({songId:objId});
              });

          },
          error: function(collection, error) {
            console.log(error);
          }
        }); 
        this.render();
      },

      render: function() {
        this.delegateEvents();
        this.refresh();
      },

      refresh: function(){
        $('.list').listview();
        $('.list').listview('refresh');
        console.log("Refresh was called");
      }
    });

    
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
        var userName = user.getUsername();  
        console.log(userName);     
        var Position = Parse.Object.extend("Position");
        var query = new Parse.Query(Position);
        query.equalTo("userId", userId);
        query.find({
          success: function(holdings) {
            console.warn(holdings);
            var portfolioString = "<ul>";
            var len = holdings.length
              for (var i=0; i<len; ++i) {
                if (i in holdings) {
                  var holding = holdings[i];
                  var shares = holding.get("numberShares");
                  var currentPrice = holding.get("sharePrice");
                  currentPrice = Math.round(100*currentPrice)/100;

                  var songName = holding.get("songName");
                  var totalCost = holding.get("totalCost");
                  var color = 'red';
                  if (totalCost > 0) color = 'green';
                  var songId = holding.get("songId");

                  portfolioString += '<li><div style="display: inline-block;"> <b>'+songName+'</b><br> CurrentPrice:  <b>' + currentPrice + '</b></div><div style="display: inline-block;padding-left:80px;"> Number of Shares: <b>' + shares + '</b><br>Market Value:  <b><font color="'+color+'">'+ totalCost + '</font></b>';
                  portfolioString += '<input type="hidden" value="'+songId+'"/></input></div></li>';
                }
              }
              portfolioString += '</ul>';
              console.log(portfolioString);
            $('.portfolio').html(portfolioString);
            $('.portfolio li').click(function(){
                var objId = $(this).find('input').val();
                new SongTradingView({songId:objId});
              });
          },
          error: function(object, error) {
            console.log(error);
          }
        });

        var Portfolio = Parse.Object.extend("Portfolio");
        var query = new Parse.Query(Portfolio);
        query.equalTo("user", user);
        query.first({
          success: function(userPortfolio) {
            console.log(userPortfolio);
            var netWorth = userPortfolio.get("NetWorth");
            netWorth = netWorth.toString();
            var netWorthString = '<h3> Networth: ' + netWorth + '</h3>';
            $('.net-worth-div').append(netWorthString);
            console.log(netWorth);
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

    var TopInvestorsView = Parse.View.extend({
      
      events: {
      },

      el: ".main",

      initialize: function() {
        var self = this;
        
        _.bindAll(this, 'render');
        this.$el.html(_.template($("#page-four-view").html()));
        
        var Portfolio = Parse.User.extend("Portfolio");
        var topinvestors = new Parse.Query(Portfolio);
        topinvestors.limit(4);
        topinvestors.descending("NetWorth");
        topinvestors.find({
          success: function(results) {
            console.warn(results);
              var topInvestorString = '<table class="profiles">';
              var len=results.length;
              for(var i=0; i<len; i++) {
                var object = results[i];
                var worth = object.get("NetWorth");
                var username = object.get("username");
                var userImage = object.get("userImage");
                console.log(userImage.url);
               
                topInvestorString += '<tr><img src="'+userImage.url+'" height="160" width="220"/>';
                topInvestorString += '<p>User: ' + username + '</p><p>Net Worth: ' + worth + '</p></tr>';
              }
              topInvestorString += '</table>';
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
    
    var SongTradingView = Parse.View.extend({

      events: {
        "click #buyButton":"buyShares",
        "click #sellButton":"sellShares"
      },

      el: ".main",

      initialize: function(options) {
        var self = this;
        _.bindAll(this, 'render', 'buyShares', 'sellShares', 'detatch');
        this.$el.html(_.template($("#song-trading-view").html()));

        var songId = options.songId;
        var songName = "";
        var currentPrice = 0;
        var artistName = "";
        console.log('Song ID is: ' + songId);

        var Songs = Parse.Object.extend("Songs");
        var query = new Parse.Query(Songs);
        query.equalTo("objectId", songId);
        query.first({
          success: function(song){
            console.warn(song);
            artistName = song.get("ArtistName");
            currentPrice = song.get("CurrentPrice");
            songName = song.get("SongName");
            var audioURL = 'audio/' + songId + '.mp3';
            $('#song_src').attr('src', audioURL);

            console.log('Artist: '+artistName+' Song: '+songName+' Price: '+currentPrice);
            $('#song-title').append(songName);
            $('#share-price').append(currentPrice);
            $('#artist-name').append(artistName);
            var user = Parse.User.current();
            var Portfolio = Parse.Object.extend("Portfolio");
            var query = new Parse.Query(Portfolio);
            query.equalTo("user", user);
            query.first({
              success: function(portfolio){
                console.warn(portfolio);
                var netWorth = portfolio.get("NetWorth");
                $('#funds').append(netWorth);
              },
              error: function(error){
                console.log(error.message);
              }
            });
          },
          error: function(error){
            console.log('Error Loading Song Details: '+ error);
          }
        });
        this.render();

      },

      render: function() {
        var prices = [0,1.2,2,3.4,4.1,5.5,6.0,7.8,8.2,9.2,8.9,7.6,6,5,4];

        var chart1 = new Highcharts.StockChart({
          chart: {
            renderTo: 'container'
          },
          title:{

          },
          xAxis:{
            type: 'datetime'
          },
          yAxis:{
            title: {
              text: 'Credits'
            }
          },
          rangeSelector: {
            selected: 1
          },
          series: [{
            name: 'Test',
            data: prices // predefined JavaScript array
          }]
        });
        this.delegateEvents();
      },

      detatch: function() {
        $(this.el).unbind();
        
      },

      buyShares: function(){
        var songId = this.options.songId;
        var price = $('#share-price').html();
        var songName = $('#song-title').html();
        var artistName = $('#artist-name').html();
        price = parseFloat(price);
        var numShares = document.getElementById('input-buy').value;
        numShares = parseInt(numShares);
        var totalCost = price * numShares;
        totalCost = parseFloat(totalCost);
        var user = Parse.User.current();
        var userId = user.id;

        var currentNetWorth;
        var Portfolio = Parse.Object.extend("Portfolio");
        var query = new Parse.Query(Portfolio);
        query.equalTo("user", user);
        query.first({
          success: function(userPortfolio) {
            var netWorth = userPortfolio.get("NetWorth");
            currentNetWorth = parseFloat(netWorth);
            console.log('Current net worth: '+currentNetWorth + '  Total Cost: ' + totalCost);
            if (currentNetWorth >= totalCost){

              console.log('SongId:'+songId+' Name: '+name+' Price: '+price+' Shares: '+numShares+' Total Cost: '+totalCost+' UserId : '+userId);

              var Position = Parse.Object.extend("Position");
              var query = new Parse.Query(Position);
              query.equalTo("userId", userId);
              query.equalTo("songId", songId);
              query.first({
                success: function(holding){
                  console.warn(holding);
                  if (typeof holding == "undefined"){
                    console.log("User doesn't have holding in this item. Opening a position.");
                      if (numShares > 0) {
                        var Position = Parse.Object.extend("Position");
                        var openPosition = new Position();
                        openPosition.set("songName", songName);
                        openPosition.set("numberShares", numShares);
                        openPosition.set("sharePrice", price);
                        openPosition.set("totalCost", totalCost);
                        openPosition.set("userId", userId);
                        openPosition.set("songId", songId);
                        openPosition.set("realizedProfit", totalCost);
                        openPosition.set("artistName", artistName);
                        openPosition.save(null, {
                          success: function(again){
                            console.log("Save Successful");
                            alert('Congratulations. You just opened a position in ' + songName + ' and now own ' + numShares + ' shares.');
                              var Portfolio = Parse.Object.extend("Portfolio");
                              var query = new Parse.Query(Portfolio);
                              query.equalTo("user", user);
                              query.first({
                                success: function(userInfo) {
                                  console.log("The user is: ");
                                  console.log(userInfo);
                                  var netWorth = userInfo.get("NetWorth");
                                  var oldnet = netWorth;
                                  netWorth -= totalCost;
                                  userInfo.set("NetWorth", netWorth);
                                  console.log('User: ' + userId + ' Old NetWorth: '+oldnet+' New Networth: ' + netWorth);
                                  userInfo.save(null, {
                                    success:function(userInfo) {
                                      console.log("Successfully Updated Net Worth");
                                      var Songs = Parse.Object.extend("Songs");
                                      var query = new Parse.Query(Songs);
                                      query.equalTo("objectId", songId);
                                      query.first({
                                        success: function(song) {
                                          var newSongPrice = parseFloat(price + (.10*numShares));
                                          song.set("CurrentPrice", newSongPrice);
                                          song.save(null,{
                                            success: function(song){
                                              console.log("Songs price updated..");
                                              songId="";
                                              delete self;                             
                                              location.reload();
                                            }
                                          });
                                        },
                                        error: function(error){
                                          alert(error);
                                        }
                                      });
                                    }
                                  });
                                },
                                error: function(object, error) {
                                  console.log(error);
                                }
                              });
                          },
                          error: function(error){
                            console.log('Error Saving: ' + error);
                          }
                        });


                      } else {
                        alert("You must purchase 1 or more shares.");
                      }
                  } else if (songName = holding.get("songName")){
                    var shares = parseInt(holding.get("numberShares"));
                    var prevPrice = parseFloat(holding.get("sharePrice"));
                    var prevTotalCost = parseFloat(holding.get("totalCost"));
                    var prevRealizedProfit = parseInt(holding.get("realizedProfit"));
                    console.log('Song Before - Shares: '+shares+' Price: '+prevPrice+' Total Cost: '+prevTotalCost+' Prev Realized Profit: '+prevRealizedProfit);
                    var totalShares = numShares + shares;
                    var newTotalCost = totalCost + prevTotalCost;
                    var updatedPrice = (newTotalCost/totalShares);
                    var newRealizedProfit = prevRealizedProfit - (numShares*price);
                    console.log('Song After - Shares: '+totalShares+' Total Cost: '+newTotalCost+' Updated Price: '+updatedPrice+' New Realized Profit: '+prevRealizedProfit);
                    holding.set("numberShares", totalShares);
                    holding.set("totalCost", newTotalCost);
                    holding.set("sharePrice", updatedPrice);
                    holding.set("realizedProfit", newRealizedProfit);
                    holding.save(null, {
                      success: function(){
                        console.log("Save Succeeded");
                        alert('Congratulations. You just increased your holding in '+ songName + ' ' + numShares + ' shares. You now own ' + totalShares + ' shares.');
                          var Portfolio = Parse.Object.extend("Portfolio");
                              var query = new Parse.Query(Portfolio);
                              query.equalTo("user", user);
                              query.first({
                                success: function(userInfo) {
                                  var netWorth = userInfo.get("NetWorth");
                                  var oldnet = netWorth;
                                  netWorth -= totalCost;
                                  userInfo.set("NetWorth", netWorth);
                                  console.log('User: ' + userId + ' Old NetWorth: '+oldnet+' New Networth: ' + netWorth);
                                  userInfo.save(null, {
                                    success:function(userInfo) {
                                      console.log("Successfully Updated Net Worth");
                                      var Songs = Parse.Object.extend("Songs");
                                      var query = new Parse.Query(Songs);
                                      query.equalTo("objectId", songId);
                                      query.first({
                                        success: function(song) {
                                          var newSongPrice = parseFloat(price + (.10*numShares));
                                          song.set("CurrentPrice", newSongPrice);
                                          song.save(null,{
                                            success: function(song){
                                              console.log("Songs price updated..");
                                              songId="";
                                              delete self;                             
                                              location.reload();
                                            }
                                          });
                                        },
                                        error: function(error){
                                          alert(error);
                                        }
                                      });
                                    }
                                  });
                                },
                                error: function(object, error) {
                                  console.log(error);
                                }
                              });
                      },
                      error:function(error){
                        console.log('Save Failed :' + error );
                      }
                    });
                  } else {
                    console.log("Else called");
                  }
                },
                error: function(error){
                  console.log(error);
                }
              });
            } else {
              alert("You do not have sufficient funds to make this transaction.");
            }
          },
          error: function(object, error) {
            console.log(error);
          }
        });

        
      },

      sellShares: function(){
        var numShares = parseFloat(document.getElementById('input-sell').value);
        var songId = this.options.songId;
        var songName = $('#song-title').html();
        console.log('Song Id: ' + songId);
        var user = Parse.User.current();
        userId = user.id;
        var price = $('#share-price').html();
        price = parseFloat(price);

        var Position = Parse.Object.extend("Position");
        var query = new Parse.Query(Position);
        query.equalTo("songId", songId);
        query.equalTo("userId", userId);
        query.first({
          success:function(object){
            console.warn(object);
            if (typeof object == "undefined"){
              alert('You do not own any shares of ' + songName + '.');
            } else {
              var currentNumShares = parseFloat(object.get("numberShares"));
              var songName = object.get("songName");
              var cost = parseFloat(object.get("totalCost"));
              var prevRealizedProfit = parseFloat(object.get("realizedProfit"));
              console.log('Currently owns ' + currentNumShares + ' shares of '+songName+' at a cost of '+cost);
              if (currentNumShares >= numShares) {
                var newNumShares = currentNumShares-numShares;
                var cashReceived = numShares * price;
                var lowerCost = parseFloat(cost - cashReceived);
                var newRealizedProfit = parseFloat(prevRealizedProfit + cashReceived);
                object.set("numberShares", newNumShares);
                object.set("realizedProfit", newRealizedProfit);
                object.set("totalCost", lowerCost);
                object.save(null, {
                  success: function(){
                    console.log("Save Succeeded. Updating NetWorth....");
                    var userInfo = Parse.Object.extend("User");
                    var query = new Parse.Query(userInfo);
                    query.get(userId, {
                      success: function(userInfo) {
                        var netWorth = parseFloat(userInfo.get("NetWorth"));
                        netWorth += cashReceived;
                        userInfo.set("NetWorth", netWorth);
                        console.log('User: ' + userId + ' New Networth: ' + netWorth);
                        userInfo.save(null, {
                          success:function(userInfo) {
                            console.log("Successfully Updated Networth");
                            alert('You just sold ' + numShares + ' shares of ' + songName + '. Your remaining number of shares is ' + newNumShares + '.');
                                songId="";
                                this.detatch();
                                this.unbind();
                                delete self;                             
                                location.reload();
                          }
                        });
                      },
                      error: function(object, error) {
                        console.log('Error Updating NetWorth: ' + error.code + " " + error.message);
                      }
                    });
                  },
                  error:function(error){
                    console.log('Error Saving: ' + error.code + " " + error.message);
                  }
                });
              } else {
                alert("You can't sell more shares than you own. You may only sell " + currentNumShares + " shares of " + songName + ".");
              }
            }
          },
          error:function(error){
            console.log("Big Time Error");
          }
        });
      }
    });
    
  var PageSettingsView = Parse.View.extend({
      
    events: {
        "click #change-password":"changePass",
        "click #upload_prof_pic":"upload"
    },

    el: ".main",

    initialize: function() {
      var self = this;
        
      _.bindAll(this, 'render', 'changePass', 'upload');
      this.$el.html(_.template($("#page-settings-view").html()));
      this.render();
    },

    render: function() {
      this.delegateEvents();
    },

    changePass: function(){
      console.log("Change Password Called");
      new ChangePasswordView();
    },
    upload: function(){
      
    }
  });

  var SignUpView = Parse.View.extend({

    events: {
      "submit form.signup-form": "signUp"
    },

    el:".content",

    initialize: function() {
      _.bindAll(this, "signUp");
      this.render();
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
          portfolio.set("username", user.username);
          portfolio.save(null, {
            success: function(portfolio){
            }
          });
          alert("You hipster you :P.  You're net worth is 1000 credits!  Start buying and selling songs to make the leader board");
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
      this.$el.html(_.template($("#signup-template").html()));
      this.delegateEvents();
    }
   });

  var ChangePasswordView = Parse.View.extend({

    events: {
      "submit form.change-password-form": "changePassword"
    },

    el:".main",

    initialize: function() {
      _.bindAll(this, "changePassword");
      this.render();
    },

    changePassword: function(e) {
      var self = this;
      
      var newPassword = this.$("#new-password").val();
      
      var user = Parse.User.current();
      user.setPassword(newPassword);
      user.save(null, {
        success: function(user) {
          console.log(user);
          alert("Your password has been successfully changed. You may now log in with your new password.");
          
        },
        error: function(error){
          console.log(error);
        }
      });

      this.$(".change-password-form button").attr("disabled", "disabled");
      
      return false;
    },

    render: function() {
      this.$el.html(_.template($("#change-password-template").html()));
      this.delegateEvents();
    }

   });

  var LogInView = Parse.View.extend({

    events: {
      "submit form.login-form": "logIn",
      "click #signup-button": "signUp"
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
          alert("You hipster you :P.  You're net worth is 1000 credits!  Start buying and selling songs to make the leader board");
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

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    },

    signUp: function() {
      console.log("signup button pressed");
      new SignUpView();
    }
  });

  var AppView = Parse.View.extend({

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

  var AppRouter = Parse.Router.extend({
        routes: {
            "*actions": "defaultRoute",
            "portfolio": "portfolio",
            "allSongs":"allSongs"
        },

        portfolio: function(){
          new PortfolioView();
        },
        allSongs: function(){
          new AllSongsView();
        }
  });

  new AppView;

  var app_router = new AppRouter();

	Parse.history.start();
});