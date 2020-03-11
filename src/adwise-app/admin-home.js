import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './shared-table.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@fooloomanzoo/datetime-picker/overlay-date-picker';
import '@fooloomanzoo/datetime-picker/date-picker.js';
import '@fooloomanzoo/datetime-picker/time-picker.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './ajax-call.js';
import './shared-styles.js';
import '@polymer/app-route/app-location.js';
import '@polymer/paper-toast/paper-toast.js';
import { errorCodes } from './constants.js';
/**
* @customElement
* @polymer
*/
class AdminHome extends PolymerElement {
  static get template() {
    return html`
<style include="shared-styles">
  :host {
    display: block;
    width:98%;
    margin:0px auto;
  }
  #btn-container {
    display: flex;
    justify-content: space-between;
  }

  #addSlotDialog {
    margin: 10px;
    max-height:none !important;
    border: 2px solid;
    border-color: steelblue;
  }
  #viewPlan
  {
    margin-bottom:20px;
  }
  #confirmAdd
  {
    background:green;
    color:white;
  }
  .tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted white;
  }
  
  .tooltip .tooltiptext {
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    top: 150%;
    left: 50%;
    margin-left: -60px;
  }
  
  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 90%;
    margin-left: -5px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent white transparent;
  }
  #validationMessage
  {
    color:red;
  }
</style>
<paper-spinner id="spinner" active="{{waiting}}"></paper-spinner>
<app-location id="location" route={{route}}></app-location>
<div id="btn-container">
  <paper-button raised id="bookedSlots" on-click="_handleBook">Booked Slots</paper-button>
  <paper-button raised id="addSlot" on-click="_handleOpenDialog">Add Slot</paper-button>
</div>
<div class="tooltip">
<paper-dialog id="addSlotDialog" class="tooltiptext" no-overlap horizontal-align="right" vertical-align="top">
<p id="validationMessage">{{dateValidationMessage}}</p>
  <div id="datePicker">
  <h2>Select Date</h2>
  <label for="date">Date:</label><date-picker id="date" min="{{min}}" horizontal-align="right"></date-picker>
  </div>
  <div id=timePicker>
    <h2>Select Time</h2>
    <label for="fromTime">From :</label><time-picker id="fromTime" horizontal-align="right"></time-picker>
    <label for="toTime">To :</label><time-picker id="toTime" horizontal-align="right"></time-picker>
  </div>
  <div hidden$={{hide}}>
  <h2>Plan Details:</h2>
  <p>Plan Name:{{planDetails.planName}}</p>
  <p>Plan Rate:INR {{planDetails.planRate}}/Sec</p>
  </div>
  <div class="alignCenter" hidden$={{!hide}}>
  <paper-button raised id="viewPlan" on-click="_handleView">View Plan</paper-button>
  </div>
  <div class="alignCenter" hidden$={{hide}}>
  <paper-button raised id="confirmAdd" on-click="_handleConfirm">Confirm</paper-button>
  </div>
</paper-dialog>
</div>
<paper-dialog id="info" class="colored" modal>
<h2 id="message">{{message}}</h2>
<div class="alignCenter">
<paper-button dialog-dismiss raised>Ok</paper-button>
</div>
</paper-dialog>
<div>
<h2>Select Date</h2>
     Date :<date-picker id="checkDate"></date-picker>
     <paper-button on-click="_handleClick" raised id="addedSlots">Search</paper-button>
     </div>
<ajax-call id="ajax"></ajax-call>
<shared-table headings={{headings}} rows={{rows}}></shared-table>
<h1 class="alignCenter">{{searchResults}}</h1>
<paper-toast text={{message}} id="toast"></paper-toast>
`;
  }
  static get properties() {
    return {
      headings: {
        type: Array,
        value: ['Name', 'Class', 'RollNo']
      },
      rows: {
        type: Array,
        value: []
      },
      hide: {
        type: Boolean,
        value: true
      },
      planDetails: {
        type: Object,
        value: {
          planId: 1,
          planName: "Platinum",
          planRate: 500,
          statusCode: 200,
          message: "SUCCESSFUL"
        }
      },
      headings: {
        type: Array,
        value: [{ name: "slotId", value: "Slot Id" }, { name: "slotDate", value: "Date(YYYY-MM-DD)" },
        { name: "slotFromTime", value: "From Time" }, { name: "slotToTime", value: "To Time" }, { name: "planName", value: "Plan" }, { name: "slotStatus", value: "Available" }]
      },
      isLogin: {
        type: Boolean,
        value: false,
        notify: true
      },
      userName:{
        type:String,
        value:'',
        notify:true
      }
    };
  }
  ready() {
    super.ready();
    this.addEventListener('ajax-response', (e) => this._viewPlans(e))
    this.addEventListener('confirm-slot', (e) => this._bookSlot(e))
    this.addEventListener('available-slots', (e) => this._availableSlots(e))
    console.log(window.innerHeight * 0.01)
  }
  connectedCallback() {
    super.connectedCallback();
    this.userName=sessionStorage.getItem('userName');
    this.isLogin = false;
    let date = new Date();
    let currentDate = date.toISOString().slice(0, 10)
    this.min = currentDate;
  }
  /**
   * @description:_handleClick() gets the list of available slots
   */
  _handleClick() {
    this.checkDate = this.$.checkDate.date;
    console.log(this.checkDate)
    this.$.ajax._makeAjaxCall('get', `http://13.233.200.130:9090/adwise/slots?slotDate=${this.checkDate}`, null, 'availableSlots')
  }
  /**
   *@description:_handleBook() navigates to added-slots page
   */
  _handleBook() {
    window.history.pushState({}, null, '#/added-slots');
    window.dispatchEvent(new CustomEvent('location-changed'));
  }
  _availableSlots(event) {
    if (event.detail.data.statusCode == 'DCNC0002') {
      console.log(event.detail.data.message);
      this.searchResults = errorCodes.DCNC0002;//event.detail.data.message;
    }
    this.rows = event.detail.data.slotList;
  }
  _handleConfirm() {
    const postObj = {
      planId: this.planId,
      slotDate: this.date,
      slotFromTime: this.fromTime,
      slotToTime: this.toTime
    }
    this.$.ajax._makeAjaxCall('post', `http://13.233.200.130:9090/adwise/users/${parseInt(sessionStorage.getItem('userId'))}/slot`, postObj, 'confirmSlot');
  }
  _bookSlot(event) {
    if (event.detail.data.statusCode === 'DCNC0005') {
      this.message = errorCodes.DCNC0005;
    }
    else{
    this.message = "Slot Booked Successfully";
    }//event.detail.data.message;
    this.$.info.open();
  }
  /**
   * 
   * @param {*} event opens the aligned-dialog
   */
  _handleOpenDialog(event) {
    this.$.addSlotDialog.positionTarget = event.target;
    this.$.addSlotDialog.open();
  }
  _viewPlans(event) {
    this.waiting = false;
    if (event.detail.data.statusCode == 200) {
      this.planDetails = event.detail.data;
      this.planId = event.detail.data.planId;
      this.hide = false;
    }
    if (event.detail.data.statusCode == 204) {
      this.message=errorCodes.DCNC0003;
      this.$.toast.open();
    }
  }
  _handleView() {
    this.date = this.$.date.date;
    console.log(this.date)
    this.fromTime = this.$.fromTime.time.slice(0, 8);
    this.toTime = this.$.toTime.time.slice(0, 8);
    if (this.fromTime > this.toTime) {
      this.$.addSlotDialog.style.border = "2px solid red";
      this.dateValidationMessage = "Please enter To time greater than From time";
    }
    else {
      this.dateValidationMessage = ''
      this.$.addSlotDialog.style.border = "2px solid steelblue";
      this.waiting = true;
      this.$.ajax._makeAjaxCall('get', `http://13.233.200.130:9090/adwise/plans?date=${this.date}&fromTime=${this.fromTime}&toTime=${this.toTime}`, null, 'ajaxResponse');
    }
  }
}
window.customElements.define('admin-home', AdminHome);
