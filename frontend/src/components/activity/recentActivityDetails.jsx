import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Moment from 'react-moment';

export default class RecentActivityDetailCard extends Component {
    render() {
      const { recentActivity } = this.props;
    //   console.log(groupDetail)
      return (
        <Row>
            <Row md={2}><Moment format="MMM DD">{recentActivity.bill_add_time}</Moment></Row>
            <Col>
                {recentActivity.paid_by_name} added {recentActivity.bill_details} in {recentActivity.group_name}
            </Col>
        </Row>
      );
    }
  }