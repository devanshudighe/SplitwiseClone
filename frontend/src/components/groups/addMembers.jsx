import React, { Component } from "react";
import { Row, Form, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import axios from 'axios'
import localhost from "../../config.js"

class Members extends Component {
    constructor(props) {
        super(props);
        this.state = { invitationName: '', invitationEmail: '' };
      }
    
      onChangeInvitationName = (e) => {
        this.setState({
          invitationName: e.target.value,
        });
      }
    
      onChangeInvitationEmail = (e) => {
        this.setState({
          invitationEmail: e.target.value,
        });
      }
    
      onInvite = (e) => {
        e.preventDefault();
        // console.log(this.props.groupName);
        const data = {
          groupName: this.props.groupName,
          invitationName: this.state.invitationName,
          invitationEmail: this.state.invitationEmail,
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
        console.log(this.props)
        return (
            <Form>
                <Form.Group>
                    <Row>
                        <Col>
                            <Form.Control type = "text" name = "invitationName" placeholder="Name" onChange = {this.onChangeInvitationName} />
                        </Col>
                        <Col>
                            <Form.Control type = "email" name = "invitationEmail" placeholder="Email" onChange = {this.onChangeInvitationEmail} />
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