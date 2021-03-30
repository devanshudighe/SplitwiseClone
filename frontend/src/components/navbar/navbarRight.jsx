import { Component } from "react";
import axios from 'axios'
import localhost from "../../config.js"
import { Row, Container, Col, Nav, Card } from 'react-bootstrap';

export default class NavRight extends Component{
    constructor(props){
        super(props);
        this.state = {
            groupBalances : []
        }

        this.getRightNavbarItems();
    }

    getRightNavbarItems = async () => {
        await axios.get(`${localhost}/groupdetails/${this.props.groupName}`)
        .then((response) => {
            console.log(response.data)
                if(response.data[0]){
                    console.log("here")
                    const list = response.data.filter((res) => {
                        if (res.settled === 'N') {
                          return res;
                        }
                        console.log(list)
                    });
                
                this.setState({
                    groupBalances: list,
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    render(){
        const collectBalances = [];
        const payBalances = [];
        console.log(collectBalances)
        console.log(this.state.groupBalances)
        if(this.state && this.state.groupBalances && this.state.groupBalances.length > 0){
            let collectBalDict = new Map();
            let payBalDict = new Map();
            for (let i = 0; i < this.state.groupBalances.length; i += 1) {
                if (collectBalDict.get(this.state.groupBalances[i].user1)) {
                    collectBalDict.set(this.state.groupBalances[i].user1, collectBalDict.get(this.state.groupBalances[i].user1) + this.state.groupBalances[i].amount);
                } else {
                    collectBalDict.set(this.state.groupBalances[i].user1, this.state.groupBalances[i].amount);
                }
            }
            for (let i = 0; i < this.state.groupBalances.length; i += 1) {
                if (payBalDict.get(this.state.groupBalances[i].user2)) {
                    payBalDict.set(this.state.groupBalances[i].user2, payBalDict.get(this.state.groupBalances[i].user2) + this.state.groupBalances[i].amount);
                } else {
                    payBalDict.set(this.state.groupBalances[i].user2, this.state.groupBalances[i].amount);
                }
            }
            collectBalDict.forEach((key, value) => {
                collectBalances.push(
                    <Row className="paid pt-2">
                        {value}
                    &nbsp;
                    <br />
                    gets back $
                    {key}
                    </Row>,
                );
            });
            payBalDict.forEach((key, value) => {
                payBalances.push(
                    <Row className="owe pt-2">
                        {value}
                    &nbsp;
                    <br />
                    owes $
                    {key}
                    </Row>,
                );
            });
        }
        return(
            <Container className="mt-4">
                <div className="pt-2 text-muted">Group Members</div>
                <div className="pb-5" />
                {collectBalances}
                <div className="p-5" />
                {payBalances}
            </Container>
            
        )
    }
}