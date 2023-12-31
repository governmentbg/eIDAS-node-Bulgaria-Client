
## Структура на услугата
-----------

Eidas клиентската услуга е пакетирана във war файл.

## Компоненти


### eIDAS-client библиотека

Eidas клиентската услуга разчита на [OpenSAML 3](https://wiki.shibboleth.net/confluence/display/OS30/Home) и [Spring Boot](https://projects.spring.io/spring-boot/) базови библиотеки.

### Конфигуриране

Конфигурацията на приложението се извършва чрез централизиран конфигурационен файл. 

### Събиране на събитията

Събирането на събития се извършва чрез SLF4J посредством Log4j2. От тук следва, възможността за настройване на събирането на събития чрез стандартен Log4j2 конфигурационен файл. По подразибране, събитията случващи се в `bg.is-bg.eidas.client` пакета се събират до ниво INFO и всичко останало до ниво WARN, като всички събития се извеждат в системната конзола. Допълнителен канал за извеждане може да бъде конфигуриран при нужда. 

## Предоставени интерфейси

Списъка с предоставените точки за комуникация за започване на транс-гранична заявка за идентификация и връщане на отговора ѝ са описани в Таблица 1. По детайлно описание за тях е дадено в секцията "Спецификация на интерфейсите".

| Интерфейс | Метод | Описание |
| ------------- | :------: | :------------|
| `/login` | POST | Чрез използването на POST метод, започва процеса по идентификация към eIDAS възела на избраната страна членка. |
| `/returnUrl` | POST | Приема се резултата от идентификацията. Визуализира информацията или грешка спрямо параметрите. |
| `/metadata` | GET | Публикуване на SAML 2.0 стандартни метаданни. Необходими са за създавне на доверие между eIDAS Specific-Connector и клиента. |
Таблица 1.

## Необходими интерфейси

За да функционира, eIDAS клиента има нужда от услуги предоставяни от eIDAS Specific-Connector и генерирани предварително ключове и настройки.

| Компонент | Описание |
| ------------- | :----- |
| ``Метаданни на eIDAS Specific-Connector'' | eIDAS клиента се нуждае от достъп до интерфейса за SAML 2.0 метаданни на eIDAS Specific-Connector. |
| ``eIDAS Specific-Connector услуга за автентикация'' | Интерфейс на eIDAS Specific-Connector услугата, в който се получават заявките за автентикация (наричан ``SingleSignOnService`` в метаданните предоставени от eIDAS Specific-Connector). |
| `Съхранение на ключове' | Ключовете необходими за подписване на SAML отговорите се съхраняват в хранилища за ключове (pkcs12,jks). |
| `Конфигурация` | Управлението на услугата и конфогурацията се извършва чрез централизиран конфигурационен файл. |
Таблица 2.