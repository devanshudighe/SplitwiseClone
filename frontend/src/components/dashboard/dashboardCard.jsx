import React, { Component } from "react";
import { Row, Col } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
var numeral = require('numeral');

export default class DashboardCard extends Component {
    
    render() {
        const { dashboard } = this.props;
        console.log(dashboard)
        return (
                    <div>
                        <ListGroup variant = "flush">
                            <ListGroup.Item>
                                <Row>
                                { dashboard.net_amt !== 0  && dashboard.net_amt < 0 ? (
                                    dashboard.user2_name
                                ) : (
                                    ""
                                )}
                                </Row>
                                <Row>
                            you owe {numeral((Math.abs(dashboard.net_amt))).format('$0.00')}
                                </Row>
                            
                                    
                                
                            </ListGroup.Item>
                            
                            
                        </ListGroup>
                        <ListGroup variant = "flush">
                            <ListGroup.Item>
                                { dashboard.net_amt !== 0 && dashboard.net_amt > 0 ? (
                                    
                                    // <Row>
                                    dashboard.user2_name + (numeral((Math.abs(dashboard.net_amt))).format('$0.00'))
                                    
                                ) : (
                                    ""
                                )}
                            </ListGroup.Item>
                            
                            
                        </ListGroup>
                    </div>          
        )
    }
}