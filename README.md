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
1. Карточка товара:
```
export interface IProduct {
    id: string; // Уникальный идентификатор товара
    description: string; // Описание товара
    image: string; // URL-адрес изображения товара
    title: string; // Название товара
    category: string; // Категория товара
    price: number; // Цена товара
}
```
2. Массив карточек на главной странице:
```
export interface IProductsList {
    products: IProduct[]; // Массив объектов IProduct
    preview: string | null; // URL-адрес превью товара или null
}
```
3. Информация о товарах в корзине:
```
export type IBasket = Pick<IProduct, 'title' | 'price'>; // Тип данных, содержащий только название и цену товара
```

4. Форма ввода данных об адресе и способе доставки:
```
export interface IOrder {
    payment: string; // Способ оплаты
    adress: string; // Адрес доставки
}
```
5. Форма ввода контактных данных покупателя:
```
export interface IBuyerInfo {
    email: string; // Адрес электронной почты
    phone: string; // Номер телефона
}
```
6. Проверка валидации форм:
```
export interface IOrderData {
    CheckValidation(data: Record<keyof IOrder, string>): boolean; // Метод для проверки валидации формы IOrder
}
```
```
export interface IBuyerInfoData {
    CheckValidation(data: Record<keyof IBuyerInfo, string>): boolean; // Метод для проверки валидации формы IBuyerInfo
}
```
 # Архитектура приложения

Приложение реализовано с использованием архитектурного паттерна MVP (Model-View-Presenter):
Слой представления (View): Отвечает за отображение данных на странице.
Слой данных (Model): Отвечает за хранение и изменение данных.
Презентер (Presenter): Отвечает за связь между представлением и данными.

## Базовый код
 Класс Api:
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
Конструктор:

constructor(baseUrl: string, options: RequestInit = {}) - принимает базовый URL и глобальные опции для всех запросов(опционально)
Поля:

- baseUrl: string - базовый адрес сервера
- options: RequestInit - объект с заголовками запросов

Методы:
- get(): Выполняет GET-запрос на указанный URL.
- post(): Выполняет POST-запрос на указанный URL с передачей данных в JSON формате.
- handleResponse() - обрабатывает ответ от сервера

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
Поля:

events = new Map<EventName, Set<Subscriber>>() - используется для хранения информации о событиях и их подписчиках.

Методы:
- on(): Добавление обработчика на событие.
- off(): Удаление обработчика с события.
- emit(): Инициализация события.
- trigger(): Возвращает функцию, которая запускает событие.
- onAll(): Добавление обработчика на все события.
- offAll(): Удаление всех обработчиков событий.


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

- constructor(container: HTMLElement, events: IEvents) - конструктор принимает принимает DOM-элемент и экземпляр класса EventEmmiter

- container: HTMLElement - DOM-элемент контейнера

- events: IEvents - брокер событий

Методы:

- toggleClass - переключение класса
- setDisable - деактивация кнопок
- setActive - активация кнопок
- setHidden - скрытие элемента
- setVisible - отображение элемента
- setText - установка текста
- setImage - установка изображения
- render - Отображение данных.


## Слой данных

Класс AppInfo отвечает за хранение и логику работы с данными приложения
```
class AppInfo {
    products: IProduct[];
    preview: IProduct | null;
    basket: IBasket;
    order: IOrder | null;
    formErrors: Partial<Record<string, string>>;
    events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }
}
```

Конструктор:

- constructor(events: IEvents) - конструктор класса принимает инстант брокера событий
В полях класса хранятся следующие данные:

- products: IProduct[] - массив карточек продуктов
- preview: IProduct | null - просмотр подробной информации о продукте
- basket: IBasket - товары, добавленные пользователем в корзину
- order: IOrder | null - информация о заказе
- formErrors: Partial<Record<string, string>> - сообщение об ошибке при вводе данных в форме
- events: IEvents - события, происходящие на странице

Методы:

- setProducts() - вывод списка продуктов
- setPreview() - выбор продукта для предпросмотра
- addToBasket() - добавление товара в корзину.
- removeFromBasket() - удаление товара из корзины
- clearBasket() - очищаение корзины
- getTotal() - отображение суммы всех товаров в корзине
- setPaymentMethod() - выбор способа оплаты
- setOrderField() - ввод данных в поле заказа
- validateOrder() - проверка данных для заказа
- clearErrors() - очищение сообщений о ошибках форм

Модели данных:

- ProductModel: Представляет структуру данных для карточки товара (id, описание, изображение, название, категория, цена).
- OrderModel: Представляет структуру данных для заказа (способ оплаты, адрес).
- BuyerInfoModel: Представляет структуру данных для информации о покупателе (email, телефон).
Репозитории:

- ProductRepository: Хранилище ProductModel и обеспечивает методы для добавления, получения, обновления и удаления товаров.
- OrderRepository: Хранит OrderModel и обеспечивает методы для добавления, получения, обновления и удаления заказов.
- BuyerInfoRepository: Хранит BuyerInfoModel и обеспечивает методы для добавления, получения, обновления и удаления информации о покупателе.
Сервисы:

- ProductService: Предоставляет логику работы с товарами. Он взаимодействует с ProductRepository для доступа к данным.
- OrderService: Предоставляет логику работы с заказами. Он взаимодействует с OrderRepository для доступа к данным.
- BuyerInfoService: Предоставляет логику работы с информацией о покупателе. Он взаимодействует с BuyerInfoRepository для доступа к данным.

Класс Product:

Класс Product представляет собой компонент для отображения информации о продукте. Он наследует от класса Component и предоставляет интерфейс для установки и получения различных атрибутов продукта, а также для обработки событий клика по кнопке.

Свойства:

- blockName (protected): Строка, содержащая имя блока CSS для стилизации элемента.
- container (protected): HTML-элемент, в котором находится компонент.
- actions (protected): Объект, содержащий обработчик событий клика по кнопке продукта.
- _index (protected): HTML-элемент для отображения индекса продукта.
- _id (protected): HTML-элемент для хранения идентификатора продукта.
- _description (protected): HTML-элемент для отображения описания продукта.
- _image (protected): HTML-элемент для отображения изображения продукта.
- _title (protected): HTML-элемент для отображения заголовка продукта.
- _category (protected): HTML-элемент для отображения категории продукта.
- _price (protected): HTML-элемент для отображения цены продукта.
- _button (protected): HTML-элемент кнопки продукта.
- _deleteButton (protected): HTML-элемент кнопки удаления продукта.

Методы:

- constructor(blockName: string, container: HTMLElement, actions?: IProductActions): Конструктор класса. Принимает имя блока CSS, контейнер HTML-элемента и необязательный объект действий.
- set id(value: string): Устанавливает идентификатор продукта.
- get id(): string: Возвращает идентификатор продукта.
- set description(value: string): Устанавливает описание продукта.
- set image(value: string): Устанавливает изображение продукта.
- set title(value: string): Устанавливает заголовок продукта.
- get title(): string: Возвращает заголовок продукта.
- set category(value: string): Устанавливает категорию продукта.
- set price(value: number | null): Устанавливает цену продукта.
- set inBasket(isInBasket: boolean): Устанавливает текст кнопки продукта (в корзину/убрать).
- set index(value: number): Устанавливает индекс продукта.

Интерфейсы:

- IProduct: Интерфейс для объекта продукта.
- IProductActions: Интерфейс для объекта обработчиков событий клика по кнопке.

## Слой представления

 Класс Page:
Отвечает за отображение корзины и массива карточек товаров на странице.
Поля класса:
- counter: number - счетчик элементов в корзине.
- catalog: IProduct[] - массив объектов карточек товаров.

### Класс Modal:

Реализует модальное окно.
Предоставляет методы open и close для управления отображением.
Поля класса:
modal: HTMLElement - элемент модального окна
events: IEvents - экземпляр брокера событий

Конструктор:

- constructor(container: HTMLElement, events: IEvents) - наследуется от абстрактного класса Component

Поля класса:

- container: HTMLElement - элемент модального окна
- events: IEvents - брокер событий
- content: HTMLElement - контент, находящийся в модальном окне
- closeButton: HTMLButtonElement- кнопка закрытия модального окна

Методы класса:

- setContent() - присваивает контен модальному окну
- open() - управляет отображением модального окна - показывает на странице
- close() - управляет отображением модального окна - скрывает со страницы
- render() - наследует и расширяет метод родительского класса. Возвращает заполненный данными корневой DOM-элемент

### Класс Bascet

Класс Basket представляет собой компонент для отображения корзины товаров. Он наследует от класса Component и предоставляет интерфейс для управления списком товаров, общей суммой и обработкой событий.

Свойства:

- container (protected): HTML-элемент формы, в котором находится компонент.
events (protected): Объект, содержащий обработчики событий.
- _orderButton (protected): HTML-элемент кнопки оформления заказа.
- _list (protected): HTML-элемент списка товаров в корзине.
- _total (protected): HTML-элемент, отображающий общую стоимость товаров в корзине.

Методы:

- constructor(container: HTMLFormElement, events: IEvents): Конструктор класса. Принимает элемент формы и объект обработчиков событий.
- get list(): HTMLElement[]: Возвращает массив HTML-элементов товаров в корзине.
- set list(items: HTMLElement[]): Заменяет список товаров в корзине новым массивом элементов.
- get total(): number: Возвращает общую стоимость товаров в корзине.
- set total(total: number): Устанавливает общую стоимость товаров в корзине.

Интерфейсы:

- IBasketInfo: Интерфейс для объекта данных формы корзины.
- IEvents: Интерфейс для объекта обработчиков событий.

### Класс ModalWithBasket:

Расширяет класс Modal.
Реализует модальное окно с корзиной товаров.

Поля класса:

Конструктор:

- constructor(container: HTMLElement, events: IEvents) - наследуется от абстрактного класса Modal

Поля класса

- submitButton: HTMLButtonElement - кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- list: HTMLElement[] - коллекция элементов выбранных товаров
- total: string - сумма заказа

Методы:
- deleteCard(): удаление товара из корзины
- setItemsList() - вывод списка выбранных товаров
- setTotal() - вывод общей стоимости товаров


### Класс ModalForOrder
Реализует модальное окно для ввода данных для оформления заказа. Класс наследуется от абстрактного класса Component

Конструктор:

- constructor(container: HTMLElement, events: IEvents) - наследуется от абстрактного класса Component

Поля класса:

- submitButton: HTMLButtonElement - кнопка подтверждения
- errors: Record<string, HTMLElement> - объект хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов
- inputs: NodeListOf<HTMLInputElement> - коллекции всех полей ввода формы

Методы:

- setError() - принимает объект с данными для отображения или скрытия ошибок под полями ввода
- showInputError()- отображает полученный текст ошибки под указанным полем ввода
- hideInputError() - скрывает текст ошибки под указанным полем ввода
- clearModal() - очищает поля формы и сбрасывает состояния кнопок при сабмите

 ### Класс ModalWithAddress:

Расширяет класс Modal.
Реализует модальное окно с формой для ввода адреса и выбора способа оплаты.

Конструктор:

- constructor(container: HTMLElement, events: IEvents) - конструктор наследуется от абстрактного класса ModalForOrder

Поля класса:

Поля класса:

- PaymentButton: HTMLButtonElement - кнопка выбора способа оплаты
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы

Методы:

- setAddress() - устанавливает значение в поле адреса
- setPayment() - переключает выбранную пользователем кнопку выбора способа оплаты

 ### Класс ModalWithContacts:

Расширяет класс Modal.
Реализует модальное окно с формой для ввода телефона и email.

Конструктор:

- constructor(container: HTMLElement, events: IEvents) - конструктор наследуется от абстрактного класса ModalForOrder

Поля класса:

- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы

Методы:

- setEmail() - устанавливает значение в поле почтового адреса
- setPhone() - устанавливает значение в поле контактного телефона

 ### Класс SuccessfulOrder:

Расширяет класс Modal.
Реализует модальное окно с сообщением об успешном оформлении заказа.

Конструктор:

- constructor(container: HTMLElement, events: IEvents) - конструктор наследуется от абстрактного класса ModalForOrder

Поля класса:

- closeButton: HTMLButtonElement - кнопка закрытия формы при успешном оформлении заказа
- total: number - общая сумма покупки

Методы:

- setTotal() - устанавливает значение в поле общей суммы заказа

### Класс OrderForm
представляет собой компонент формы заказа. Он наследует от класса Component и предоставляет интерфейс для управления данными формы заказа, такими как имя пользователя, адрес, номер телефона, список продуктов и общая стоимость заказа, а также для обработки событий формы.

Поля класса:

- PaymentButton: HTMLButtonElement - кнопка выбора способа оплаты
- address: HTMLInputElement - элемент формы для ввода адреса

Методы:

- set address() - устанавливает значение в поле адреса
- set payment() - переключает выбранную пользователем кнопку выбора способа оплаты

Конструктор:

- constructor(container: HTMLElement, events: IEvents) - конструктор наследуется от абстрактного класса ModalForOrder

### Класс FormContacts

Представляет собой форму для ввода контактных данных покупателя. Он наследует от класса Form и предоставляет интерфейс для управления полями формы (email и телефон), а также для обработки событий формы.

Свойства:

- container (protected): HTML-элемент формы, в котором находится компонент.
- events (protected): Объект, содержащий обработчики событий.
- _email (protected): HTML-элемент поля ввода email.
- _phone (protected): HTML-элемент поля ввода телефона.

Методы:

- constructor(container: HTMLFormElement, events: IEvents): Конструктор класса. Принимает элемент формы и объект обработчиков событий.
- set email(value: string): Устанавливает значение поля ввода email.
- set phone(value: string): Устанавливает значение поля ввода телефона.

Интерфейсы:

- IBuyerInfo: Интерфейс для объекта данных формы контактов.
- IEvents: Интерфейс для объекта обработчиков событий.


## Взаимодействие компонентов

Взаимодействие между компонентами осуществляется через брокер событий (EventEmitter).

Список событий:

- products:changed - изменение массива карточек товаров
- product:selected - выбор товара (открытие модального окна с товаром)
- basket:open - открытие модального окна с корзиной
- basket:toggleItem - добавление/удаление товара из корзины
- basket:order - оформление заказа из корзины
- payment:change - выбор способа оплаты
- address:input - ввод адреса доставки
- order:submit - подтверждение данных для оплаты и доставки
- email:input - ввод почтового адреса клиента
- phone:input - ввод телефона клиента
- contacts:submit - подтверждение контактных данных
- order:complete - открытие окна с уведомлением об успешном оформлении заказа
- order:validation - необходимость валидации формы с вводом адреса и способа оплаты
- contacts::validation - необходимость валидации формы с контактными данными
