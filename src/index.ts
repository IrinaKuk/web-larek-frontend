import './scss/styles.scss';
import { IOrder, IApiResponse } from './types';
import { EventEmitter } from './components/base/Events';
import { AppData } from './components/AppData';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/common/modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Contact } from './components/Contact';
import { Success } from './components/success';

const cardTemplate = document.getElementById(
	'card-catalog'
) as HTMLTemplateElement;
const previewTemplate = document.getElementById(
	'card-preview'
) as HTMLTemplateElement;
const basketTemplate = document.getElementById(
	'card-basket'
) as HTMLTemplateElement;

const events = new EventEmitter();
const appData = new AppData(events);
const api = new Api(API_URL);
const card = new Card(cardTemplate, events);
const page = new Page(events);
const basket = new Basket(events);
const success = new Success(events);
const order = new Order(appData.formError, events);
const previewCard = new Card(previewTemplate, events);
const modal = new Modal(events);

api
	.get('/product')
	.then((res: IApiResponse) => {
		appData.setProducts(res.items);
		events.emit('product:loader');
	})
	.catch((err) => {
		console.error(err);
	});

events.on('product:loader', () => {
	const gallerySection = document.querySelector('.gallery');
	appData.items.forEach((product) => {
		const card = new Card(cardTemplate, events);
		const cardElement = card.render(product);
		gallerySection.appendChild(cardElement);
	});
});

events.on('card:preview', (data: { Card: Card }) => {
	const cardPreview = appData.getCard(data.Card.id);
	modal.open();
	const cardElement = previewCard.render(cardPreview);
	modal.content = cardElement;
});

events.on('basket:add', (data: { Card: Card }) => {
	const cardBasket = appData.getCard(data.Card.id);
	appData.addToBasket(cardBasket);
	modal.close();
});

events.on('basket:changed', (data: { Card: Card }) => {
	page.countBasket(appData.getCountBasket());
	basket.clearBasket();
	const basketItems = appData.getBasket();
	basketItems.items.forEach((element) => {
		const card = appData.getCard(element);
		const prviewCard = new Card(basketTemplate, events);
		const cardElement = prviewCard.render(card);
		basket.setCardBasket([cardElement]);
		prviewCard.index(appData.getBasket().items.indexOf(element) + 1);
	});
	basket.setPrice(appData.getTotalBasket());
});

events.on('card:delete', (data: { Card: Card }) => {
	const cardBasket = appData.getCard(data.Card.id);
	appData.removeFromBasket(cardBasket);
	events.emit('basket:changed');
});

events.on('basket:open', () => {
  modal.content = basket.render();
	modal.open();
});

events.on('formOrder:open', () => {
	modal.content = order.render();
  modal.open();
});

events.on('formOrder:lavidation', (data: IOrder) => {
	order.getFormData();
	appData.setOrderField('address', data.address);
	appData.setOrderField('payment', data.payment);
	order.orderErrors = appData.formError;
});

const contact = new Contact(appData.formError, events);

events.on('formContact:open', () => {
	modal.open();
	modal.content = contact.render();
});

events.on('formContact:lavidation', (data: IOrder) => {
	contact.getFormData();
	appData.setOrderField('email', data.email);
	appData.setOrderField('phone', data.phone);
	contact.contactErrors = appData.formError;
});

events.on('success:confirmation', () => {
  modal.open();
  modal.content = success.render();
	appData.orderData.items = appData.getBasket().items;
	appData.orderData.total = appData.getTotalBasket();
	const orderData = appData.orderData;
	api
		.post('/order', orderData)
		.then((res: IApiResponse) => {
			console.log('Заказ успешно отправлен:', res);
      events.emit('formSuccess:open');
      success.setPrice(appData.getTotalBasket());
		})
		.catch((err) => {
			console.error('Ошибка при отправке заказа:', err);
		});

});


    events.on('formSuccess:open', () => {
      modal.open();
      modal.content = success.render();
      appData.clearErrors();
      appData.cleanBasket();
      appData.orderData = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0
      };
      });

	events.on('success:close', () => {
		modal.close();
	});
