import {
	IProduct,
	IBasket,
	IOrder,
	IFormError,
	IOrderErrors,
	IContactsErrors,
} from '../types';
import { IEvents } from './base/Events';

export class AppData {
	items: IProduct[] = [];
	basket: IBasket = {
		items: [],
		total: 0,
	};
	orderData: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	orderErrors: IOrderErrors = {
		address: '',
		payment: '',
	};
	contactsErrors: IContactsErrors = {
		email: '',
		phone: '',
	};
	formError: IFormError = {
		address: '',
		email: '',
		phone: '',
		payment: '',
	};

	preview: IProduct | null = null;
	events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	setProducts(items: IProduct[]): void {
		this.items = items;
		this.events.emit('items:changed', { items: this.items });
	}

	setPreview(product: IProduct): void {
		this.preview = product;
	}

	addToBasket(item: IProduct): void {
		if (!this.basket.items.includes(item.id)) {
			this.basket.items.push(item.id);
			this.events.emit('basket:changed', this.basket);
		}
	}

	getBasket(): IBasket {
		return this.basket;
	}

	removeFromBasket(item: IProduct): void {
		this.basket.items = this.basket.items.filter(
			(basketId) => basketId !== item.id
		);
		this.events.emit('basket:changed', this.basket);
	}

	getCountBasket(): number {
		return this.basket.items.length;
	}

	getTotalBasket(): number {
		for (const itemId of this.basket.items) {
			const product = this.items.find((product) => product.id === itemId);
			if (product && product.price === null) {
				return 0;
			}
		}
		return this.basket.items
			.map((item) => this.items.find((product) => product.id === item))
			.reduce((total, item) => {
				return total + (item.price || 0);
			}, 0);
	}

	cleanBasket(): void {
		this.basket = {
			items: [],
			total: 0,
		};
		this.events.emit('basket:changed', this.basket);
	}

	setOrderField(field: keyof IFormError, value: string): void {
		this.orderData[field] = value;
		if (field === 'address' || field === 'payment') {
			this.validateOrderErrors();
		}
		if (field === 'phone' || field === 'email') {
			this.validateContactsErrors();
		}
	}

	validateOrderErrors(): boolean {
		const errors: IOrderErrors = {
			address: !this.orderData.address ? 'Необходимо указать адрес' : '',
			payment: !this.orderData.payment
				? 'Необходимо указать способ оплаты'
				: '',
		};
		this.formError = errors;
		this.events.emit('orderErrors:changed', this.formError);
		return Object.keys(this.formError).every(
			(key) => !this.formError[key as keyof IOrderErrors]
		);
	}

	validateContactsErrors(): boolean {
		const errors: IContactsErrors = {
			email: !this.orderData.email ? 'Необходимо указать email' : '',
			phone: !this.orderData.phone ? 'Необходимо указать телефон' : '',
		};
		this.formError = errors;
		this.events.emit('contactsErrors:changed', this.formError);
		return Object.keys(this.formError).every(
			(key) => !this.formError[key as keyof IContactsErrors]
		);
	}

	clearErrors(): void {
		this.formError = {
			address: '',
			email: '',
			phone: '',
			payment: '',
		};
		this.events.emit('formErrors:changed', this.formError);
	}

	getCard(id: string): IProduct | null {
		return this.items.find((item) => item.id === id) || null;
	}
}
