import React, { Component } from "react";
import { Row, Form, Col, Container, Card } from 'react-bootstrap';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios'
import localhost from "../../config.js"
import RecentActivityDetailCard from "./recentActivityDetails.jsx";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LeftNavbar from "../navbar/navbarLeft";

export default class RecentActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activity : [],
            filterActivity : [],
            allUserGroups : [],
            order:"new",
        };
        this.getRecentActivity();
        this.getGroupDetails()
    }

    getRecentActivity = () => {
        const userId = JSON.parse(localStorage.getItem('user')).userId
        axios.get(`${localhost}/recent/${userId}`)
        .then((response) => {
            if(response.data[0]){
                this.setState({
                    activity : response.data,
                    filterActivity : response.data,
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    getGroupDetails = () => {
        const userId = JSON.parse(localStorage.getItem('user')).userId
        axios.get(`${localhost}/myGroups/${userId}`)
            .then(response => {
                if (response.data[0]) {
                    console.log(response.data)
                    response.data.map(invitations => {
                        if (invitations.is_member === "Y") {
                            const list = [...this.state.allUserGroups, invitations]
                            // console.log(list)
                            this.setState({
                                allUserGroups: list,
                            });
                        }
                    });
                }
            });
        }
    handleChange = (e) => {
        if(this.state.order === "new" && e.target.value ==="old"){
            this.setState({
              activity: this.state.activity.reverse(),
              order:"old"
            })
          }
          else if(this.state.order === "old" && e.target.value ==="new"){
            this.setState({
                activity: this.state.activity.reverse(),
                order: "new"
            })
          }
    }
    handleChangeFilter = (e) => {
        if(e.target.value === "all"){
            this.setState({
                filterActivity : this.state.activity,
            })
            console.log(this.state.activity)
            // console.log(this.state.activity)
        }
        else{
            const filter = this.state.activity.filter(f => 
                f.group_name = e.target.value,
            )
            this.setState({
                filterActivity : filter,
            })
            console.log(filter)
        }
    }

    render() {
        const classes = makeStyles((theme) => ({
            formControl: {
              margin: theme.spacing(1),
              minWidth: 120,
            },
            selectEmpty: {
              marginTop: theme.spacing(2),
            },
          }));
        const groupElements = []
        if (this.state && this.state.activity && this.state.activity.length > 0) {
            this.state.activity.map((recentActivity) => {
                console.log(recentActivity)
                const groupElement = (
                  <ListGroup.Item><RecentActivityDetailCard recentActivity = {recentActivity}/></ListGroup.Item>
                );
                groupElements.push(groupElement);
              });          
        }
        // const filterElements = []

        const filterElement = new Set();
        if (this.state && this.state.allUserGroups && this.state.allUserGroups.length > 0) {
            this.state.allUserGroups.map((userGroups) => {
                const groups = (
                    <MenuItem value = {userGroups.group_name}>{userGroups.group_name}</MenuItem>
                )
                filterElement.add(groups);
            })
        }

        console.log(filterElement)
        return (
            <Row className="mt-3" >
                <Col md="3">
                    <Row className="mt-4"></Row>
                    <Row className="mx-3">
                        <LeftNavbar />
                    </Row>

                </Col>
                <Col md= "6">
                    <Row>
                        <Col md = "8" style = {{textAlign : "center"}}>
                            <h1>Recent Activity</h1>
                        </Col>
                        <Col md = "2">
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Sort
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                // value={age}
                                onClick={this.handleChange}
                                displayEmpty
                                className={classes.selectEmpty}
                            >
                                <MenuItem value = "new">New to Old</MenuItem>
                                <MenuItem value = "old">Old to New</MenuItem>
                            </Select>
                        </FormControl>
                        </Col>
                        <Col md = "2">
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Filter
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                // value={age}
                                onClick={this.handleChangeFilter}
                                displayEmpty
                                className={classes.selectEmpty}
                            >
                            <MenuItem value = "all">All</MenuItem>
                            {filterElement}
                            </Select>
                        </FormControl>
                    </Col>
                    </Row>
                    <Row>
                        <Col md={{
                            span: "2",
                            offset: "1"
                        }}>
                        </Col>
                        <Col md={{
                            span: "6"
                        }}>
                            <ListGroup variant='flush' style={{
                                width: "100%"
                            }}>
                                {groupElements}
                            </ListGroup>
                        </Col>
                        <Col md={{
                            span: "4"
                        }}>
                        </Col>
                    </Row>
                </Col>
                <Col md = "3">

                </Col>
            </Row>
                
        )
    }
}