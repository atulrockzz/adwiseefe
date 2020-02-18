import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-route/app-location.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import { setRootPath, setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/font-roboto/roboto.js';
/**
 * @customElement
 * @polymer
 */
setRootPath(MyAppGlobals.rootPath)
setPassiveTouchGestures(true);
class AdwiseApp extends PolymerElement {
  static get template() {
    return html`
      <style>
      :host {
        z-index:1;
        display: block;
        font-family:"roboto";
        padding-top: 130px;
        padding-bottom: 64px;
        min-height: 100vh;
        --app-primary-color: red;
        --app-secondary-color: #757575;
        --app-accent-color: #172C50;
        --paper-button-ink-color: var(--app-accent-color);
        --paper-icon-button-ink-color: var(--app-accent-color);  
        
      }
      .tabs-bar {
        background-color:#171717;
        width:100%;
        height: auto;
        text-align:center;
        margin-top:10px;
        position:sticky;
        top: 0;
    }
    app-drawer {
      z-index: 3;
    }
    ul {
        display: inline-flex;
        list-style: none;
        align-items: flex-start; 
    }
    ul li 
    {
        width:120px;
    }
    ul li a:visited
    {
      color:white;
    }
    ul li a
    {
      color:white;
      text-decoration:none;
    }
    .link
    {
      text-decoration:none;
      color:black;
    }
    .link:visited
    {
      color:black;
    }
    [hidden] {
      display: none !important;
    }
    .heading-title
    {
      color:white;
    }
    .heading
    {
      background-color:#171717;
      font-size:24px;
      display:flex;
      justify-content:space-between;
    }
    #home
    {
      text-decoration:none;
      cursor:pointer;
    }
    #logout
    {
      font-size:1rem;
      height:50px;
      color:white;
    }
    #logout:hover
    {
      font-size:1rem;
      height:50px;
      color:#11998e;
    }
    app-header {
     
      z-index: 1;
      background-color: rgba(255, 255, 255, 0.95);
      --app-header-shadow: {
        box-shadow: inset 0px 5px 6px -3px rgba(0, 0, 0, 0.2);
        height: 10px;
        bottom: -10px;
      };
    }
    /* footer {
      background: #171717;
      position: fixed;
      bottom: 0;
      transition: bottom 0.2s ease-in-out;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color:white;
      width:100%;
  } */
  footer {
    background: #171717;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    margin-top: 20px;
    line-height: 24px;
  }
  .demo-label
  {
    color: var(--app-secondary-color);
  }
  footer > a {
        color: var(--app-secondary-color);
        text-decoration: none;
      }

      footer > a:hover {
        text-decoration: underline;
      }
      paper-icon-button {
        color: var(--app-primary-color);
      }
      h3
      {
        color:white;
      }
    </style>
      <app-location id="location" url-space-regex="^[[rootPath]]" route="{{route}}" use-hash-as-path></app-location>
<app-route route="{{route}}" data="{{routeData}}" pattern="[[rootPath]]:page" tail="{{subRoute}}"></app-route>

  <app-drawer id="drawer" slot="drawer" opened="{{drawerOpened}}">
    <app-toolbar>Menu</app-toolbar>
    <!-- Nav on mobile: side nav menu -->
    <paper-listbox selected="[[page]]" attr-for-selected="name">
      <template is="dom-repeat" items="{{items}}">
        <paper-item name$="{{item.route}}"><a href="#[[rootPath]]{{item.route}}" class="link">{{item.label}}</a></paper-item>
      </template>
    </paper-listbox>
  </app-drawer>

    <app-header class="main-header" slot="header">
      <app-toolbar class="heading">
        <paper-icon-button icon="menu" aria-label="Menu" on-click="_toggleDrawer" hidden$="{{wideLayout}}">
        </paper-icon-button>
        <a href="#[[rootPath]]{{page}}" id="home"><span class="heading-title">AdWise</span></a>
        <h3 hidden$="{{isLogin}}">Welcome {{userName}}</h3>
        <paper-button id="logout" on-click="_handleLogout" hidden$="{{isLogin}}" raised>Logout
        <iron-icon icon="settings-power"></iron-icon></paper-button>
      </app-toolbar>
        <!-- Nav on desktop: tabs -->
        <nav class="tabs-bar" hidden$="{{!wideLayout}}">
          <template is="dom-repeat" items="{{items}}">
          <ul>
        <li><a href="#[[rootPath]]{{item.route}}">{{item.label}}</a></li>
         </ul>
          </template>
         </nav>
      </app-toolbar>
      </app-header>
      <iron-pages selected="[[page]]" attr-for-selected="name" role="main" fallback-selection="error404">
        <udaan-schemes id="udaanSchemes" name="udaan-schemes"></udaan-schemes>
        <donation-details id="donationDetails" name="donation-details"></donation-details>
        <login-page name="login"></login-page>
        <admin-home name="admin-home" user-name={{userName}} is-login={{isLogin}}></admin-home>
        <sales-home name="sales-home" user-name={{userName}} is-login={{isLogin}}></sales-home>
        <sold-slots name="sold-slots"></sold-slots>
        <added-slots name="added-slots"></added-slots>
        <confirm-booking name="confirm-booking"></confirm-booking>
        <error-view name="error404"></error-view>
      </iron-pages> 
    <footer>
      <a href="#">&copy Adwise</a>
      <div class="demo-label">Demo Only</div>
    </footer>

<iron-media-query query="min-width: 600px" query-matches="{{wideLayout}}"></iron-media-query>
    `;
  }
  static get properties() {
    return {
      page: {
        type: String,
        observer: '_pageChanged'
      },
      wideLayout: {
        type: Boolean,
        value: false,
        observer: 'onLayoutChange',
      },
      items: {
        type: Array,
        value: function () {
          return []
        }
      },
      isLogin:{
        type:Boolean,
        value:true
      }
    };
  }
  _toggleDrawer() {
    this.drawerOpened = !this.drawerOpened;
  }
  /**
 *simple observer which is triggered when page property is changed
 *@param {String} newPage value of changed page 
 **/
  _pageChanged(newPage) {
    console.log(newPage)
    //Depending upon the changed page it lazy-imports the url
    switch (newPage) {
      case 'login': import('./login-page.js')
        break;
      case 'admin-home': import('./admin-home.js')
        break;
      case 'sales-home': import('./sales-home.js')
        break;
      case 'added-slots': import('./added-slots.js')
        break;
      case 'sold-slots': import('./sold-slots.js')
        break;
        case 'confirm-booking': import('./confirm-booking.js')
        break;
      default: import('./error-page.js')
        break;
    }
  }
  /** Hence complex triggers is required to define to observe changes on first time page load.
  **/
  static get observers() {
    return ['_routerChanged(routeData.page)']
  }
  /**
   * @author: Abhinav
   *@param {String} page Value of new page
  **/
  _routerChanged(page) {
    console.log(page)
    this.page = page || 'login';
  }
  /**
   *onLayoutChange() is a simple observer which is triggered when wideLayout Property is changed.
   It closes the drawer if the layout is wider than 600px
   *@param {Boolean} wide tells that layout is wide or not? it's a value in true or false
  **/
  onLayoutChange(wide) {
    var drawer = this.$.drawer;
    if (wide && drawer.opened) {
      drawer.opened = false;
    }
  }
  _handleLogout()
  {
    sessionStorage.clear();
    //this.set('route.path','./landing-page')
    window.history.pushState({}, null, '#/login');
    window.dispatchEvent(new CustomEvent('location-changed'));
    this.isLogin=true;

  }
}

window.customElements.define('adwise-app', AdwiseApp);
