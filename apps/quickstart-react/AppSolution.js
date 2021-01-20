import React from 'react';
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js"
import { findAllByTitle } from '@testing-library/react';

const monday = mondaySdk();

class AppSolution extends React.Component {
  constructor(props) {
  super(props);

    // Default state
    this.state = {
      settings: [],
      background: {},
      context: {},
    };
  }

  componentDidMount() {
      monday.listen("settings", res => {
        this.setState({ settings: res.data });
      });
      monday.listen("context", res => {
        this.setState({context: res.data});
        console.log(res.data);
        monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:1) { name column_values { title text } } } }`,
          { variables: {boardIds: this.state.context.boardIds} }
        )
        .then(res => {
          this.setState({boardData: res.data});
        });
      })
    }

  render() {
    return (
      <div
        className="App"
        style={{ background: this.state.settings.background }}
      >
     <AttentionBox 
     title = {this.state.settings.attentionBoxTitle || "Hello monday.apps"}
     text={this.state.settings.attentionBoxMessage || "You should be able to edit the info that appears here using the fields you've set up previously in the View settings :) "}
     type={this.state.settings.attentionBoxType || "success"}
/>
{JSON.stringify(this.state.boardData, null, 2)}
      </div>
    );
  }
}


export default AppSolution;
