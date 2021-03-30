import axios from 'axios';
import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import localhost from '../../config';

class LeftSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        allUserGroups: []
    };
    this.getGroupList();
    
  }

    getGroupList = () => {
        const userId = JSON.parse(localStorage.getItem('user')).userId
        axios.get(`${localhost}/myGroups/${userId}`)
            .then(response => {
                if (response.data[0]) {
                    response.data.map(invitations => {
                        if (invitations.is_member === "Y") {
                            const list = [...this.state.allUserGroups, invitations]
                            this.setState({
                                allUserGroups: list,
                                res: list.map(l =>
                                    l.group_name
                                )
                            });
                        }
                    })
                }
            })
    }

  render() {
    const groupLinks = [];
    if (this.state && this.state.allUserGroups && this.state.allUserGroups.length > 0) {
      this.state.allUserGroups.map((group) => {
        groupLinks.push(
          <Link
            key={group.group_name}
            className="nav-link"
            to={{
              pathname: '/groupdetails',
              state: { group_name: group.group_name },
            }}
          >
            {group.group_name}
          </Link>,
        );
      });
    }
    return (
      <Nav defaultActiveKey="/home" className="flex-column mt-3">
        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
        <Nav.Link href="/myGroups">My Groups</Nav.Link>
        <Nav.Link href="/recent">Recent Activity</Nav.Link>
        <hr />
        <div className="px-3 text-muted">Groups</div>
        {groupLinks}
      </Nav>
    );
  }
}

export default LeftSidebar;