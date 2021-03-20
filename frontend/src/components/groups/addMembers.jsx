import React, { Component } from "react";
import { Row, Form, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import axios from 'axios'
import localhost from "../../config.js"
import Select from "react-select";

class Members extends Component {
    constructor(props) {
        super(props);
        this.state = { invitationName: '', invitationEmail: '' };
      }
      

      onSearchName = async (name) => {
        console.log(name)
        const list = this.props.allUsers.filter( (user) =>user.name.toLowerCase().includes(name.toLowerCase()))
        console.log(list)
        await this.setState({
            res : list.map(l => 
                l.name
            )
        })
        console.log(this.state.res)
    }

    onSearchEmail = async (email) => {
        // console.log(name)
        const list = this.props.allUsers.filter( (user) =>user.email.toLowerCase().includes(email.toLowerCase()))
        console.log(list)
        await this.setState({
            res : list.map(l => 
                l.email
            )
        })
        console.log(this.state.res)
    }

    editSearchTermName = async (selectedOptionName) => {
      this.setState({
          selectedOptionName
      })
      this.onSearchName(selectedOptionName.value)
      // console.log(selectedOptionName)
      // const list = this.state.allUsers.filter( (user) =>user.name.toLowerCase().includes(selectedOptionName.toLowerCase()))
      // console.log(list)
      // await this.setState({
      //     res : list.map(l => 
      //         l.name
      //     )
      // })
      // console.log(this.state.res)
    }
    editSearchTermEmail = (selectedOptionEmail) => {
      this.setState({
          selectedOptionEmail
      })
      this.onSearchEmail(selectedOptionEmail.value)
    }



    
      // onChangeInvitationName = (e) => {
      //   this.setState({
      //     invitationName: e.target.value,
      //   });
      // }
    
      // onChangeInvitationEmail = (e) => {
      //   this.setState({
      //     invitationEmail: e.target.value,
      //   });
      // }
    
      onInvite = (e) => {
        e.preventDefault();
        // console.log(this.props.groupName);
        const data = {
          groupName: this.props.groupName,
          invitationName: this.state.selectedOptionName.value,
          invitationEmail: this.state.selectedOptionEmail.value,
        };
        console.log(JSON.stringify(data));
        axios.post(`${localhost}/member`, data)
          .then((response) => {
            console.log(response);
            alert('Invitation Sent');
          }).catch((err) => {
            console.log(err);
          });
      }
    render() {
        const searchListName = this.props.allUsers.map(obj => ({
          value : obj.name,
          label : obj.name,
      })
      )
      const searchListEmail = this.props.allUsers.map(obj => ({
          value : obj.email,
          label : obj.email,
      })
      )
        console.log(this.props)
        return (
            <Form>
                <Form.Group>
                    <Row>
                        <Col>
                            <Select type= 'text' value = {this.state.selectedOptionName} onChange = {this.editSearchTermName} options = {searchListName} placeholder = 'Search for a name!'/>
                            {/* <Form.Control type = "text" name = "invitationName" placeholder="Name" onChange = {this.onChangeInvitationName} /> */}
                        </Col>
                        <Col>
                            <Select type= 'text' value = {this.state.selectedOptionEmail} onChange = {this.editSearchTermEmail} options = {searchListEmail} placeholder = 'Search for an email!'/>
                            {/* <Form.Control type = "email" name = "invitationEmail" placeholder="Email" onChange = {this.onChangeInvitationEmail} /> */}
                        </Col>
                        <Col>
                        <Button type="submit" className="btn btn-primary btn-sm" onClick = {this.onInvite}>Invite</Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        );
    }
}

export default Members;