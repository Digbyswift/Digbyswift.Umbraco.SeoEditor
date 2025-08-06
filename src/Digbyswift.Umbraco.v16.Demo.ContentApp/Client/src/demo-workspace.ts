import { LitElement, html, customElement, css } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

@customElement('demo-workspaceview')
export default class DemoWorspaceViewElement extends UmbElementMixin(LitElement) {

    render() {
        return html`     
     <uui-box headline="Test workspace">
        Testing workspace with some dummy text.
      </uui-box>            
    `
    }

    static styles = css`
    uui-box {
      margin: 20px;
    }
  `
}

declare global {
    interface HTMLElementTagNameMap {
        'demo-workspaceview': DemoWorspaceViewElement
    }
}