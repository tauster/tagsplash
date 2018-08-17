/*
  TagSplasher - Tweet showcase for events, backdrops, and more.

  http://tagsplash.toasted.ai/

  Tausif S - 2018
*/

// Package imports
import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import TweetCloud from './components/TweetCloud';

// React App class
class App extends Component {
  // State constructor.
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      tweetData: [],
      tweetCloud: "",
      tweetCloudData: []
    };
  }

  // Redirect for enter click on search bar.
  searchRedirect(event) {
    if(event.key === "Enter") {
      this.getTwuery();
    }
  }

  // Creates tweet cloud.
  setTweetCloud() {
    this.setState({tweetCloud: <TweetCloud data={this.state.tweetCloudData}/>});
  }

  // Control search bar, title, and footer visibility.
  searchBarOn() {
    if($(".title").css("display") === "none" && $(".searchBar").css("display") === "none") {
      $(".title").fadeIn();
      $(".searchBar").fadeIn();
      $(".toasted").fadeIn();
    }
    else {
      $(".title").fadeOut();
      $(".searchBar").fadeOut();
      $(".toasted").fadeOut();
    }
  }

  // Info overlay styling controls.
  infoOverlayOn() {
    $(".overlay").css("display", "block");
  }
  infoOverlayOff() {
    $(".overlay").css("display", "none");
  }
  
  // Body background and text color controls.
  blackBody() {
    $("body").css("background-color", "#000000");
    $(".title").css("color", "#838383");
    $(".toasted").css("color", "#838383");
  }
  whiteBody() {
    $("body").css("background-color", "#FFFFFF");
    $(".title").css("color", "#9DCAEC");
    $(".toasted").css("color", "#000000");
  }

  // Updating word cloud for animation.
  componentDidMount() {
    this.tweetCloudID = setInterval(
      () => this.setTweetCloud(),
      10000
    );

    this.tweetReSearch = setInterval(
      () => this.getTwuery(),
      20000
    );
  }

  componentWillUnmount() {
    clearInterval(this.tweetCloudID);
    clearInterval(this.tweetReSearch);
  }

  // Gathers the text sentiment data and prepares visuals.
  getTwuery() {
    // Storing search term from input.
    var searchTerms = $(".form-control").val();
    
    // Checking to see if the search term is not empty.
    if(searchTerms !== "") {
      // Updating search term on this instance.
      this.setState({searchTerm: searchTerms});

      // Preparing search terms for API endpoint.
      searchTerms = searchTerms.replace("/api/", "");
      searchTerms = searchTerms.replace("#", "%23");
      searchTerms = searchTerms.replace(" ", "+");
      
      // Forming express API endpoint.
      const urlStr = "https://tagsplash-server.herokuapp.com/api/" + searchTerms;
      
      // Fading out results panel from previous session.
      $(".resultsPanel").fadeOut();
      
      // Using AJAX to process GET API action.
      $.ajax({
        type: "GET",
        url: urlStr,
        dataType: "json",

        // Fetch success.
        success: (tweetResults) => {
          // Preparing tweet cloud data.
          var newTweetCloudData = [];
          var cleanTweet = "";
          
          // going through each tweet.
          for(var i = 0; i < tweetResults.length; i++) {
            // Checking is tweet exists for search terms.
            if(tweetResults[i].hasOwnProperty("tweet") && tweetResults[i].hasOwnProperty("retweet_count")) {
              // Cleaning tweets slightly for display.
              cleanTweet = tweetResults[i].tweet.toString();
              cleanTweet = cleanTweet.replace(/@(\w+)/g, "");
              cleanTweet = cleanTweet.replace("RT", "");
              cleanTweet = cleanTweet.replace(":", "");
              cleanTweet = cleanTweet.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");

              // Shortening tweets that are too long, then/otherwise pushing data.
              if(cleanTweet.length > 45) {
                newTweetCloudData.push({text: cleanTweet.substring(0, 44)+"...", value: tweetResults[i].retweet_count});
              }
              else {
                newTweetCloudData.push({text: cleanTweet, value: tweetResults[i].retweet_count});
              }
            }
          }

          // Setting required tweet data.
          this.setState({tweetCloudData: newTweetCloudData});

          // Updating the wordCloud state with new chart from Results.js.
          this.setTweetCloud();

          // Controlling fading of some components.
          $(".title").fadeOut();
          $(".searchBar").fadeOut();
          $(".toasted").fadeOut();

          $(".resultsPanel").fadeIn();
        },

        // Fetch failure.
        error: (xhr, status, err) => {
          console.log("Search failed. API fetching failed. Check server routes.");
        }
      }); 
    }
  }

  // JSX render.
  render() {
    return (
      <div className="App">
        {/* Nav Bar */}
        <div className="container-fluid col-xs-12">
          {/* Search and Info Controls */}
          <ul className="nav navbar-right">
            <li className="nav-item"><button className="navBtn" onClick={this.searchBarOn}><i className="fas fa-search"></i></button></li>
            <li className="nav-item"><button className="navBtn" onClick={this.infoOverlayOn}><i className="far fa-question-circle"></i></button></li>
          </ul>

          {/* Body Color Controls */}
          <ul className="nav navbar-left">
            <li className="nav-item"><button className="navBtn blackBody" onClick={this.blackBody}><i class="fas fa-circle"></i></button></li>
            <li className="nav-item"><button className="navBtn whiteBody" onClick={this.whiteBody}><i class="fas fa-circle"></i></button></li>
          </ul>
        </div>

        <br/>
        <br/>
        <br/>
        <br/>

        {/* Main Container */}
        <div className="container">

          {/* Info Overlay */}
          <div className="overlay" onClick={this.infoOverlayOff}>
            <div className="infoOverlay">
              <p>
                Use TagSplash for your event backdrops by featuring Tweets based on keywords and hashtags.
                <br/>
                Simply search your keywords or hashtags for the Tweet create the Tweet cloud. Use a black background for best results on projectors.
                <br/>
                <br/>
                The results given are not associated with the thoughts of TagSplash or <a target="_blank" rel="noopener noreferrer" href="http://www.toasted.ai/">toasted.ai</a>.
              </p>
            </div>
          </div>

          <br/>
          <br/>
 
          {/* Main Title */}
          <h1 className="title">TagSplash</h1>
          
          <br/>
          <br/>
          
          {/* Search Bar */}
          <div className="searchBar input-group col-sm-12 col-md-8 col-md-offset-2">
            <input type="text" className="form-control" id="searchtext" placeholder="Search Twitter..." maxLength="50" onKeyDown={this.searchRedirect.bind(this)} />
            <span className="input-group-btn">
              <button className="btn" id="searchbtn" type="button" onClick={this.getTwuery.bind(this)}><i className="fas fa-search"></i></button>
            </span>
          </div>

          <br/>
          <br/>

          {/* toasted.ai Branding */}
          <p className="toasted">made by <a target="_blank" rel="noopener noreferrer" href="http://www.toasted.ai/">toasted.ai</a></p>

          <br/>
          <br/>
        </div>

        {/* Results Panel */}
        <div className="resultsPanel col-xs-12">

          {/* Word Cloud */}
          <div className="viz">
            {this.state.tweetCloud}
          </div>

        </div>
      </div>
    );
  }
}

export default App;

