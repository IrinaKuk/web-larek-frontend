import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/Events';

export class Basket {
	protected element: HTMLElement;
	protected catalogElements: HTMLElement;
	protected container: HTMLElement;
	protected tempateElement: HTMLTemplateElement;
	protected event: IEvents;
	protected basketPrice: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(event: IEvents) {
		this.event = event;
		this.tempateElement = document.getElementById(
			'basket'
		) as HTMLTemplateElement;
		this.element = cloneTemplate(this.tempateElement);
		this.container = this.element.querySelector('.basket__list');
		this.basketPrice = this.element.querySelector('.basket__price');
		this.basketButton = this.element.querySelector('.basket__button');

		this.basketButton.addEventListener('click', () => {
			this.event.emit('formOrder:open');
		});
	}

	setPrice(price: number) {
		if (price !== 0) {
			this.basketPrice.textContent = `${price.toString()} синапсов`;
			this.basketButton.disabled = false;
		} else if (price === 0 && this.container.children.length === 0) {
			this.basketPrice.textContent = 'Корзина пуста';
			this.basketButton.disabled = true;
		} else {
			this.basketPrice.textContent =
				'В корзине есть товар который невозможно купить';
			this.basketButton.disabled = true;
		}
	}

	clearBasket() {
		this.container.innerHTML = '';
	}

	setCardBasket(products: HTMLElement[]) {
		products.forEach((product) => {
			this.container.appendChild(product);
		});
	}

	render() {
		return this.element;
	}
}
