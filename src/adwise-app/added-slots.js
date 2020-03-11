import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './shared-table.js';
import './ajax-call.js';
import '@fooloomanzoo/datetime-picker/overlay-date-picker';
import '@fooloomanzoo/datetime-picker/time-picker.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import { errorCodes } from './constants.js';
import '@polymer/paper-toast/paper-toast.js';

/**
 * @customElement
 * @polymer
 */
class AddedSlots extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width:98%;
          margin:0px auto;
        }
        table {
          border-collapse: collapse;
          width: 100%;
      }
  
      thead,
      td {
          padding: 10px;
      }
  
      thead {
          font-weight: bolder;
      }
  
      tr:nth-child(even) {
          background-color: #f2f2f2;
      }
  
      th {
          color: white;
          font-weight: bolder;
          text-align: left;
          background-color: blue;
      }
      paper-card
      {
        margin-right:20px;
        margin-bottom:20px;
      }
      #back
      {
        float:right;
      }
      </style>
      <paper-toast text={{message}} id="toast"></paper-toast>
      <ajax-call id="ajax"></ajax-call>
      <paper-button raised id="back" on-click="_handleBack">Back</paper-button>
      <div id=datePicker>
      <h2>Select Date</h2>
           Date :<date-picker id="checkDate"></date-picker>
           <paper-button on-click="_handleClick" raised id="addedSlots">Search</paper-button>
           </div>
      <h2>Added Slots</h2>
      <template is="dom-repeat" items={{bookedSlotDetails}}>
        <p class="slotDate"><b>Slot Time:</b> {{item.slotFromTime}}-{{item.slotToTime}}</p>
      <template is="dom-repeat" items={{item.bookedSlot}} as="slot">
      <paper-card image="" elevation="2" animated-shadow="false">
        <div class="card-content">
        <p><b>Slot Date:</b> {{slot.slotDate}}</p>
        <p><b>Slot FromTime:</b> {{slot.slotFromTime}}</p>
        <p><b>Slot ToTime:</b> {{slot.slotToTime}}</p>
        <p><b>Slot Price:</b> {{slot.price}}</p>
        </div>
      </paper-card>
      </template>
      </template>


    `;
  }
  static get properties() {
    return {
      checkDate: {
        type: String,
        value: ''
      }
    };
  }
  ready() {
    super.ready();
    this.addEventListener('ajax-response', (e) => this._ajaxResponse(e))
  }
  connectedCallback() {
    super.connectedCallback();
  }
  _handleBack() {
    window.history.pushState({}, null, '#/admin-home');
    window.dispatchEvent(new CustomEvent('location-changed'));
  }
  _ajaxResponse(event) {

    if (event.detail.data.statusCode == 'DCNC0009') {
      this.message = errorCodes.DCNC0009;
      this.$.toast.open();
    }
    else {
      this.bookedSlotDetails = event.detail.data
    }
  }
  _handleClick() {
    this.checkDate = this.$.checkDate.date;
    this.$.ajax._makeAjaxCall('get', `http://3.6.235.13:9090/adwise/users?date=${this.checkDate}&userId=${sessionStorage.getItem('userId')}`, null, 'ajaxResponse')
  }
}
window.customElements.define('added-slots', AddedSlots);
