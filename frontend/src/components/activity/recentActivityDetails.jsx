import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Moment from 'react-moment';
import 'moment-timezone';


export default class RecentActivityDetailCard extends Component {
    render() {
      const { recentActivity } = this.props;
      const timezone = JSON.parse(localStorage.getItem('user')).timeZone
      console.log(timezone)
      return (
        <Row>
            <Col md={2} style = {{ paddingRight : "5px"}}><Moment tz = {timezone} format="dddd" >{recentActivity.bill_add_time}</Moment></Col>
            <Col>
                {recentActivity.paid_by_name} added {recentActivity.bill_details} in {recentActivity.group_name}
            </Col>
        </Row>
      );
    }
  }