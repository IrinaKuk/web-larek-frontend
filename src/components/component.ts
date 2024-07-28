//определяем абстрактный класс Component
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {
    }
    // Переключаем класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}
    //Установливаем текст для элемента
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}
    //Установливаем картинку для элемента
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }
    // Скрываем элемент
    protected setHidden(element: HTMLElement) {
		    element.style.display = 'none';
	}
    // Показываем элемент
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}
	// меняем статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) {
                element.setAttribute('disabled', 'disabled');}
			else {
                element.removeAttribute('disabled');}
		}
	}
    //Обновляем свойства класса и возвращаем корневой элемент
    render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
