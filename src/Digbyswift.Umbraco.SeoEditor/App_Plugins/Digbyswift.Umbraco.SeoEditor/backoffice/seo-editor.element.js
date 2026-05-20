import { LitElement, css, html } from 'lit';

const MAX_RECOMMENDED_TITLE_LENGTH = 60;
const MAX_RECOMMENDED_DESCRIPTION_LENGTH = 160;
const ROBOT_OPTIONS = [
  'noindex',
  'nofollow',
  'noarchive',
  'nositelinkssearchbox',
  'nosnippet',
  'indexifembedded',
  'noimageindex'
];

const DEFAULT_VALUE = {
  metaTitle: null,
  metaDescription: null,
  metaImageId: null,
  canonicalUrl: null,
  metaRobots: []
};

export class DigbyswiftSeoEditorElement extends LitElement {
  static properties = {
    value: { type: Object },
    variantName: { type: String },
    previewBaseUrl: { type: String }
  };

  static styles = css`
    .seo-editor { display: grid; gap: 1rem; }
    .meta-form { display: grid; grid-template-columns: minmax(280px, 430px) 1fr; gap: 1.5rem; }
    .preview { max-width: 620px; }
    .preview .url { color: #4d5156; font-size: 14px; margin-bottom: 6px; }
    .preview .title { color: #1a0dab; font-size: 20px; margin-bottom: 6px; }
    .preview .description { color: #4d5156; font-size: 14px; }
    .image-and-robots { display: grid; gap: 1rem; grid-template-columns: minmax(220px, 300px) 1fr; }
    .robots-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px 16px; }
    .hint { color: #4d5156; font-size: 11px; margin-top: 4px; }
  `;

  constructor() {
    super();
    this.value = { ...DEFAULT_VALUE };
    this.variantName = '';
    this.previewBaseUrl = typeof location !== 'undefined' ? `${location.protocol}//${location.hostname}` : '';
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('value')) {
      this.value = {
        ...DEFAULT_VALUE,
        ...(this.value || {}),
        metaRobots: Array.isArray(this.value?.metaRobots) ? this.value.metaRobots : []
      };
    }
  }

  _setField(field, event) {
    const incoming = event?.target?.value;
    this.value = { ...this.value, [field]: incoming === '' ? null : incoming };
    this._emitChange();
  }

  _setNumericField(field, event) {
    const incoming = event?.target?.value?.trim();
    this.value = { ...this.value, [field]: incoming === '' ? null : Number.parseInt(incoming, 10) || null };
    this._emitChange();
  }

  _toggleRobot(option) {
    const existing = this.value.metaRobots;
    const contains = existing.includes(option);
    this.value = { ...this.value, metaRobots: contains ? existing.filter((x) => x !== option) : [...existing, option] };
    this._emitChange();
  }

  _emitChange() {
    this.dispatchEvent(new CustomEvent('property-value-change', { bubbles: true, composed: true, detail: { value: this.value } }));
  }

  _truncate(str, maxLength, append = ' ...') {
    if (!str || str.length <= maxLength) return str;
    const trimmed = str.substring(0, maxLength);
    return trimmed.substring(0, Math.min(trimmed.length, trimmed.lastIndexOf(' '))) + append;
  }

  _getPath() {
    const canonicalUrl = this.value.canonicalUrl;
    if (!canonicalUrl) return '';
    if (canonicalUrl.includes('/')) {
      return ` › ${canonicalUrl.split('/').filter((x) => x !== '').join(' › ')}`;
    }
    return ` › ${canonicalUrl}`;
  }

  render() {
    const title = this._truncate(this.value.metaTitle || this.variantName, MAX_RECOMMENDED_TITLE_LENGTH);
    const description = this._truncate(this.value.metaDescription, MAX_RECOMMENDED_DESCRIPTION_LENGTH);

    return html`
      <div class="seo-editor">
        <h4>Title & description</h4>
        <div class="meta-form">
          <div>
            <uui-input .value=${this.value.metaTitle ?? ''} label="Meta title" @input=${(e) => this._setField('metaTitle', e)}></uui-input>
            <div class="hint">${(this.value.metaTitle ?? this.variantName ?? '').length} chars (recommended 60-70)</div>
            <uui-textarea .value=${this.value.metaDescription ?? ''} label="Meta description" @input=${(e) => this._setField('metaDescription', e)}></uui-textarea>
            <div class="hint">${(this.value.metaDescription ?? '').length} chars (recommended 150-160)</div>
          </div>
          <div class="preview">
            <div class="url">${this.previewBaseUrl}<span>${this._getPath()}</span></div>
            <div class="title">${title}</div>
            <div class="description">${description}</div>
          </div>
        </div>

        <div class="image-and-robots">
          <div>
            <uui-input
              type="number"
              .value=${this.value.metaImageId == null ? '' : String(this.value.metaImageId)}
              label="Meta image id"
              @input=${(e) => this._setNumericField('metaImageId', e)}></uui-input>
            <div class="hint">Set media id manually (picker integration pending).</div>
          </div>

          <div>
            <h4>Robots meta</h4>
            <div class="robots-list">
              ${ROBOT_OPTIONS.map((option) => html`
                <uui-toggle .checked=${this.value.metaRobots.includes(option)} @change=${() => this._toggleRobot(option)}>
                  ${option}
                </uui-toggle>
              `)}
            </div>
          </div>
        </div>

        <div>
          <h4>Canonical URL</h4>
          <uui-input .value=${this.value.canonicalUrl ?? ''} label="Canonical URL" @input=${(e) => this._setField('canonicalUrl', e)}></uui-input>
        </div>
      </div>
    `;
  }
}

customElements.define('digbyswift-seo-editor', DigbyswiftSeoEditorElement);
