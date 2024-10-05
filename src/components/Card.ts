import { cloneTemplate } from '../utils/utils';
import { IProduct } from '../types';
import { IEvents } from './base/Events';
import { CDN_URL } from '../utils/constants';

export class Card {
	protected element: HTMLElement;
	protected cardDescription: HTMLElement;
	protected cardImage: HTMLImageElement;
	protected cardTitle: HTMLElement;
	protected cardCategory: HTMLElement;
	protected cardPrice: HTMLElement;
	protected events: IEvents;
	protected deleteButton: HTMLButtonElement;
	protected previewButton: HTMLButtonElement;
	protected cardId: string;
	protected buttonBasket: HTMLButtonElement;
	protected categoryElement: HTMLElement;
	protected cardIndex: HTMLElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		this.events = events;
		this.element = cloneTemplate(template);

		this.cardDescription = this.element.querySelector('.card__text');
		this.cardImage = this.element.querySelector('.card__image');
		this.cardTitle = this.element.querySelector('.card__title');
		this.cardCategory = this.element.querySelector('.card__category');
		this.cardPrice = this.element.querySelector('.card__price');
		this.deleteButton = this.element.querySelector('.basket__item-delete');
		this.buttonBasket = this.element.querySelector('.card__button');
		this.categoryElement = this.element.querySelector('.card__category');
		this.cardIndex = this.element.querySelector('.basket__item-index');

		if (this.deleteButton) {
			this.deleteButton.addEventListener('click', () =>
				this.events.emit('card:delete', { Card: this })
			);
		}

		if (this.element) {
			if (this.element.classList.contains('gallery__item')) {
				this.element.addEventListener('click', () =>
					this.events.emit('card:preview', { Card: this })
				);
			}

			if (this.buttonBasket) {
				if (this.element.classList.contains('card_full')) {
					this.buttonBasket.addEventListener('click', () =>
						this.events.emit('basket:add', { Card: this })
					);
				}
			}
		}
	}

	render(cardData: Partial<IProduct>) {
		const { ...otherCardData } = cardData;
		Object.assign(this, otherCardData);
		return this.element;
	}

	set description(description: string) {
		if (this.cardDescription) {
			this.cardDescription.textContent = description;
		}
	}

	set image(image: string) {
		if (this.cardImage) {
			this.cardImage.src = `${CDN_URL}${image}`;
		}
	}

	set title(title: string) {
		this.cardTitle.textContent = title;
	}

	set category(category: string) {
		if (this.cardCategory) {
			this.cardCategory.textContent = category;
			this.cardCategory.classList.remove(
				'card__category_soft',
				'card__category_hard',
				'card__category_other',
				'card__category_additional',
				'card__category_button'
			);
			switch (category) {
				case 'софт-скил':
					this.cardCategory.classList.add('card__category_soft');
					break;
				case 'хард-скил':
					this.cardCategory.classList.add('card__category_hard');
					break;
				case 'другое':
					this.cardCategory.classList.add('card__category_other');
					break;
				case 'дополнительное':
					this.cardCategory.classList.add('card__category_additional');
					break;
				case 'кнопка':
					this.cardCategory.classList.add('card__category_button');
					break;
				default:
					break;
			}
		}
	}

  set price(price: number) {
    if (price !== null) {
      this.cardPrice.textContent = `${price.toString()} синапсов`;
      if (this.buttonBasket) {
        this.buttonBasket.disabled = false;
      }
    } else {
      this.cardPrice.textContent = 'Бесценно';
      if (this.buttonBasket) {
        this.buttonBasket.disabled = true;
      }
    }
  }

	index(value: number) {
		this.cardIndex.textContent = String(value);
	}

	set id(id: string) {
		this.cardId = id;
	}
	get id() {
		return this.cardId;
	}

}
