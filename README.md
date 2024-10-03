# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Документация к приложению
## Данные и типы данных
### 1. Данные товара:
```
interface IProduct {
  id: string; // id товара
  description: string;  // описание товара
  image: string;  // картинка товара
  title: string;  // название
  category: string;  // категория
  price: number | null;  // цена
}
```
### 2. Информация о товарах в корзине:
```
type IProductBascet = Pick<IProduct, 'id' | 'title' | 'price'>;
```
Описание: Тип IProductBascet представляет собой подмножество типа IProduct, содержащее только id, title и price товара. Используется для хранения информации о товарах в корзине.

### 3. Данные заказа:
```
interface IOrder {
   items?: string[];     // Массив идентификаторов товаров в заказе
  payment?: string;      // Способ оплаты
  address?: string;      // Адрес доставки
  email?: string;        // Email покупателя
  phone?: string;        // Телефон покупателя
  total?: number | null; // Итоговая стоимость заказа
}
```

### 4. Информация о товарах в корзине:
```
interface IBasket {
  items: string[];       // Массив идентификаторов товаров в корзине
  total: number | null;  // Итоговая стоимость товаров в корзине
};
```
### 5. Ошибки формы:
```
export type IFormError = Partial<Omit<IOrder, 'items' | 'total'>>;
```
Описание: Тип IFormError представляет собой частичный объект, содержащий только поля из IOrder, кроме items и total. Используется для хранения информации об ошибках в форме заказа.
### 6. Ошибки заказа:
```
type IOrderErrors = Partial<Pick<IOrder, 'address' | 'payment'>>;
```
Описание: Тип IOrderErrors представляет собой частичный объект, содержащий только поля address и payment из IOrder. Используется для хранения информации об ошибках в адресе доставки или способе оплаты заказа.

### 7 .Ошибки контактных данных:
```
type IContactsErrors = Partial<Pick<IOrder, 'email' | 'phone'>>;
```
Описание: Тип IContactsErrors представляет собой частичный объект, содержащий только поля email и phone из IOrder. Используется для хранения информации об ошибках в email или номере телефона.
### 8 .Результат покупки:
```
interface IOrderResult {
  id: string;        // Идентификатор заказа
  total: number;      // Итоговая стоимость заказа
}
```
### 9 .Ответ API:
```
interface IApiResponse {
  items: IProduct[];   // Массив товаров
}
```

 # Архитектура приложения

Приложение реализовано с использованием архитектурного паттерна MVP (Model-View-Presenter):
Слой представления (View): Отвечает за отображение данных на странице.
Слой данных (Model): Отвечает за хранение и изменение данных.
Презентер (Presenter): Отвечает за связь между представлением и данными.


# Базовый код
 ## Класс Api:
Предоставляет базовые методы для отправки HTTP-запросов.
Принимает в конструкторе базовый URL сервера и опциональный объект с заголовками запросов.

```
export class Api {
    baseUrl: string;
    options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = options;
    }
}
```
### Поля:

- `baseUrl: string` - Базовый адрес сервера.
- `options: RequestInit` - Объект с заголовками запросов.

### Конструктор:

- `constructor(baseUrl: string, options: RequestInit = {})` - принимает базовый URL и глобальные опции для всех запросов (опционально).

### Методы:

- `get(url: string, options: RequestInit = {}): Promise<Response>` - Выполняет GET-запрос на указанный URL.
- `post(url: string, data: any, options: RequestInit = {}): Promise<Response>` - Выполняет POST-запрос на указанный URL с передачей данных в JSON формате.
- `handleResponse(response: Response): Promise<Response>` - Обрабатывает ответ от сервера. 


 ## Класс EventEmitter:
Реализует брокер событий.
Используется для отправки и обработки событий в приложении.

```
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }
}
```
### Поля:

- `_events: Map<EventName, Set<Subscriber>>` - используется для хранения информации о событиях и их подписчиках.

### Методы:

- `on(eventName: EventName, subscriber: Subscriber): void` - Добавление обработчика на событие.
- `off(eventName: EventName, subscriber: Subscriber): void` - Удаление обработчика с события.
- `emit(eventName: EventName, ...args: any[]): void` - Инициализация события.
- `trigger(eventName: EventName): Function` - Возвращает функцию, которая запускает событие.
- `onAll(subscriber: Subscriber): void` - Добавление обработчика на все события.
- `offAll(subscriber: Subscriber): void` - Удаление всех обработчиков событий.



## Класс Component
Представляет собой базовые поля и методы, необходимые для отрисовки компонентов на странице.

```
class Component<T extends HTMLElement> {
    container: T;
    events: IEvents;

    constructor(container: T) {
        this.container = container;
        this.events = events;
    }
}
```
Конструктор:

### Поля:

- `container: HTMLElement` - DOM-элемент контейнера.
- `events: IEvents` - брокер событий.

### Конструктор:

- `constructor(container: HTMLElement, events: IEvents)` - конструктор принимает принимает DOM-элемент и экземпляр класса EventEmmiter.

### Методы:

- `toggleClass(className: string): void` - переключение класса.
- `setDisable(disable: boolean): void` - деактивация кнопок.
- `setActive(active: boolean): void` - активация кнопок.
- `setHidden(hidden: boolean): void` - скрытие элемента.
- `setVisible(visible: boolean): void` - отображение элемента.
- `setText(text: string): void` - установка текста.
- `setImage(url: string): void` - установка изображения.
- `render(): HTMLElement` - Отображение данных. 

## Слой данных
### Класс AppData
Класс AppData отвечает за хранение и логику работы с данными приложения
```
class AppData {
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
	events: IEvents
}
```

Конструктор:

- constructor(events: IEvents) - конструктор класса принимает инстант брокера событий
В полях класса хранятся следующие данные:

### Поля:

- `items: IProduct[]` - Массив товаров.
- `basket: IBasket` - Данные о корзине.
- `orderData: IOrder` - Данные о заказе.
- `orderErrors: IOrderErrors` - Ошибки валидации заказа.
- `contactsErrors: IContactsErrors` - Ошибки валидации контактных данных.
- `formError: IFormError` - Ошибки валидации формы.
- `preview: IProduct | null` - Текущий просматриваемый товар.
- `events: IEvents` - Брокер событий.

### Методы:

- `setProducts(items: IProduct[]): void` - Устанавливает список товаров.
- `setPreview(product: IProduct): void` - Устанавливает текущий просматриваемый товар.
- `addToBasket(item: IProduct): void` - Добавляет товар в корзину.
- `getBasket(): IBasket` - Возвращает данные о корзине.
- `removeFromBasket(item: IProduct): void` - Удаляет товар из корзины.
- `getCountBasket(): number` - Возвращает количество товаров в корзине.
- `getTotalBasket(): number` - Возвращает сумму корзины.
- `cleanBasket(): void` - Очищает корзину.
- `setOrderField(field: keyof IFormError, value: string): void` - Устанавливает значение поля заказа.
- `validateOrderErrors(): boolean` - Валидирует ошибки формы заказа.
- `validateContactsErrors(): boolean` - Валидирует ошибки формы контактных данных.
- `clearErrors(): void` - Очищает все ошибки формы.
- `getCard(id: string): IProduct | null` - Возвращает товар по его id.

# Слой представления

## Класс Page

### Описание:

Класс `Page` представляет собой страницу приложения. Он отвечает за отображение товаров в галерее, обновление счетчика корзины и обработку клика по кнопке корзины.

### Типизация:

- `event: IEvents` - брокер событий для отправки событий, связанных с корзиной.

### Поля:

- `element: HTMLElement` - DOM-элемент, представляющий страницу.
- `catalogElements: HTMLElement[]` - Массив элементов каталога (товаров).
- `container: HTMLElement` - DOM-элемент, представляющий контейнер для товаров в галерее.
- `countBasketElement: HTMLElement` - DOM-элемент счетчика корзины.
- `buttonBasket: HTMLButtonElement` - DOM-элемент кнопки корзины.

### Методы:

- **`constructor(event: IEvents)`**: Конструктор, инициализирующий поля класса и устанавливающий обработчик клика на кнопку корзины.
- **`countBasket(count: number)`**: Обновляет текст счетчика корзины.
- **`render(products: HTMLElement[])`**: Отображает товары в галерее.


## Класс Modal

### Описание:

Класс `Modal` реализует функциональность модального окна. Он позволяет открывать и закрывать модальное окно, управлять его содержимым и обрабатывать события, связанные с модальным окном.

### Типизация:

- `events: IEvents` - брокер событий для отправки событий, связанных с модальным окном.

### Поля:

- `modalContainer: HTMLElement` - DOM-элемент контейнера модального окна.
- `modalCloseButton: HTMLButtonElement` - DOM-элемент кнопки закрытия модального окна.
- `isModalOpen: boolean` - флаг, указывающий, открыто ли модальное окно.
- `conteiner: HTMLElement` - DOM-элемент для размещения содержимого модального окна.

### Методы:

- **`open(): void`**: Открывает модальное окно.
- **`close(): void`**: Закрывает модальное окно.
 
- **`_toggleModal(state: boolean): void`**: Включает/отключает класс `modal_active` для контейнера модального окна.
- **`handleContainerClick(event: MouseEvent): void`**: Обрабатывает клик по контейнеру модального окна. 
- **`handleEscape(evt: KeyboardEvent): void`**: Обрабатывает нажатие на клавишу `Escape`, закрывая модальное окно, если оно открыто.
- **`content: HTMLElement`**: Свойство для получения и установки содержимого модального окна.
- **`destroy(): void`**: Удаляет все обработчики событий, связанные с модальным окном.

## Класс Card

### Описание:

Класс `Card` представляет собой компонент карточки товара. Он содержит информацию о товаре (изображение, название, описание, категория, цена) и позволяет управлять отображением карточки. Класс также включает функциональность для удаления товара из корзины (если карточка находится в корзине) и для просмотра товара (если карточка находится в галерее).

### Типизация:

- `events: IEvents` - брокер событий для отправки событий, связанных с карточкой.

### Поля:

- `element: HTMLElement` - DOM-элемент, представляющий карточку.
- `cardDescription: HTMLElement` - DOM-элемент, отображающий описание товара.
- `cardImage: HTMLImageElement` - DOM-элемент, отображающий изображение товара.
- `cardTitle: HTMLElement` - DOM-элемент, отображающий название товара.
- `cardCategory: HTMLElement` - DOM-элемент, отображающий категорию товара.
- `cardPrice: HTMLElement` - DOM-элемент, отображающий цену товара.
- `deleteButton: HTMLButtonElement` - DOM-элемент кнопки удаления товара из корзины (если карточка находится в корзине).
- `previewButton: HTMLButtonElement` - DOM-элемент кнопки просмотра товара (если карточка находится в галерее).
- `cardId: string` - идентификатор карточки (товара).
- `buttonBasket: HTMLButtonElement` - DOM-элемент кнопки "Добавить в корзину" (если карточка находится в галерее).
- `categoryElement: HTMLElement` - DOM-элемент, отображающий категорию товара (для стилизации).
- `cardIndex: HTMLElement` - DOM-элемент, отображающий индекс карточки (если карточка находится в корзине).

### Методы:

- **`constructor(template:HTMLTemplateElement, events:IEvents)`**: Конструктор, инициализирующий поля класса, клонируя шаблон карточки.
- **`render(cardData: Partial<IProduct>)`**: Отображает карточку товара, заполняя ее данными.
- **`description: string`**: Свойство для установки описания товара.
- **`image: string`**: Свойство для установки изображения товара.
- **`title: string`**: Свойство для установки названия товара.
- **`category: string`**: Свойство для установки категории товара.
- **`price: number`**: Свойство для установки цены товара.
- **`index(value: number)`**: Устанавливает индекс карточки.
- **`id: string`**: Свойство для получения и установки идентификатора карточки. 

## Класс Basket

### Описание:

Класс `Basket` представляет собой корзину покупателя. Он позволяет добавлять товары в корзину, очищать корзину, устанавливать цену корзины и отображать ее в соответствующем элементе. Класс также включает кнопку оформления заказа, которая активируется при наличии товаров в корзине.

### Типизация:

- `event: IEvents` - брокер событий для отправки события открытия формы заказа.

### Поля:

- `element: HTMLElement` - DOM-элемент, представляющий корзину.
- `container: HTMLElement` - DOM-элемент, представляющий контейнер для товаров в корзине.
- `tempateElement: HTMLTemplateElement` - DOM-элемент, представляющий шаблон корзины.
- `basketPrice: HTMLElement` - DOM-элемент, отображающий цену корзины.
- `basketButton: HTMLButtonElement` - DOM-элемент кнопки оформления заказа.

### Методы:

- **`constructor(event: IEvents)`**: Конструктор, инициализирующий поля класса, клонируя шаблон корзины 
- **`setPrice(price: number)`**: Устанавливает цену корзины
- **`clearBasket()`**: Очищает содержимое корзины.
- **`setCardBasket(products: HTMLElement[])`**: Добавляет товары в корзину.
- **`render()`: HTMLElement** - Возвращает DOM-элемент корзины. 

## Класс Contact

### Описание:

Класс `Contact` представляет собой форму для ввода контактных данных (email и телефон). Он включает в себя валидацию введенных данных и отправку формы.

### Типизация:

- `event: IEvents` - брокер событий для отправки событий, связанных с формой.
- `contactErrors: IContactsErrors` - объект, содержащий ошибки валидации контактных данных.

### Поля:

- `element: HTMLElement` - DOM-элемент, представляющий форму.
- `contactButton: HTMLButtonElement` - DOM-элемент кнопки отправки формы.
- `inputEmail: HTMLInputElement` - DOM-элемент поля ввода email.
- `inputPhone: HTMLInputElement` - DOM-элемент поля ввода телефона.
- `errorContainer: HTMLElement` - DOM-элемент, отображающий сообщения об ошибках валидации.

### Методы:

- **`constructor(formError: IContactsErrors, event: IEvents)`**: Конструктор, инициализирующий поля класса и устанавливающий обработчики событий для ввода данных и отправки формы.
- **`render()`: HTMLElement`**: Возвращает DOM-элемент формы.
- **`handleError()`**: Обрабатывает ошибки валидации, отображая их в `errorContainer` и блокируя кнопку отправки формы, если есть ошибки.
- **`handleInput()`**: Обрабатывает ввод данных в поля формы.
- **`getData()`**: Возвращает объект с введенными пользователем данными.
- **`getFormData()`**: Возвращает объект с данными формы.

### Дополнительные сведения:

* Класс использует события для отправки информации о введенных данных и ошибках валидации.
* Форма не отправляется на сервер, а только эмулирует отправку (срабатывает событие `formSuccess:open`).
* Валидация данных происходит в реальном времени при вводе данных.
* Ошибки валидации отображаются в элементе `errorContainer`.

## Класс Order

### Описание:

Класс `Order` представляет собой форму для ввода данных заказа (адрес доставки, способ оплаты). Он включает в себя валидацию введенных данных и отправку формы.

### Типизация:

- `event: IEvents` - брокер событий для отправки событий, связанных с формой.
- `orderErrors: IOrderErrors` - объект, содержащий ошибки валидации данных заказа.

### Поля:

- `element: HTMLElement` - DOM-элемент, представляющий форму.
- `orderButton: HTMLButtonElement` - DOM-элемент кнопки отправки формы.
- `inputAddress: HTMLInputElement` - DOM-элемент поля ввода адреса.
- `buttons: HTMLButtonElement[]` - Массив DOM-элементов кнопок выбора способа оплаты.
- `activeButton: HTMLButtonElement | null` - Текущая выбранная кнопка способа оплаты.
- `errorContainer: HTMLElement` - DOM-элемент, отображающий сообщения об ошибках валидации.

### Методы:

- **`constructor(formError: IOrderErrors, event: IEvents)`**: Конструктор, инициализирующий поля класса и устанавливающий обработчики событий для ввода данных и отправки формы.
- **`render()`: HTMLElement`**: Возвращает DOM-элемент формы.
- **`handleError()`**: Обрабатывает ошибки валидации, отображая их в `errorContainer` и блокируя кнопку отправки формы, если есть ошибки.
- **`handleAddressInput()`**: Обрабатывает ввод данных в поле адреса.
- **`handleButtonClick(button: HTMLButtonElement)`**: Обрабатывает клик по кнопке выбора способа оплаты.
- **`getData()`**: Возвращает объект с введенными пользователем данными заказа.
- **`getFormData()`**: Возвращает объект с данными формы заказа.

### Дополнительные сведения:

* Класс использует события для отправки информации о введенных данных и ошибках валидации.
* Форма не отправляется на сервер, а только эмулирует отправку (срабатывает событие `formContact:open`).
* Валидация данных происходит в реальном времени при вводе данных.
* Ошибки валидации отображаются в элементе `errorContainer`.

## Класс Success

### Описание:

Класс `Success` представляет собой страницу, отображающую успешное завершение заказа.  Он показывает сообщение об успешной покупке и итоговую стоимость.

### Типизация:

- `event: IEvents` - брокер событий для отправки событий, связанных с формой.
- `total: IOrder` - объект, содержащий данные заказа.

### Поля:

- `element: HTMLElement` - DOM-элемент, представляющий страницу.
- `successButton: HTMLButtonElement` - DOM-элемент кнопки закрытия страницы.
- `totalPrice: HTMLElement` - DOM-элемент, отображающий итоговую стоимость заказа.

### Методы:

- **`constructor(event: IEvents)`**: Конструктор, инициализирующий поля класса и устанавливающий обработчик события закрытия страницы.
- **`render()`: HTMLElement`**: Возвращает DOM-элемент страницы.
- **`setPrice(price: number)`**: Устанавливает итоговую стоимость заказа.
- **`getPrice()`: { total: number }`**: Возвращает объект с итоговой стоимостью заказа.

## Взаимодействие компонентов

Взаимодействие между компонентами осуществляется через брокер событий (EventEmitter).

Список событий:

'product:loader' - Загружает и отрисовывает товары на странице.
'card:preview' - Открывает модальное окно с деталями товара.
'basket:add' - Добавляет товар в корзину.
'basket:changed' - Обновляет корзину (количество, товары, цена).
'card:delete' - Удаляет товар из корзины.
'basket:open' - Открывает корзину.
'formOrder:open' - Открывает форму оформления заказа.
'formOrder:lavidation' - Валидирует данные в форме заказа.
'formContact:open' - Открывает форму ввода контактных данных.
'formContact:lavidation' - Валидирует данные в форме контактных данных.
'formSuccess:open' - Показывает страницу успешной покупки.
'success:close' - Закрывает страницу успешной покупки.
