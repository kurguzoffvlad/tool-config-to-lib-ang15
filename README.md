# Tool Config To Lib (Angular 15)

Библиотека для Angular 15, демонстрирующая передачу конфигурации из приложения-потребителя внутрь библиотеки через механизм `InjectionToken` и `ModuleWithProviders` (`forRoot`).

Приложение передаёт объект конфигурации (например, `apiUrl` и функцию `log`) один раз при импорте модуля библиотеки, а сервисы библиотеки используют его через DI.

---

## Содержание

- [Установка и запуск](#установка-и-запуск)
- [Структура](#структура)
- [Как это работает](#как-это-работает)
- [Использование в приложении](#использование-в-приложении)
- [Интерфейс конфигурации](#интерфейс-конфигурации)
- [Модуль библиотеки](#модуль-библиотеки)
- [Сервис библиотеки](#сервис-библиотеки)
- [Компонент библиотеки](#компонент-библиотеки)
- [Примечания](#примечания)

---

## Установка и запуск

Установите пакет:

```bash
npm install tool-config-to-lib-ang15
```

Селектор компонента: `lib-tool-config-to-lib-ang15`.

```html
<lib-tool-config-to-lib-ang15></lib-tool-config-to-lib-ang15>
```

---

## Структура

```
tool-config-to-lib-ang15/
├── config.token.ts                     # InjectionToken + интерфейс IConfigToLib
├── tool-config-to-lib-ang15.module.ts  # NgModule с forRoot(config)
├── tool-config-to-lib-ang15.service.ts # сервис, читающий конфиг
└── tool-config-to-lib-ang15.component.ts # компонент библиотеки
```

---

## Как это работает

1. Приложение описывает объект конфигурации типа `IConfigToLib`.
2. При импорте модуля библиотеки вызывается `ToolConfigToLibAng15Module.forRoot(config)`.
3. `forRoot` регистрирует конфиг в DI-контейнере через токен `LIB_CONFIG`.
4. Сервисы и компоненты библиотеки получают конфиг через `@Inject(LIB_CONFIG)`.

Такой подход позволяет библиотеке не зависеть от конкретных значений окружения приложения и оставаться переиспользуемой.

---

## Использование в приложении

### 1. Создайте конфиг

```ts
// tool-config-to-lib.interface.ts
import { IConfigToLib } from 'tool-config-to-lib-ang15';

export const configFromApp: IConfigToLib = {
    apiUrl: 'https://api.example.com',
    log: (m: any) => console.log('!!! Из приложения конфиг - ', m)
};
```

### 2. Подключите модуль с конфигом

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToolConfigToLibAng15Module } from 'tool-config-to-lib-ang15';
import { AppComponent } from './app.component';
import { configFromApp } from './tool-config-to-lib.interface';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        ToolConfigToLibAng15Module.forRoot(configFromApp)
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

### 3. Используйте сервис

```ts
import { Component } from '@angular/core';
import { ToolConfigToLibAng15Service } from 'tool-config-to-lib-ang15';

@Component({ /* ... */ })
export class MyComponent {
    constructor(private lib: ToolConfigToLibAng15Service) {
        const url = this.lib.doSomething();
        // url === 'https://api.example.com'
    }
}
```

---

## Интерфейс конфигурации

```ts
// config.token.ts
export interface IConfigToLib {
    apiUrl: string;

    log(msg: string): void;
}

export const LIB_CONFIG = new InjectionToken<IConfigToLib>('LIB_CONFIG');
```

| Поле | Тип | Назначение |
|---|---|---|
| `apiUrl` | `string` | базовый URL API, используемый библиотекой |
| `log` | `(msg: string) => void` | функция логирования, передаваемая из приложения |

`LIB_CONFIG` — это `InjectionToken`, по которому конфиг доступен в DI.

---

## Модуль библиотеки

```ts
@NgModule({
    declarations: [ToolConfigToLibAng15Component],
    imports: [],
    exports: [ToolConfigToLibAng15Component]
})
export class ToolConfigToLibAng15Module {
    static forRoot(config: IConfigToLib): ModuleWithProviders<ToolConfigToLibAng15Module> {
        return {
            ngModule: ToolConfigToLibAng15Module,
            providers: [{ provide: LIB_CONFIG, useValue: config }]
        };
    }
}
```

- `forRoot(config)` принимает конфиг и регистрирует его как значение `LIB_CONFIG`.
- Вызывать `forRoot` следует **только один раз** — в корневом модуле приложения (`AppModule`).
- Для лениво загружаемых модулей используйте импорт без `forRoot`.

---

## Сервис библиотеки

```ts
@Injectable({ providedIn: 'root' })
export class ToolConfigToLibAng15Service {

    constructor(@Inject(LIB_CONFIG) private cfg: IConfigToLib) {}

    public doSomething() {
        this.cfg.log('called');
        return this.cfg.apiUrl;
    }
}
```

| Метод | Возвращает | Описание |
|---|---|---|
| `doSomething()` | `string` | вызывает `cfg.log('called')` и возвращает `cfg.apiUrl` |

Сервис доступен через DI из любой точки приложения после регистрации модуля с конфигом.

---

## Компонент библиотеки

`ToolConfigToLibAng15Component` объявлен и экспортирован модулем. После импорта модуля его можно использовать в шаблонах приложения:

```html
<lib-tool-config-to-lib-ang15></lib-tool-config-to-lib-ang15>
```

Компонент имеет доступ к тем же DI-зависимостям, включая `LIB_CONFIG`, через свой конструктор.

---

## Примечания

- Конфиг в DI регистрируется как **значение** (`useValue`) — объект передаётся по ссылке, не клонируется.
- Если библиотека используется в ленивом модуле, `forRoot` **не** вызывается повторно: конфиг уже зарегистрирован в корневом инжекторе.
- Для SSR-совместимости функция `log` из конфига должна быть безопасна на сервере (не обращаться к `window`, `document` напрямую).
- `IConfigToLib` можно расширять — при этом стоит сохранять обратную совместимость, делая новые поля опциональными.
