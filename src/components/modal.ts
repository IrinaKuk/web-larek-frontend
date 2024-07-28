import { Component } from './component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

interface IModalInfo {
	content: HTMLElement;
}

export class Modal extends Component<IModalInfo> {
	protected _closeButton: HTMLButtonElement | null;
    protected _content: HTMLElement | null;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		if (this._closeButton) {
			this._closeButton.addEventListener('click', this.close.bind(this));
		}

		this._content = ensureElement<HTMLElement>('.modal__content', container);
		if (this._content) {
			this._content.addEventListener('click', (event) => event.stopPropagation());
			this.container.addEventListener('click', this.close.bind(this));
		}
	}

	set content(value: HTMLElement) {
		if (this._content) {
			this._content.replaceChildren(value);
		}
	}

	_toggleModal(state: boolean = true) {
        this.toggleClass(this.container, 'modal_active', state);
    }

    _handleEscape = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.close();
        }
    };

    open() {
        this._toggleModal();
        document.addEventListener('keydown', this._handleEscape);
        this.events.emit('modal:open');
    }

    close() {
        this._toggleModal(false);
        document.removeEventListener('keydown', this._handleEscape);
        this.content = null;
        this.events.emit('modal:close');
    }

	render(data: IModalInfo): HTMLElement {
		super.render(data);
		this.content= data.content;
		this.open();
		return this.container;
	}
}
