//базовый компонент
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	//переключить класс
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}
	//установить текстовое содержимое
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}
	// Сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// Скрыть
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// Показать
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// Установить изображение с алтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// Вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}

/*class Component<T extends HTMLElement> {
    container: T;
    events: IEvents;

    constructor(container: T) {
        this.container = container;
    }

    render
}

export default Component*/