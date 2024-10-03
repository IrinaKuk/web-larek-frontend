// данные товара
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export type IProductBascet = Pick<IProduct, 'id' | 'title' | 'price'>;

// данные заказа
export interface IOrder {
	items?: string[]; //идентификаторы карточек
	payment?: string;
	address?: string;
	email?: string;
	phone?: string;
	total?: number | null;
}

//информация о товарах в корзине
export interface IBasket {
	items: string[];
	total: number | null;
}

export type IFormError = Partial<Omit<IOrder, 'items' | 'total'>>;
export type IOrderErrors = Partial<Pick<IOrder, 'address' | 'payment'>>;
export type IContactsErrors = Partial<Pick<IOrder, 'email' | 'phone'>>;

//Результат покупки
export interface IOrderResult {
	id: string;
	total: number;
}

export interface IApiResponse {
	items: IProduct[];
}
