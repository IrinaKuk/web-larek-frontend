import { IContactsErrors } from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/Events';

export class Contact {
	protected element: HTMLElement;
	protected event: IEvents;
	protected contactButton: HTMLButtonElement;
	contactErrors: IContactsErrors;
	protected inputEmail: HTMLInputElement;
	protected inputPhone: HTMLInputElement;
	protected errorContainer: HTMLElement;

	constructor(formError: IContactsErrors, event: IEvents) {
		this.event = event;
		this.element = cloneTemplate(
			document.getElementById('contacts') as HTMLTemplateElement
		);
		this.contactButton = this.element.querySelector('.button');
		this.inputEmail = this.element.querySelector('input[name="email"]');
		this.inputPhone = this.element.querySelector('input[name="phone"]');
		this.contactErrors = formError;
		this.errorContainer = this.element.querySelector('.form__errors');

		this.contactButton.addEventListener('submit', function (event) {
			event.preventDefault();
		});
		this.contactButton.addEventListener('click', () => {
			this.event.emit('success:confirmation');
		});

		this.inputEmail.addEventListener('input', () => this.handleInput());
		this.inputPhone.addEventListener('input', () => this.handleInput());
	}

	handleError() {
		let errorMessage = '';

		if (this.contactErrors.email.length > 0) {
			errorMessage += this.contactErrors.email;
		}

		if (this.contactErrors.phone.length > 0) {
			if (errorMessage.length > 0) {
				errorMessage += '\n';
			}
			errorMessage += this.contactErrors.phone;
		}

		if (errorMessage.length > 0) {
			this.errorContainer.textContent = errorMessage;
			this.contactButton.disabled = true;
		} else {
			this.errorContainer.textContent = '';
			this.contactButton.disabled = false;
		}
	}

	private handleInput() {
		const email = this.inputEmail.value;
		const phone = this.inputPhone.value;
		this.event.emit('formContact:lavidation', {
			email: email,
			phone: phone,
		});
		this.handleError();
		return this.inputEmail.value, this.inputPhone.value;
	}

	render() {
		return this.element;
	}

	private getData() {
		const email = this.inputEmail.value.trim();
		const phone = this.inputPhone.value.trim();
		return { email, phone };
	}

	getFormData() {
		return this.getData();
	}
}
