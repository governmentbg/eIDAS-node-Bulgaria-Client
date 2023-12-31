## Концепция

eIDAS Specific-Connector service -
SAML -


## Публикуване на метаданните от доставчика на услуги

Услугата eIDAS Specific-Connector изисква метаданните от доставчика на услуги за получаване на SAML заявки за автентикация и подготвяне на отговора им. eIDAS клиента публикува своите метаданни в `/metadata`. Метаданните са генерирани и подписани.

## Зареждане на метаданните от услугата eIDAS Specific-Connector.

Метаданните от услугата eIDAS Specific-Connector се прочитат при стартиране на eIDAS клиента (на база предварително конфигуриран адрес) и се записват в буфера. Той периодично се обновява спрямо параметрите [SAML metadata](https://docs.oasis-open.org/security/saml/v2.0/saml-metadata-2.0-os.pdf) `validUntil` или `cacheDuration`.

Без достъп до услугата, eIDAS клиента НЕ стартира.

## Процес по идентификация

Опростено процеса по идентификация чрез eIDAS клиента и eIDAS Specific-Connector следва следните стъпки:

1. Потребителя отваря основната страница, след което eIDAS клиента показва форма за избор на страна.

2. Потребителя избира страната, а при нужда и нивото за автентикация заедно с допълнителните параметри. Потребителят натиска бутон 'Login'. Страницата прави HTTP POST заявка към `/login` страницата с избраните параметри. В сървъра, eIDAS клиента формира съдържанието на `SAMLRequest` и се връща страница за препращане към потребителя, който автоматичносе насочва към услугата eIDAS Specific-Connector.

3. Браузъра автоматично насочва потребителя до eIDAS Specific-Connector услугата заедно със `SAMLRequest`, `RelayState` и `Country` параметрите, където транс граничната идентификация се извършва в последващи стъпки. Сред тях, потребителя се пренасочва към eIDAS възела на отсрещната страна, там той дава съгласие за предоставяне на данните си и се извършва идентификацията.

4. След успешна транс-гранична идентификация, eIDAS Specific-Connector връща резултата на `/returnUrl` адреса на eIDAS клиента, заедно с `SAMLResponse` и `RelayState` параметрите. eIDAS клиента валидира отговора, декриптира съдържанието и визуализира данните на лицето.

## Списък на поддържаните страни.

Списъка на поддържаните отстрещни страни (в JSON формат) се свале от URL заложен в конфигурацията по време на стартиране на приложението и буфериран (изтичането на буфера има възможност за настройка).