/*
  TweetCloud generator for TagSplash

  http://tagsplash.toasted.ai/

  Tausif S - 2018
*/

import React, { Component } from 'react';
import randomColor from 'randomcolor';
import TagCloud from 'react-tag-cloud';


class TweetCloud extends Component {
  // JSX render.
  render() {
    // Stores given data from App.js.
    const tweetCloudData = this.props.data;
    
    // Maping each tweet to tweet cloud div elements.
    const tweetList = tweetCloudData.map((tweet) =>
      <div 
        style={{fontSize: Math.round(Math.random() * 50) + 16}}  
        key={tweet.text.toString()}>{tweet.text.toString()}
      </div>
    );

    // Tweet cloud render.
    return (
      <div className="canvas-wrap">
        <canvas width="100%" height="700"></canvas>

        <div className='app-outer'>
          <div className='app-inner'>
            <TagCloud 
              className='tag-cloud'
              style={{
                fontFamily: 'Roboto, sans-serif',
                //fontSize: () => Math.round(Math.random() * 50) + 16,
                color: () => randomColor({
                  hue: 'blue'
                }),
                padding: 5,
              }}>
              
              {tweetList}
              
            </TagCloud>
          </div>
        </div>

      </div>
    );
  }
}

export default TweetCloud;

