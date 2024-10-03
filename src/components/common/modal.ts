import { IEvents } from '../base/Events';

export class Modal {
	private modalContainer: HTMLElement;
	private modalCloseButton: HTMLButtonElement;
	private isModalOpen: boolean = false;
	private conteiner: HTMLElement;

	constructor(protected events: IEvents) {
		events = events;
		this.modalContainer = document.getElementById('modal-container');
		this.modalCloseButton = this.modalContainer.querySelector('.modal__close');
		this.conteiner = this.modalContainer.querySelector('.modal__content');

		this.modalContainer.addEventListener(
			'click',
			this.handleContainerClick.bind(this)
		);
		this.modalCloseButton.addEventListener('click', this.close.bind(this));
	}

	private handleContainerClick(event: MouseEvent): void {
		if (event.target === this.modalContainer) {
			this.close();
		}
	}

	open(): void {
		if (!this.isModalOpen) {
			this._toggleModal(true);
			document.addEventListener('keydown', this.handleEscape);
			this.events.emit('modal:open');
			this.isModalOpen = true;
			document.body.style.overflow = 'hidden';
		}
	}

	close(): void {
		if (this.isModalOpen) {
			this._toggleModal(false);
			document.removeEventListener('keydown', this.handleEscape);
			this.isModalOpen = false;
			this.events.emit('modal:close');
			document.body.style.overflow = '';
		}
	}

	private _toggleModal(state: boolean): void {
		this.modalContainer.classList.toggle('modal_active', state);
	}

	get content(): HTMLElement {
		return this.modalContainer;
	}

	set content(value: HTMLElement) {
		this.conteiner.replaceChildren(value);
	}

	private handleEscape = (evt: KeyboardEvent): void => {
		if (evt.key === 'Escape' && this.isModalOpen) {
			this.close();
		}
	};

	destroy(): void {
		this.modalContainer.removeEventListener('click', this.handleContainerClick);
		this.modalCloseButton.removeEventListener('click', this.close);
		document.removeEventListener('keydown', this.handleEscape);
	}
}
