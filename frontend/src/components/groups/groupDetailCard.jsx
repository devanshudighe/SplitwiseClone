import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Moment from 'react-moment';
var numeral = require('numeral');

export default class GroupDetailCard extends Component {
    render() {
      const { groupDetail } = this.props;
      return (
        <Row>
          <Col md={2}><Moment format="MMM DD">{groupDetail.bill_add_time}</Moment></Col>
          <Col md={6}>{groupDetail.bill_name}</Col>
          <Col md={2}>
            <Row>
              <Col>
                <Row style={{ fontSize: '12px', color: 'grey', paddingRight : "5px" }}>
                  {groupDetail.paid_by_name} paid
                  {/* {' '} */}
                </Row>
                <Row>{numeral(groupDetail.bill_amount).format('$ 0,0[.]00')}</Row>
              </Col>
            </Row>
          </Col>
          <Col md={2}>
            <Row>
              <Col>
                <Row style={{ fontSize: '12px', color: 'grey', paddingLeft : "5px" }}>
                  { groupDetail.bill_paid_by === groupDetail.user_id ? (
                    <p>
                      you lent
                    </p>
                  ) : (
                    <p>
                      {groupDetail.paid_by_name}
                      {' '}
                      lent you
                    </p>
                  ) }
                </Row>
                <Row>{numeral(groupDetail.split_amount).format('$ 0,0[.]00')}</Row>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }
  }