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
      user.timeZone = this.state.timeZone
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
                <option value="Etc/GMT+12">(GMT-12:00) International Date Line West</option>
                <option value="Pacific/Midway">(GMT-11:00) Midway Island, Samoa</option>
                <option value="Pacific/Honolulu">(GMT-10:00) Hawaii</option>
                <option value="US/Alaska">(GMT-09:00) Alaska</option>
                <option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)</option>
                <option value="America/Tijuana">(GMT-08:00) Tijuana, Baja California</option>
                <option value="US/Arizona">(GMT-07:00) Arizona</option>
                <option value="America/Chihuahua">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
                <option value="US/Mountain">(GMT-07:00) Mountain Time (US & Canada)</option>
                <option value="America/Managua">(GMT-06:00) Central America</option>
                <option value="US/Central">(GMT-06:00) Central Time (US & Canada)</option>
                <option value="America/Mexico_City">(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
                <option value="Canada/Saskatchewan">(GMT-06:00) Saskatchewan</option>
                <option value="America/Bogota">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
                <option value="US/Eastern">(GMT-05:00) Eastern Time (US & Canada)</option>
                <option value="US/East-Indiana">(GMT-05:00) Indiana (East)</option>
                <option value="Canada/Atlantic">(GMT-04:00) Atlantic Time (Canada)</option>
                <option value="America/Caracas">(GMT-04:00) Caracas, La Paz</option>
                <option value="America/Manaus">(GMT-04:00) Manaus</option>
                <option value="America/Santiago">(GMT-04:00) Santiago</option>
                <option value="Canada/Newfoundland">(GMT-03:30) Newfoundland</option>
                <option value="America/Sao_Paulo">(GMT-03:00) Brasilia</option>
                <option value="America/Argentina/Buenos_Aires">(GMT-03:00) Buenos Aires, Georgetown</option>
                <option value="America/Godthab">(GMT-03:00) Greenland</option>
                <option value="America/Montevideo">(GMT-03:00) Montevideo</option>
                <option value="America/Noronha">(GMT-02:00) Mid-Atlantic</option>
                <option value="Atlantic/Cape_Verde">(GMT-01:00) Cape Verde Is.</option>
                <option value="Atlantic/Azores">(GMT-01:00) Azores</option>
                <option value="Africa/Casablanca">(GMT+00:00) Casablanca, Monrovia, Reykjavik</option>
                <option value="Etc/Greenwich">(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London</option>
                <option value="Europe/Amsterdam">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
                <option value="Europe/Belgrade">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
                <option value="Europe/Brussels">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
                <option value="Europe/Sarajevo">(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</option>
                <option value="Africa/Lagos">(GMT+01:00) West Central Africa</option>
                <option value="Asia/Amman">(GMT+02:00) Amman</option>
                <option value="Europe/Athens">(GMT+02:00) Athens, Bucharest, Istanbul</option>
                <option value="Asia/Beirut">(GMT+02:00) Beirut</option>
                <option value="Africa/Cairo">(GMT+02:00) Cairo</option>
                <option value="Africa/Harare">(GMT+02:00) Harare, Pretoria</option>
                <option value="Europe/Helsinki">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option>
                <option value="Asia/Jerusalem">(GMT+02:00) Jerusalem</option>
                <option value="Europe/Minsk">(GMT+02:00) Minsk</option>
                <option value="Africa/Windhoek">(GMT+02:00) Windhoek</option>
                <option value="Asia/Kuwait">(GMT+03:00) Kuwait, Riyadh, Baghdad</option>
                <option value="Europe/Moscow">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
                <option value="Africa/Nairobi">(GMT+03:00) Nairobi</option>
                <option value="Asia/Tbilisi">(GMT+03:00) Tbilisi</option>
                <option value="Asia/Tehran">(GMT+03:30) Tehran</option>
                <option value="Asia/Muscat">(GMT+04:00) Abu Dhabi, Muscat</option>
                <option value="Asia/Baku">(GMT+04:00) Baku</option>
                <option value="Asia/Yerevan">(GMT+04:00) Yerevan</option>
                <option value="Asia/Kabul">(GMT+04:30) Kabul</option>
                <option value="Asia/Yekaterinburg">(GMT+05:00) Yekaterinburg</option>
                <option value="Asia/Karachi">(GMT+05:00) Islamabad, Karachi, Tashkent</option>
                <option value="Asia/Calcutta">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                <option value="Asia/Calcutta">(GMT+05:30) Sri Jayawardenapura</option>
                <option value="Asia/Katmandu">(GMT+05:45) Kathmandu</option>
                <option value="Asia/Almaty">(GMT+06:00) Almaty, Novosibirsk</option>
                <option value="Asia/Dhaka">(GMT+06:00) Astana, Dhaka</option>
                <option value="Asia/Rangoon">(GMT+06:30) Yangon (Rangoon)</option>
                <option value="Asia/Bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                <option value="Asia/Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
                <option value="Asia/Hong_Kong">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
                <option value="Asia/Kuala_Lumpur">(GMT+08:00) Kuala Lumpur, Singapore</option>
                <option value="Asia/Irkutsk">(GMT+08:00) Irkutsk, Ulaan Bataar</option>
                <option value="Australia/Perth">(GMT+08:00) Perth</option>
                <option value="Asia/Taipei">(GMT+08:00) Taipei</option>
                <option value="Asia/Tokyo">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
                <option value="Asia/Seoul">(GMT+09:00) Seoul</option>
                <option value="Asia/Yakutsk">(GMT+09:00) Yakutsk</option>
                <option value="Australia/Adelaide">(GMT+09:30) Adelaide</option>
                <option value="Australia/Darwin">(GMT+09:30) Darwin</option>
                <option value="Australia/Brisbane">(GMT+10:00) Brisbane</option>
                <option value="Australia/Canberra">(GMT+10:00) Canberra, Melbourne, Sydney</option>
                <option value="Australia/Hobart">(GMT+10:00) Hobart</option>
                <option value="Pacific/Guam">(GMT+10:00) Guam, Port Moresby</option>
                <option value="Asia/Vladivostok">(GMT+10:00) Vladivostok</option>
                <option value="Asia/Magadan">(GMT+11:00) Magadan, Solomon Is., New Caledonia</option>
                <option value="Pacific/Auckland">(GMT+12:00) Auckland, Wellington</option>
                <option value="Pacific/Fiji">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
                <option value="Pacific/Tongatapu">(GMT+13:00) Nuku&apos;alofa</option>
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