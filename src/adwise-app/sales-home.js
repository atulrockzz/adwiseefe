import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './shared-table.js';
import '@fooloomanzoo/datetime-picker/overlay-date-picker';
import '@fooloomanzoo/datetime-picker/time-picker.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-toast/paper-toast.js';
import './ajax-call.js';
import './shared-styles.js';
import { errorCodes } from './constants.js';

/**
 * @customElement
 * @polymer
 */
class SalesHome extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
        }
        #searchBox{
            height:300px;
            width:800px;
        }
        #searchBtn{
            margin-top:20px;
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
  
      thead{
          color: white;
          font-weight: bolder;
          text-align: left;
          background-color: blue;
      }
      paper-dialog.colored {
        border: 2px solid;
        border-color: steelblue;
      }
      #datePicker{
        margin-bottom:20px
      }
      #searchBtn{
        background-color:steelblue;
        color:white;
      }
      </style>
      <ajax-call id="ajax"></ajax-call>
     <div id=datePicker>
     <h2>Select Date</h2>
          Date :<date-picker id="availableDate"></date-picker>
          <paper-button on-click="_handleClick" raised id="searchBtn">Search Availability</paper-button>
          </div>
     <table>
     <thead>
         <template is="dom-repeat" items={{headings}}>
             <td>{{item}}</td>
         </template>
     </thead>
     <tbody>
         <template is="dom-repeat" items={{rows}}>
             <tr>
             <td>{{item.slotId}}</td>
             <td>{{item.slotDate}}</td>
             <td>{{item.slotFromTime}}</td>
             <td>{{item.slotToTime}}</td>
             <td>{{item.slotStatus}}</td>
             <td>{{item.planName}}</td>
             <td>INR{{item.planRate}}</td>
             <td><paper-button on-click="_handleBook"  raised>Book Now</paper-button>
             </td>
             </tr>
         </template>
     </tbody>
     </table>
    <h1 class="alignCenter">{{searchResults}}</h1>
     `;
  }
  static get properties() {
    return {
        headings:{
            type:Array,
            value: ["SlotId", "Date(YYYY-MM-DD)", "From", "To", "Status", "Plan Name","Plan Price(in sec)","BookSlot"]
        },
          rows:{
            type:Array,
            value:[]
          },
          date:{
            type:String,
            value:''
          },searchResults:{
            type:String,
            value:''
          },
          slotDate:{
            type:String,
            value:''
          },
            slotId:{
              type:String,
              value:''
            },
            totalPrice:{
              type:String,
              value:''
            },
            planId:{
              type:String,
              value:''
            },
            isLogin:{
              type:Boolean,
              value:false,
              notify:true
            },
      userName:{
        type:String,
        value:'',
        notify:true
      }
    };
  }
  _handleClick(){
       this.date=this.$.availableDate.date;
    this.$.ajax._makeAjaxCall('get', `http://10.117.189.176:9090/adwise/slots?slotDate=${this.date}`, null, 'ajaxResponse')
  }
  ready()
{
  super.ready();
  this.addEventListener('ajax-response',(e)=> this._availableSlots(e))
  this.addEventListener('confirm-slot',(e)=> this._confirmSlots(e))
}
connectedCallback()
{
  super.connectedCallback();
  this.isLogin=false;
  this.userName=sessionStorage.getItem('userName');
}
_availableSlots(event){
  if (event.detail.data.statusCode == 'DCNC002') {
    this.searchResults = errorCodes.DCNC002;
  }
 this.rows=event.detail.data.slotList ;
}
_handleBook(event){
  console.log(event.model.item)
  sessionStorage.setItem('slotFromTime',event.model.item.slotFromTime);
  sessionStorage.setItem('slotToTime',event.model.item.slotToTime);
  sessionStorage.setItem('slotDate',event.model.item.slotDate);
  sessionStorage.setItem('slotId',event.model.item.slotId);
  sessionStorage.setItem('planId',event.model.item.planId);
  sessionStorage.setItem('planRate',event.model.item.planRate);
  sessionStorage.setItem('planName',event.model.item.planName);
  window.history.pushState({}, null, '#/confirm-booking');
  window.dispatchEvent(new CustomEvent('location-changed'));
}

_confirmSlots(event){
  console.log(event.detail.data.message)
  this.message=event.detail.data.message;
  this.$.toast.open();
}

}
window.customElements.define('sales-home', SalesHome);