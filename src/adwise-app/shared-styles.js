import '@polymer/polymer/polymer-element.js';
const template = document.createElement('template');
template.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>
    .alignCenter
    {
      text-align:center;
    }
    .main-frame {
      margin: 0 auto;
      padding: 0 24px 48px 24px;
      max-width: 900px;
      overflow: hidden;
    }
    .subsection:not([visible]) {
      display: none;
    }
    h2 {
      font-size: 16px;
    }
    paper-spinner{
      position: fixed;
      top: calc(50% - 16px);
      left: calc(50% - 14px);
    }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(template.content);
