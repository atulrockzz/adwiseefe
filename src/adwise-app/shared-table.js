import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class SharedTable extends PolymerElement {
static get template() {
return html`
<style>
    :host {
        display: block;
        margin-top:10px;
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

    th {
        color: white;
        font-weight: bolder;
        text-align: left;
        background-color: blue;
    }
</style>
<div class="container">
    <table>
        <template is="dom-repeat" items={{headings}}>
        <th>{{item.value}}</th>
        </template>
        <tbody>
        <template is="dom-repeat" items={{rows}} as="data">
        <tr>
            <template is="dom-repeat" items={{headings}} as="heading">
            <td>[[_getData(data,heading)]]</td>
            </template>
        </tr>
    </template>
    </tbody>
    </table>
</div>
`;
}
_getData(data,heading){
    return data[heading.name]
}
}

window.customElements.define('shared-table',SharedTable);