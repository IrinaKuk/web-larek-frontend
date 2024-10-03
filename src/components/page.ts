import { IEvents } from './base/Events';

export class Page {
	protected element: HTMLElement;
	protected catalogElements: HTMLElement[] = [];
	protected container: HTMLElement;
	protected event: IEvents;
	protected countBasketElement: HTMLElement;
	protected buttonBasket: HTMLButtonElement;

	constructor(event: IEvents) {
		this.event = event;
		this.element = document.querySelector('.page');
		this.container = this.element.querySelector('.gallery');
		this.buttonBasket = this.element.querySelector('.header__basket');
		this.countBasketElement = this.element.querySelector(
			'.header__basket-counter'
		);

		this.buttonBasket.addEventListener('click', () => {
			this.event.emit('basket:open');
		});
	}

	countBasket(count: number) {
		this.countBasketElement.textContent = count.toString();
	}

	render(products: HTMLElement[]) {
		this.container.innerHTML = '';

		products.forEach((product) => {
			this.container.appendChild(product);
		});
	}
}
