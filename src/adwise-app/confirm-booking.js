import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-form/iron-form.js';
import './ajax-call.js';
import './shared-styles.js';
import '@polymer/app-route/app-location.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-dialog/paper-dialog.js';
import {errorCodes} from './constants.js';
/**
 * @customElement
 * @polymer
 */
class ConfirmBooking extends PolymerElement {
  static get template() {
    return html`
    <style include="shared-styles">
    :host {
      display: block;
      background:cover;
    }
    .green{
        color:green;
    }
    .red{
        color:red;
    }
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th,
    td {
        padding: 10px;
    }

    tr {
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
    .alignCenter
    {
        margin-top:20px;
    }
  </style>
  <ajax-call id="ajax"></ajax-call>
  <h2><span class="green">You Can Book A Slot From <span class="red">{{slotFromTime}}</span> to <span class="red">{{slotToTime}}</span></span></h2>
  <paper-toast id="toast" text={{message}}></paper-toast>
  <table>
  <thead>
      <template is="dom-repeat" items={{headings}}>
          <td>{{item}}</td>
      </template>
  </thead>
  <tbody>
      <template is="dom-repeat" id="table" items={{rows}}>
          <tr>
          <td>{{slotDate}}</td>
          <td><paper-input id="from{{index}}"/></td>
          <td><paper-input id="to{{index}}" on-input="_calculateTotal"/></td>
          <td>{{planName}}</td>
          <td>INR{{planRate}}</td>
          <td>{{item.total}}</td>
          <td><paper-input id="customerName{{index}}"/></td>
          <td><iron-icon id="icon{{index}}" icon="add" on-click="_handleClick"></iron-icon></td>
          </td>
          </tr>
      </template>
  </tbody>
  </table>
<div class="alignCenter">
  <paper-button raised on-click="_handleOk" dialog-dismiss>BookNow</paper-button>
 </div>
 <paper-dialog id="info" class="colored" modal>
<h2 id="announce">{{announce}}</h2>
<ul>
<li>Number Of Slots Booked Successfully:{{successCount}}</li>
<li>Number Of Slots Failed To Book:{{failureCount}}</li>
</ul>
<div class="alignCenter">
<paper-button on-click="_handleRoute" raised>Ok</paper-button>
</div>
</paper-dialog>
<paper-dialog id="info1" class="colored" modal>
<h2 id="announce">{{announce}}</h2>
<div class="alignCenter">
<paper-button on-click="_handleRoute" raised>Ok</paper-button>
</div>
</paper-dialog> `;
  }
  static get properties() {
    return {
      message:{
        type:String,
        value:''
      },
       slotDate:{
        type:String,
        value:''
      },
      planRate:{
        type:String,
        value:''
      },
      planName:{
        type:String,
        value:''
      },
      slotFromTime:{
        type:String,
        value:''
      },
      slotToTime:{
        type:String,
        value:''
      },
      headings:{
        type:Array,
        value: ["Date(YYYY-MM-DD)", "From", "To", "Plan Name","Plan Price(in sec)","Total","Customer Name","Action"]
    },
    rows:{
        type:Array,
        value:[{total:''}]
      },
    postData:{
        type:Array,
        value:[]
    },
    rowIndex:{
      type:Number,
      value:0
    },
    announce:{
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
    this.addEventListener('confirm-slot', (e) => this._ajaxResponse(e))
  }
  _handleClick(e)
  {
      let index=e.model.index;
      this.rowIndex=index+1;
      this.push('rows',{total:''});
        let slotFromTime=this.shadowRoot.querySelector(`#from${index}`).value;
        let slotToTime=this.shadowRoot.querySelector(`#to${index}`).value;
        let customerName=this.shadowRoot.querySelector(`#customerName${index}`).value;
        this.shadowRoot.querySelector(`#icon${index}`).setAttribute('icon','delete');
        this.shadowRoot.querySelector(`#icon${index}`).removeEventListener('click',this._handleAdd);
        this.shadowRoot.querySelector(`#icon${index}`).setAttribute('on-click','_handleDelete');
        const slotId=sessionStorage.getItem('slotId');
        const planId=sessionStorage.getItem('planId');
        this.postObj={slotId,planId,slotDate:this.slotDate,slotFromTime,slotToTime,customerName}
        this.push('postData',this.postObj);
        console.log(this.postData)
  }
  _handleDelete(event)
  {
console.log(event.model.item,"i'm here")
  }
  connectedCallback() {
    super.connectedCallback();
    this.slotDate=sessionStorage.getItem('slotDate');
    this.planRate=sessionStorage.getItem('planRate');
    this.planName=sessionStorage.getItem('planName');
    this.slotFromTime=sessionStorage.getItem('slotFromTime');
    this.slotToTime=sessionStorage.getItem('slotToTime');
  }
  _handleOk(){
      let slotFromTime=this.shadowRoot.querySelector(`#from${this.rowIndex}`).value;
      let slotToTime=this.shadowRoot.querySelector(`#to${this.rowIndex}`).value;
      let customerName=this.shadowRoot.querySelector(`#customerName${this.rowIndex}`).value;
      const slotId=sessionStorage.getItem('slotId');
      const planId=sessionStorage.getItem('planId');
      this.postObj={slotId,planId,slotDate:this.slotDate,slotFromTime,slotToTime,customerName}
      this.push('postData',this.postObj);
      console.log(this.postData)
    this.$.ajax._makeAjaxCall('post', `http://3.6.235.13:9090/adwise/users/${sessionStorage.getItem('userId')}/bookings`,this.postData, 'confirmSlot')
   }
  _calculateTotal(e){
    let index=e.model.index;
    let slotFromTime=this.shadowRoot.querySelector(`#from${index}`).value;
    let slotToTime=this.shadowRoot.querySelector(`#to${index}`).value;
    if(slotToTime.length==8&&slotFromTime.length==8)
    {
    const fromHour =slotFromTime.slice(0,2);
    const fromMinute=slotFromTime.slice(3,5);
    const fromSeconds=slotFromTime.slice(6,8);
    const toHour =slotToTime.slice(0,2);
    const toMinute=slotToTime.slice(3,5);
    const toSeconds=slotToTime.slice(6,8);
    const totalTime=(toHour-fromHour)*3600+(toMinute-fromMinute)*60+(toSeconds-fromSeconds);
    this.totalPrice=this.planRate*totalTime;
    this.set(`rows.${index}.total`,this.totalPrice)
    }
    }
    _ajaxResponse(event){
        console.log(event.detail.data)
        const data=event.detail.data;
        if(data.statusCode==200)
        {
          this.announce="Slots booking has done succeessfully"
         this.successCount= data.successCount;
         this.failureCount= data.failureCount;
         this.$.info.open();
        }
        else
        {
          this.announce="Slots has been already booked";
          this.$.info1.open();
        }
    }
    _handleRoute()
    {
      this.$.info.close();
      this.$.info1.close();
      window.history.pushState({}, null, '#/sales-home');
      window.dispatchEvent(new CustomEvent('location-changed'));
    }
}
window.customElements.define('confirm-booking', ConfirmBooking);
