import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-form/iron-form.js';
import './ajax-call.js';
import '@polymer/paper-spinner/paper-spinner.js';
import './shared-styles.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/app-route/app-location.js';
import {errorCodes} from './constants.js';
/**
 * @customElement
 * @polymer
 */
class LoginPage extends PolymerElement {
  static get template() {
    return html`
    <style include="shared-styles">
    :host {
      display: block;
      height:80.8vh;
      overflow-y:hidden;
      background-size:cover;
    }
    img{
      margin-top:20px;
      margin-bottom: 0;
      width:150px;
      height:50px
    }
    #google{
      float: right;
    }
    paper-button{
      background: linear-gradient(to right, #4568dc, #b06ab3);
      color: white;
      width:180px;
      margin-top:10px;
    }
    #form
    {
      background:white;
      width:30%;
      margin:70px auto;
      padding:20px;
      box-shadow:0px 0px 5px 2px;
      border-radius:8px;
    }
    paper-input
    {
      color:gray;
    }
    h1
    {
      margin:0;
      padding:0;
    }
    h2{
      text-align:center;
    }
  </style>
  <paper-spinner id="spinner" active="{{waiting}}"></paper-spinner>
  <app-location route={{route}}></app-location>
  <paper-toast text={{message}} id="toast"></paper-toast>
  <ajax-call id="ajax"></ajax-call>
  <iron-form id="form">
  <form>
  <h2>Please Login</h2>
  <paper-input id="mobileNumber" auto-validate required char-counter allowed-pattern=[0-9] minlength="10" error-message="Mobile No. Should be 10 digits" maxlength="10" label="Enter Mobile Number">
  <div slot="suffix"><iron-icon icon="settings-cell"></iron-icon></div></paper-input>
  <paper-input id="password" auto-validate minlength="4" required type="password" label="Password"><div slot="suffix"><iron-icon icon="icons:lock"></iron-icon></div></paper-input>
  <div class="alignCenter">
  <paper-button on-click="_signIn" raised id="loginBtn">LogIn</paper-button>
  </div>
  </form>
  </iron-form>
    `;
  }
  static get properties() {
    return {
      message:{
        type:String,
        value:''
      }
    };
  }
  /**
   * listening customEvents sent from child elements
   */
  ready()
  {
    super.ready();
    this.addEventListener('ajax-response', (e) => this._loginStatus(e))
  }
  /**
   * 
   * @param {mouseEvent} event on SignIn click event is fired
   * validate if mobile No. has 10 digits or not
   * get the user details from the database
   */
  _signIn(){
   if(this.$.form.validate()){
    const mobileNumber = parseInt(this.$.mobileNumber.value);
    const password=this.$.password.value;
    let postObj={mobileNumber,password}
    this.waiting = true;
     this.$.ajax._makeAjaxCall('post',`http://10.117.189.176:9090/adwise/users/login`,postObj,'ajaxResponse')  
    }
    else{
      console.log(errorCodes)
      this.message= errorCodes.DCNC0001;
      this.$.toast.open();
    }
  } 
  /**
   * 
   * @param {*} event 
   * handles the response sent by the database
   * transfer the user on the base of role as customer or staff to respective page
   */
  _loginStatus(event)
  {
    const data=event.detail.data;
    this.waiting = false;
    if(data.statusCode=='DCNC0001')
    {
      this.message= errorCodes.DCNC0001;
    }
    else
    {
      let role=data.role;
      sessionStorage.setItem('userId',data.userId);
      sessionStorage.setItem('userName',data.userName);
      if(role=='ADMIN'){
      window.history.pushState({}, null, '#/admin-home');
      window.dispatchEvent(new CustomEvent('location-changed'));
  }
     if(role=='SALESPERSON'){
    window.history.pushState({}, null, '#/sales-home');
    window.dispatchEvent(new CustomEvent('location-changed'));
  }
}
this.$.toast.open();
}
}
window.customElements.define('login-page', LoginPage);