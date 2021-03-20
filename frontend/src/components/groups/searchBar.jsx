import React, { Component } from "react";
import { Row, Col, Container, Card } from 'react-bootstrap';
import { Button } from "react-bootstrap";
import Select from "react-select";



export default class SearchBars extends Component {
    constructor(props){
        super(props);
        this.state = {
            names : this.props.groupNames,
        }
    }
    editSearchTerm = (selectedOption) => {
        this.setState({
            selectedOption
        })
        this.props.onSearch(selectedOption.value)
      }

      
    //   dynamicSearch = () => {
    //     console.log(this.state.names)

    //     if(this.props.groupNames && this.props.groupNames.length > 0){
    //         // console.log("in condition" + this.state.names)
    //         const list =  this.props.groupNames.filter( (name) =>name.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
    //         this.setState({
    //             res : list,
    //         })
    //     }
        // else{
        //     return []
        // }
        
    //   }
      render(){
        //   const list = this.dynamicSearch()
        //   console.log(list)
        const searchList = this.props.groupNames.map(name => ({
            value : name,
            label : name,
        })
        )
        return (
          <div>
            <Select type= 'text' value = {this.state.selectedOption} onChange = {this.editSearchTerm} options = {searchList} placeholder = 'Search for a name!'/>
            {/* <br></br> */}
            
          </div>
        );
      }
}