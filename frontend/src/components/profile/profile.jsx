import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { Col, Button, Form, Row, Image } from "react-bootstrap";
import default_pic from '../../images/profile_default_image.png'
import axios from 'axios'
import localhost from "../../config.js"

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.fetchUserDetails();
  }
  fetchUserDetails = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    await axios.get(`${localhost}/profile/${user.userId}`)
      .then(res => {
        console.log(res);
        const profile = res.data
        this.setState(profile)
        localStorage.setItem('user', JSON.stringify(res.data))
        // this.setState({ profile : res.data });
        // this.setState({ userId: res.data.user_id });
        // this.setState({ email: res.data.email });
        // this.setState({ name: res.data.user_name });
        // this.setState({ language: res.data.language });
        // this.setState({ timeZone: res.data.timeZone });
        // this.setState({ phone: res.data.phone });
        // this.setState({ currency: res.data.currency });
        // this.setState({ image: res.data.image });
        // console.log(this.state)
        // this.setState({ profileImage: res.data.results[0].profileImage })
      })
      .catch(err => console.log(err))
  }
  changeProfileImage = (event) => {

    this.setState({
      uploadedFile: event.target.files[0]
    });
  }
  onUpload = async () => {
    console.log(this.state.uploadedFile)
    const user = JSON.parse(localStorage.getItem('user')).userId;
    const formData = new FormData();
    formData.append("userId", user)
    formData.append("image", this.state.uploadedFile)

    await axios.post(`${localhost}/upload`, formData)
      .then((response) => {
        this.setState({
          image : response.data,
          
        })
      })
    // console.log(this.state.uploadedFile)
  }

  onChangeFields = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  UpdateProfileHandler = async (e) => {
    e.preventDefault();
    //create object of form data
    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem('user')).userId;
    // formData.append("image", this.state.uploadedFile);
    formData.append("userId", user);
    formData.append("name", this.state.user_name);
    formData.append("email", this.state.email);
    formData.append("phone", this.state.phone);
    formData.append("language", this.state.language);
    formData.append("currency", this.state.currency);
    formData.append("timeZone", this.state.timeZone);

    // const data = { ...this.state }

    // data.userId = user.userId;
    //update-profile
    await axios.post(`${localhost}/profile`, formData).then(res => {
      // console.log(data)
      console.log(res);
      this.setState({
        message: res.data.message,
        // image: res.data.image,
        ...this.fetchUserDetails()
      });
      if(this.state.message === "Profile Updated"){
        alert("Profile updated")
      }
      // this.fetchUserDetails();
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
    let profilePic  = null;
    if(this.state) {
       profilePic = `${localhost}/upload/${this.state.image}`;
      // console.log(JSON.stringify(localStorage.getItem('user')).image)
      // return <Redirect to="/dashboard" />;
    }
    if (!localStorage.getItem('user')) {
      return <Redirect to="/home" />;
    }
    return (
      <Row className = "mt-5">
        <Col md = "4">
            <Row style = {{ justifyContent : "center"}}>
              <h4>Your Account</h4>
            </Row>
            <Row style = {{ justifyContent : "center"}}>
              <Image
                style={{ width: '15rem' }}
                src={profilePic}
                alt="Generic placeholder"
              />
            </Row>
            <Row style={{ justifyContent: "center" }} className = "pt-2 pl-5">
                <Form onSubmit={this.onUpload} >
                  <Form.Group >
                    <Form.Control type="file" name="image" onChange={this.changeProfileImage} />
                    
                    <Button type="submit" size = "sm" style = {{marginTop : "5px"}}>Upload</Button>
                  </Form.Group>
                </Form>
            </Row>
        </Col>
          <Col md = "5">
          <Form onSubmit={this.UpdateProfileHandler}>
            <Form.Row>
              <Form.Group as = {Col}>
                <div>
                  <Form.Label>Your name</Form.Label>
                  <Form.Control size = "sm" name="name" type="text" onChange={this.onChangeFields} value={this.state.user_name} />

                  <Form.Label>Your email address</Form.Label>
                  <Form.Control size = "sm" name="email" type="email" onChange={this.onChangeFields} value={this.state.email} />
                
                  <Form.Label>Your phone number</Form.Label>
                  <Form.Control size = "sm" name="phone" type="text" onChange={this.onChangeFields} value={this.state.phone} required />
                </div>
              </Form.Group>
              <Form.Group as = {Col}>
                <div>
                  <Form.Label>Your default currency</Form.Label>
                  {/* <Form.Label>(for future expenses)</Form.Label> */}
                  <Form.Control size = "sm" name="currency" as="select" onChange={this.onChangeFields} value={this.state.currency} required>
                    <option value="USD">USD ($)</option>
                    <option value="KWD">KWD (KWD)</option>
                    <option value="BHD">BHD (BD)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CAD">CAD ($)</option>
                  </Form.Control>
                
                  <Form.Label>Your time zone</Form.Label>
                  <Form.Control size = "sm" name="timeZone" as="select" onChange={this.onChangeFields} value={this.state.timeZone} required >
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
                
                  <Form.Label>Language</Form.Label>
                  <Form.Control size = "sm" name="language" as="select" value={this.state.language} onChange={this.onChangeFields} required>
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
                  </div>
                </Form.Group>
            </Form.Row>
            <Form.Row style={{ textAlign: "right" }}>
              <Form.Group as={Col} >
                <Button type="submit">Save</Button>
              </Form.Group>
            </Form.Row>
              
            </Form> 
          </Col>
      </Row>
    );
  }
}
export default Profile;