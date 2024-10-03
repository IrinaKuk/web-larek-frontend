import { IOrder } from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/Events';

export class Success {
	protected element: HTMLElement;
	protected event: IEvents;
	protected successButton: HTMLButtonElement;
	protected totalPrice: HTMLElement;
	protected total: IOrder;

	constructor(event: IEvents) {
		this.event = event;
		this.element = cloneTemplate(
			document.getElementById('success') as HTMLTemplateElement
		);
		this.successButton = this.element.querySelector('.order-success__close');
		this.totalPrice = this.element.querySelector('.order-success__description');

		this.successButton.addEventListener('click', () => {
			this.event.emit('success:close');
		});
	}
	setPrice(price: number) {
		this.totalPrice.textContent = `Списано ${price.toString()} синапсов`;
	}

	getPrice() {
		const totalString = this.totalPrice.textContent;
		const total = parseInt(totalString, 10);
		return { total };
	}

	render() {
		return this.element;
	}
}
