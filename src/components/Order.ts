import { IOrderErrors } from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/Events';

export class Order {
	protected element: HTMLElement;
	protected event: IEvents;
	protected orderButton: HTMLButtonElement;
	orderErrors: IOrderErrors;
	protected buttons: HTMLButtonElement[];
	protected activeButton: HTMLButtonElement | null;
	protected inputAddress: HTMLInputElement;
	protected errorContainer: HTMLElement;

	constructor(formError: IOrderErrors, event: IEvents) {
		this.event = event;
		this.element = cloneTemplate(
			document.getElementById('order') as HTMLTemplateElement
		);
		this.orderButton = this.element.querySelector('.order__button');
		this.buttons = Array.from(this.element.querySelectorAll('.button_alt'));
		this.activeButton = this.buttons[0];
		this.activeButton.classList.add('button_alt-active');
		this.inputAddress = this.element.querySelector('.form__input');
		this.orderErrors = formError;
		this.errorContainer = this.element.querySelector('.form__errors');

		this.orderButton.addEventListener('submit', function (event) {
			event.preventDefault();
		});
		this.orderButton.addEventListener('click', () => {
			this.event.emit('formContact:open', { ...this.getData() });
		});

		this.inputAddress.addEventListener('input', () =>
			this.handleAddressInput()
		);

		this.buttons.forEach((button) => {
			button.addEventListener('click', () => this.handleButtonClick(button));
		});
	}

	handleError() {
		if (this.orderErrors.address.length > 0) {
			this.errorContainer.textContent = this.orderErrors.address;
			this.orderButton.disabled = true;
		} else {
			this.errorContainer.textContent = '';
			this.orderButton.disabled = false;
		}
	}

	private handleAddressInput() {
		const address = this.inputAddress.value;
		this.event.emit('formOrder:lavidation', {
			address: address,
			payment: this.activeButton ? this.activeButton.textContent : null,
		});
		this.handleError();
		return this.inputAddress.value;
	}

	private handleButtonClick(button: HTMLButtonElement) {
		if (this.activeButton) {
			this.activeButton.classList.remove('button_alt-active');
		}
		button.classList.add('button_alt-active');
		this.activeButton = button;
	}

	render() {
		return this.element;
	}

	private getData() {
		const address = this.inputAddress.value.trim();
		const activeButton = this.activeButton;
		const payment = activeButton ? activeButton.textContent : null;
		return { address, payment };
	}

	getFormData() {
		return this.getData();
	}
}
