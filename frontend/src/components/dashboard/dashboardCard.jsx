import React, { Component } from "react";
import { Row, Col } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
var numeral = require('numeral');

export default class DashboardCard extends Component {
    
    render() {
        const { dashboard } = this.props;
        
        return (
            <Row>
                <Col>
                    <Row>
                        YOU OWE
                    </Row>
                    <Row>
                        <ListGroup variant = "flush">
                            <Row>
                                { dashboard.net_amt !== 0 ? (
                                    dashboard.user2_name
                                ) : (
                                    "you are settled up"
                                )}
                            </Row>
                            <Row>
                                you owe {numeral((Math.abs(dashboard.net_amt))).format('$0.00')}
                            </Row>
                            
                        </ListGroup>
                    </Row>
                    
                </Col>
                <Col>
                    YOU ARE OWED
                </Col>
            </Row>
        )
    }
}