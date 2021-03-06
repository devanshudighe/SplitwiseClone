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
            <Col md={2} style = {{ paddingRight : "5px"}}><Moment date = {Date.UTC(recentActivity.bill_add_time)} tz = {timezone} format="dddd" >{recentActivity.bill_add_time}</Moment></Col>
            <Col>
                <b>{recentActivity.paid_by_name}</b> added "<b>{recentActivity.bill_details}</b>" in <b>{recentActivity.group_name}</b>
            </Col>
        </Row>
      );
    }
  }