import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import default_pic from '../../images/profile_default_image.png'
import axios from 'axios'
import localhost from "../../config.js"

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    
    this.fetchUserDetails();
  }
  fetchUserDetails = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    axios.get(`${localhost}/profile/${user.userId}`)
    .then(res => {
      // console.log(res);
      // this.setState({ profile : res.data });
      this.setState({ userId: res.data.user_id });
      this.setState({ email: res.data.email });
      this.setState({ name: res.data.user_name });
      this.setState({ language: res.data.language });
      this.setState({ timeZone: res.data.timeZone });
      this.setState({ phone: res.data.phone });
      this.setState({ currency: res.data.currency });
      // this.setState({ currency: res.data.image });
      // this.setState({ profileImage: res.data.results[0].profileImage })
    })
      .catch(err => console.log(err))
  }
  // changeProfileImage = (event) => {

  //   this.setState({ uploadedFile: event.target.files[0] });
  // }

  onChangeFields = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  UpdateProfileHandler = (e) => {
    e.preventDefault();
    //create object of form data
    // const formData = new FormData();
    // // formData.append("profileImage",this.state.uploadedFile);
    // formData.append("user_id", this.state.user_id);
    // formData.append("name",this.state.user_name);
    // formData.append("email",this.state.email);
    // formData.append("phone",this.state.phone);
    // formData.append("language",this.state.language);
    // formData.append("currency",this.state.currency);
    // formData.append("timezone",this.state.timeZone);

    const data = { ...this.state }
    const user = JSON.parse(localStorage.getItem('user'));
    data.userId = user.userId;
    //update-profile
    axios.post(`${localhost}/profile`, data).then(res => {
      // console.log(data)
      console.log(res);
      this.setState({
        message: res.data
      });
      // this.setState({ userId : res.data.results.userId})
      // this.setState({ name: res.data.results.user_name });
      // this.setState({ email: res.data.results.email });
      // this.setState({ phone: res.data.results.phone });
      // this.setState({ currency: res.data.results.currency });
      // this.setState({ language: res.data.results.language });
      // this.setState({ timezone: res.data.results.timeZone });
    })
      .catch(err => console.log(err))
  }


  // componentDidMount() {
  //   this.fetchUserDetails(this.state.user_id);
  // }

  render() {
    if(this.state.message === 'Profile Updated'){
      const user = JSON.parse(localStorage.getItem('user'))
      user.user_name = this.state.name
      localStorage.setItem('user',JSON.stringify(user))
      return <Redirect to="/dashboard" />;
    }
    if(!localStorage.getItem('user')){
      return <Redirect to="/home" />;
    }
    return (
      <Container>
        <Row style = {{
          marginRight : '20px',
          marginBottom : '15px',
          marginLeft : '-20px',
          width : '620px',
          
        }}>
          <h1>Your Account</h1>
        </Row>
        <Row>
          <Col lg = '3'>
            <Form.Group controlId="formCategory1">
              <img
                  width={200}
                  height={200}
                  className="mr-2"
                  src= {default_pic}
                  alt="Generic placeholder"
                />
                <Form.Control type="file" name="profileImage" onChange={this.onChangeFields} />
            </Form.Group>
            {/* <Button variant="primary" onClick={this.UpdateProfileHandler}>Save</Button> */}
          </Col>
          <Col lg = '3'>
            <Form className="form">
              <Form.Group controlId="formCategory2">
                <Form.Label>Your name</Form.Label>
                <Form.Control name = "name" type="text" onChange= {this.onChangeFields} value = {this.state.name} />

              </Form.Group>
              <Form.Group controlId="formCategory3">
                <Form.Label>Your email address</Form.Label>
                <Form.Control name = "email" type="email"  onChange= {this.onChangeFields} value={this.state.email} />
              </Form.Group>
              <Form.Group controlId="formCategory4">
                <Form.Label>Your phone number</Form.Label>
                <Form.Control name = "phone" type="text"  onChange= {this.onChangeFields} value={this.state.phone} />
              </Form.Group>
            </Form>
          </Col>
          <Col lg = '3'>
            <Form.Group controlId="formCategory6">
              <Form.Label>Your default currency</Form.Label>
              {/* <Form.Label>(for future expenses)</Form.Label> */}
              <Form.Control name = "currency" as="select"  onChange= {this.onChangeFields} value = {this.state.currency}>
                <option value="USD">USD ($)</option>
                <option value="KWD">KWD (KWD)</option>
                <option value="BHD">BHD (BD)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="CAD">CAD ($)</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCategory7">
              <Form.Label>Your time zone</Form.Label>
              <Form.Control name = "timeZone" as="select" onChange= {this.onChangeFields} value = {this.state.timeZone} >
                <option value="International Date Line West">(GMT-12:00) International Date Line West</option>
                <option value="American Samoa">(GMT-11:00) American Samoa</option>
                <option value="Midway Island">(GMT-11:00) Midway Island</option>
                <option value="Hawaii">(GMT-10:00) Hawaii</option>
                <option value="Alaska">(GMT-09:00) Alaska</option>
                <option value="PST">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
                <option value="Tijuana">(GMT-08:00) Tijuana</option>
                <option value="Arizona">(GMT-07:00) Arizona</option>
                <option value="Chihuahua">(GMT-07:00) Chihuahua</option>
                <option value="Mazatlan">(GMT-07:00) Mazatlan</option>
                <option value="Mountain Time (US &amp; Canada)">(GMT-07:00) Mountain Time (US &amp; Canada)</option>
                <option value="Central America">(GMT-06:00) Central America</option>
                <option value="Central Time (US &amp; Canada)">(GMT-06:00) Central Time (US &amp; Canada)</option>
                <option value="Guadalajara">(GMT-06:00) Guadalajara</option>
                <option value="Mexico City">(GMT-06:00) Mexico City</option>
                <option value="Monterrey">(GMT-06:00) Monterrey</option>
                <option value="Saskatchewan">(GMT-06:00) Saskatchewan</option>
                <option value="Bogota">(GMT-05:00) Bogota</option>
                <option value="Eastern Time (US &amp; Canada)">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                <option value="Indiana (East)">(GMT-05:00) Indiana (East)</option>
                <option value="Lima">(GMT-05:00) Lima</option>
                <option value="Quito">(GMT-05:00) Quito</option>
                <option value="Atlantic Time (Canada)">(GMT-04:00) Atlantic Time (Canada)</option>
                <option value="Caracas">(GMT-04:00) Caracas</option>
                <option value="Georgetown">(GMT-04:00) Georgetown</option>
                <option value="La Paz">(GMT-04:00) La Paz</option>
                <option value="Puerto Rico">(GMT-04:00) Puerto Rico</option>
                <option value="Santiago">(GMT-04:00) Santiago</option>
                <option value="Newfoundland">(GMT-03:30) Newfoundland</option>
                <option value="Brasilia">(GMT-03:00) Brasilia</option>
                <option value="Buenos Aires">(GMT-03:00) Buenos Aires</option>
                <option value="Greenland">(GMT-03:00) Greenland</option>
                <option value="Montevideo">(GMT-03:00) Montevideo</option>
                <option value="Mid-Atlantic">(GMT-02:00) Mid-Atlantic</option>
                <option value="Azores">(GMT-01:00) Azores</option>
                <option value="Cape Verde Is.">(GMT-01:00) Cape Verde Is.</option>
                <option value="Edinburgh">(GMT+00:00) Edinburgh</option>
                <option value="Lisbon">(GMT+00:00) Lisbon</option>
                <option value="London">(GMT+00:00) London</option>
                <option value="Monrovia">(GMT+00:00) Monrovia</option>
                <option value="UTC">(GMT+00:00) UTC</option>
                <option value="Amsterdam">(GMT+01:00) Amsterdam</option>
                <option value="Belgrade">(GMT+01:00) Belgrade</option>
                <option value="Berlin">(GMT+01:00) Berlin</option>
                <option value="Bern">(GMT+01:00) Bern</option>
                <option value="Bratislava">(GMT+01:00) Bratislava</option>
                <option value="Brussels">(GMT+01:00) Brussels</option>
                <option value="Budapest">(GMT+01:00) Budapest</option>
                <option value="Casablanca">(GMT+01:00) Casablanca</option>
                <option value="Copenhagen">(GMT+01:00) Copenhagen</option>
                <option value="Dublin">(GMT+01:00) Dublin</option>
                <option value="Ljubljana">(GMT+01:00) Ljubljana</option>
                <option value="Madrid">(GMT+01:00) Madrid</option>
                <option value="Paris">(GMT+01:00) Paris</option>
                <option value="Prague">(GMT+01:00) Prague</option>
                <option value="Sarajevo">(GMT+01:00) Sarajevo</option>
                <option value="Skopje">(GMT+01:00) Skopje</option>
                <option value="Rome">(GMT+01:00) Rome</option>
                <option value="Stockholm">(GMT+01:00) Stockholm</option>
                <option value="Vienna">(GMT+01:00) Vienna</option>
                <option value="Warsaw">(GMT+01:00) Warsaw</option>
                <option value="West Central Africa">(GMT+01:00) West Central Africa</option>
                <option value="Zagreb">(GMT+01:00) Zagreb</option>
                <option value="Zurich">(GMT+01:00) Zurich</option>
                <option value="Athens">(GMT+02:00) Athens</option>
                <option value="Bucharest">(GMT+02:00) Bucharest</option>
                <option value="Cairo">(GMT+02:00) Cairo</option>
                <option value="Harare">(GMT+02:00) Harare</option>
                <option value="Helsinki">(GMT+02:00) Helsinki</option>
                <option value="Jerusalem">(GMT+02:00) Jerusalem</option>
                <option value="Kaliningrad">(GMT+02:00) Kaliningrad</option>
                <option value="Kyiv">(GMT+02:00) Kyiv</option>
                <option value="Pretoria">(GMT+02:00) Pretoria</option>
                <option value="Riga">(GMT+02:00) Riga</option>
                <option value="Sofia">(GMT+02:00) Sofia</option>
                <option value="Tallinn">(GMT+02:00) Tallinn</option>
                <option value="Vilnius">(GMT+02:00) Vilnius</option>
                <option value="Baghdad">(GMT+03:00) Baghdad</option>
                <option value="Istanbul">(GMT+03:00) Istanbul</option>
                <option value="Kuwait">(GMT+03:00) Kuwait</option>
                <option value="Minsk">(GMT+03:00) Minsk</option>
                <option value="Moscow">(GMT+03:00) Moscow</option>
                <option value="Nairobi">(GMT+03:00) Nairobi</option>
                <option value="Riyadh">(GMT+03:00) Riyadh</option>
                <option value="St. Petersburg">(GMT+03:00) St. Petersburg</option>
                <option value="Volgograd">(GMT+03:00) Volgograd</option>
                <option value="Tehran">(GMT+03:30) Tehran</option>
                <option value="Abu Dhabi">(GMT+04:00) Abu Dhabi</option>
                <option value="Baku">(GMT+04:00) Baku</option>
                <option value="Muscat">(GMT+04:00) Muscat</option>
                <option value="Samara">(GMT+04:00) Samara</option>
                <option value="Tbilisi">(GMT+04:00) Tbilisi</option>
                <option value="Yerevan">(GMT+04:00) Yerevan</option>
                <option value="Kabul">(GMT+04:30) Kabul</option>
                <option value="Ekaterinburg">(GMT+05:00) Ekaterinburg</option>
                <option value="Islamabad">(GMT+05:00) Islamabad</option>
                <option value="Karachi">(GMT+05:00) Karachi</option>
                <option value="Tashkent">(GMT+05:00) Tashkent</option>
                <option value="Chennai">(GMT+05:30) Chennai</option>
                <option value="Kolkata">(GMT+05:30) Kolkata</option>
                <option value="Mumbai">(GMT+05:30) Mumbai</option>
                <option value="New Delhi">(GMT+05:30) New Delhi</option>
                <option value="Sri Jayawardenepura">(GMT+05:30) Sri Jayawardenepura</option>
                <option value="Kathmandu">(GMT+05:45) Kathmandu</option>
                <option value="Almaty">(GMT+06:00) Almaty</option>
                <option value="Astana">(GMT+06:00) Astana</option>
                <option value="Dhaka">(GMT+06:00) Dhaka</option>
                <option value="Urumqi">(GMT+06:00) Urumqi</option>
                <option value="Rangoon">(GMT+06:30) Rangoon</option>
                <option value="Bangkok">(GMT+07:00) Bangkok</option>
                <option value="Hanoi">(GMT+07:00) Hanoi</option>
                <option value="Jakarta">(GMT+07:00) Jakarta</option>
                <option value="Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
                <option value="Novosibirsk">(GMT+07:00) Novosibirsk</option>
                <option value="Beijing">(GMT+08:00) Beijing</option>
                <option value="Chongqing">(GMT+08:00) Chongqing</option>
                <option value="Hong Kong">(GMT+08:00) Hong Kong</option>
                <option value="Irkutsk">(GMT+08:00) Irkutsk</option>
                <option value="Kuala Lumpur">(GMT+08:00) Kuala Lumpur</option>
                <option value="Perth">(GMT+08:00) Perth</option>
                <option value="Singapore">(GMT+08:00) Singapore</option>
                <option value="Taipei">(GMT+08:00) Taipei</option>
                <option value="Ulaanbaatar">(GMT+08:00) Ulaanbaatar</option>
                <option value="Osaka">(GMT+09:00) Osaka</option>
                <option value="Sapporo">(GMT+09:00) Sapporo</option>
                <option value="Seoul">(GMT+09:00) Seoul</option>
                <option value="Tokyo">(GMT+09:00) Tokyo</option>
                <option value="Yakutsk">(GMT+09:00) Yakutsk</option>
                <option value="Adelaide">(GMT+09:30) Adelaide</option>
                <option value="Darwin">(GMT+09:30) Darwin</option>
                <option value="Brisbane">(GMT+10:00) Brisbane</option>
                <option value="Canberra">(GMT+10:00) Canberra</option>
                <option value="Guam">(GMT+10:00) Guam</option>
                <option value="Hobart">(GMT+10:00) Hobart</option>
                <option value="Melbourne">(GMT+10:00) Melbourne</option>
                <option value="Port Moresby">(GMT+10:00) Port Moresby</option>
                <option value="Sydney">(GMT+10:00) Sydney</option>
                <option value="Vladivostok">(GMT+10:00) Vladivostok</option>
                <option value="Magadan">(GMT+11:00) Magadan</option>
                <option value="New Caledonia">(GMT+11:00) New Caledonia</option>
                <option value="Solomon Is.">(GMT+11:00) Solomon Is.</option>
                <option value="Srednekolymsk">(GMT+11:00) Srednekolymsk</option>
                <option value="Auckland">(GMT+12:00) Auckland</option>
                <option value="Fiji">(GMT+12:00) Fiji</option>
                <option value="Kamchatka">(GMT+12:00) Kamchatka</option>
                <option value="Marshall Is.">(GMT+12:00) Marshall Is.</option>
                <option value="Wellington">(GMT+12:00) Wellington</option>
                <option value="Chatham Is.">(GMT+12:45) Chatham Is.</option>
                <option value="Nuku'alofa">(GMT+13:00) Nuku'alofa</option>
                <option value="Samoa">(GMT+13:00) Samoa</option>
                <option value="Tokelau Is.">(GMT+13:00) Tokelau Is.</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCategory8">
              <Form.Label>Language</Form.Label>
              <Form.Control name = "language" as="select"  value= {this.state.language} onChange = {this.onChangeFields}>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="id">Bahasa Indonesia</option>
                <option value="it">Italiano</option>
                <option value="ja">日本語</option>
                <option value="nl">Nederlands</option>
                <option value="pt-BR">Português (Brasil)</option>
                <option value="pt-PT">Português (Portugal)</option>
                <option value="sv">Svenska</option>
                <option value="th">ภาษาไทย</option>
                <option value="emoji">😀</option>
              </Form.Control>
            </Form.Group>
          </Col>

        </Row>
        <Row>
          <div style =
                    {{marginLeft: '740px',
                      textAlign: 'right',
                      width : '220px'
                    }}>&nbsp;
          <button type="submit" onClick={this.UpdateProfileHandler} className="btn btn-primary btn-lg">Save</button>
          </div>
        </Row>
      </Container>
      // <Container lg='3' >
      //   <Row>
      //     <h1>Your Account</h1>
      //   </Row>
      //   <Form>
      //     <div>
      //       <Row>
      //         <Col md='3'>
      //           <img
      //             width={200}
      //             height={200}
      //             className="mr-2"
      //             src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"
      //             alt="Generic placeholder"
      //           />
      //           <Row>
      //             Change your avatar
      //           </Row>
      //           <Row>
      //             <button type="submit">Choose file</button>
      //           </Row>
      //         </Col>
      //         <Col md='3'>
      //           <div>
      //             <Row>
      //               <Form.Label>Your name</Form.Label>
      //             </Row>
      //             <Row>
      //               <text>{currentUser.user_name}</text>
      //             </Row>
      //           </div>
      //           <div>
      //             <Row>
      //               <Form.Label>Your email</Form.Label>
      //             </Row>
      //             <Row>
      //               <text>{currentUser.email}</text>
      //             </Row>
      //           </div>
      //           <div>
      //             <Row>
      //               <Form.Label>Your phone</Form.Label>
      //             </Row>
      //             <Row>
      //               <text>{currentUser.phone}</text>
      //             </Row>
      //           </div>

      //         </Col>
      //       </Row>
      //     </div>

      //   </Form>

      // </Container>
    );
  }
}

// const mapStatetoProps=(state)=>{
//   const {}
//   return{
//       user_id:state.user.userDetails.user_id,
//       // name:state.user.userDetails.user_name,
//       email:state.user.email,
//       phone: state.user.profileImage,
//       currency:state.user.currency
//   }
//  }
 
 

 export default Profile;