# Опътване за интегратори

- [Опътване за интегратори](#опътване-за-интегратори)
  - [1. Изисквания към инсталацията](#1-изисквания-към-инсталацията)
  - [2. eIDAS-Client конфигуриране](#2-eidas-client-конфигуриране)
    - [2.1. Конфигурационен файл](#21-конфигурационен-файл)
    - [2.2. Инсталиране на war файл в Tomcat приложен сървър](#22-инсталиране-на-war-файл-в-tomcat-приложен-сървър)
    - [2.3 Списък на конфигурационните параметри](#23-списък-на-конфигурационните-параметри)
  - [3. Генериране на SAML ключове](#3-генериране-на-saml-ключове)
  - [4. Събиране на събитията](#4-събиране-на-събитията)
    - [4.1. Конфигурация на събитията по подразбиране](#41-конфигурация-на-събитията-по-подразбиране)
    - [4.2 Настройване на събитията по подразбиране](#42-настройване-на-събитията-по-подразбиране)
    - [4.3 Използване на външен log4j2.xml конфигурационен файл](#43-използване-на-външен-log4j2xml-конфигурационен-файл)
  - [5. Мониториране - статус на приложението](#5-мониториране---статус-на-приложението)
  - [6. Hazelcast и много-инстанционна инсталация](#6-hazelcast-и-много-инстанционна-инсталация)
    - [6.1 Пускане на Hazelcast](#61-пускане-на-hazelcast)
    - [6.2 Конфигуриране на Hazelcast](#62-конфигуриране-на-hazelcast)
    - [6.3 Сигурност на информацията](#63-сигурност-на-информацията)
    - [6.4 Мониториране и статистика](#64-мониториране-и-статистика)

<a name="prerequisites"></a>
## 1. Изисквания към инсталацията

За да се инсталира eIDAS-Client са необходими следните миниални компоненти:
*JRE 11+
* Java приложен сървър (Tomcat 8.x или по-нов)

В допълнение, достъп до приложенията в eIDAS възела е необходим.


<a name="conf_all"></a>
## 2. eIDAS-Client конфигуриране
--------------------

Конфигурирането на приложението работи чрез централизиран Spring boot конфигурационен файл - `applicaiton.properties` - чието местоположение трябва да бъде предсотавено на приложението при стартиране.

Ако местоположението на файла не е посочено или файла не е достъпен, настройките по подразбиране ще бъдат използвани. Възможно е само промяната им чрез предоставяне на собствена зона за конфигурационнен файл с исканите параметри при стартиране.

<a name="conf"></a>
### 2.1. Конфигурационен файл

Приложението eIDAS-Client се нуждае от конфигурационен файл, който указва местоположението на SAML ключовете, името на клиента и важните URL-и, които са необходими за формирането и обработката на SAML заявките. Подробно описание на конфигурационните параметри е дадено в секцията #2.3 - Списък на конфигурационните параметри.

Пример на минималната изисквана конфигурация (с препрадка към предварително генерираните ключове):

```
# Keystore
eidas.client.keystore = file:/opt/tomcat/samlKeystore-test.jks
eidas.client.keystore-pass = ...

# Key used for signing the SAML metadata
eidas.client.metadata-signing-key-id = metadatasigning
eidas.client.metadata-signing-key-pass = ...
eidas.client.metadata-signature-algorithm = http://www.w3.org/2007/05/xmldsig-more#sha256-rsa-MGF1

# Key used for signing the SAML AuthnRequest
eidas.client.request-signing-key-id = requestsigning
eidas.client.request-signing-key-pass = ...
eidas.client.request-signature-algorithm = http://www.w3.org/2007/05/xmldsig-more#sha256-rsa-MGF1

# Key used to decrypt the SAML Assertion in response
eidas.client.response-decryption-key-id = responseencryption
eidas.client.response-decryption-key-pass = ...

# IDP metadata location
eidas.client.idp-metadata-url = http://eidas-node.dev:8080/EidasNode/ConnectorResponderMetadata

eidas.client.provider-name = EIDAS CLIENT DEMO
eidas.client.sp-entity-id = http://eidas-client.dev:8080/metadata
eidas.client.callback-url = https://eidas-client.dev/returnUrl

eidas.client.available-countries = EE,CA,BG
```

<a name="war_deployment"></a>
### 2.2. Инсталиране на war файл в Tomcat приложен сървър

1. Следвайте [**инструкциите**](../../README_BG.md) за изгражане на eIDAS-Client `war` файла заедно с примерната конфигурация.
2. Инсталирайте war файла в приложения сървър. <br><br>Препоръчително е eIDAS-Client да се инсталира като единствено приложение в приложния сървър (в случая на Tomcat като `ROOT` приложение).<br><br>
3. Предоставете на eIDAS-Client **местоположението до конфигурацията** чрез приложния сървър. За целта добавете `setenv.sh` файл в `tomcat/bin` папката, в който е описано местоположението на конфигурационни файл. Пример:
`export SPRING_CONFIG_ADDITIONAL_LOCATION=/etc/eidas-client/application.properties`



<a name="parameters"></a>
### 2.3 Списък на конфигурационните параметри

Table 2.3.1 - Настройки за метаданните на доставчика на услуги

| Параметър | Задължителен | Описание, пример |
| :---------------- | :---------- | :----------------|
| `eidas.client.hsm.enabled` | Не | Активиране на хардуерния модул за сигурност. По подразбиране `false` |
| `eidas.client.hsm.pin` | Да <sup>1</sup> | Парола за достъп до модула |
| `eidas.client.hsm.library` | Да <sup>1</sup> | Местоположение до библиотеката за комуникация с модула. Пирмерна стойност `/usr/lib/softhsm/libsofthsm2.so` при тестове с SoftHSM или специфичната за производитела на HSM модула |
| `eidas.client.hsm.slot` | Да <sup>1,2</sup> | Идентификатор на слота в модула. Примерна стойност `0` |
| `eidas.client.hsm.slot-list-index` | Да <sup>1,2</sup> | Индекс на опашката в модула. Примерна стойност `0` |
| `eidas.client.hsm.certificates-from-hsm` | Не <sup>3</sup> | Показва дали сертификатите могат да бъдат открити на хардуерния модул за сигурност заедно с ключовете им. По подразбиране `false` |
| `eidas.client.keystore` | Да | Указва местоположението на хранилището за ключове. Пример: `classpath:samlKeystore.jks`, ако файла се чете чрез classpath или `file:/etc/eidas-client/samlKeystore.jks` при директно четене от файловата система. Хранилището трябва да е от тип JKS. |
| `eidas.client.keystore-pass` | Да | Парола за SAML хранилището. |
| `eidas.client.metadata-signing-key-id` | Да <sup>5</sup> | Наименование на ключа за подписване на SAML метаданните. |
| `eidas.client.metadata-signing-key-pass` | Да<sup>4</sup> | Парола на ключа за подписване на SAML метаданните. |
| `eidas.client.metadata-signature-algorithm` | Не | Алгоритъм за подписване на метаданните. Позволени стойности. По подразбиране `http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha512` |
| `eidas.client.response-decryption-key-id` | Да <sup>5</sup> | Наименование на ключа за декриптиране на SAML отговорите за автентикация. |
| `eidas.client.response-decryption-key-pass` | Да <sup>4</sup> | Парола на ключа за декриптиране на SAML отговорите за автентикация. |
| `eidas.client.sp-entity-id` | Да | URL адрес, който отговаря за метаданните на доставчика на услуги. `/md:EntityDescriptor/@entityID` стойността в метаданните. Пример: https://hostname:8889/metadata |
| `eidas.client.callback-url` | Да | URL адрес, който посочва адреса на доставчика за услуги за SAML`/md:EntityDescriptor/md:SPSSODescriptor/md:AssertionConsumerService/@Location` стойността в метаданните. |

<sup>1</sup> Задължителен, ако `eidas.client.hsm.enabled=true`

<sup>2</sup> Ако `eidas.client.hsm.slot` е указан, `eidas.client.hsm.slot-list-index` стойността е игнорирана и стойността му не е уважена

<sup>3</sup> Ако `eidas.client.hsm.certificates-from-hsm=false`, сертификатите тряба да се намират под същото име в хранилището оказано в `eidas.client.keystore`

<sup>4</sup> Ако `eidas.client.hsm.enabled=true`, тази стойност е игнорирана.

<sup>5</sup> Приложимо за софтуерни хранилища, както и HSM.

Table 2.3.2 - Метаданни за Specific-Connector

| Параметър | Задължителен | Описание, пример |
| :---------------- | :---------- | :----------------|
| `eidas.client.idp-metadata-url` | Да | URL адреса на метаданните за Specific-Connector. https://eidas-test.egov.bg/SpecificConnctor/ConnectorResponderMetadata |
| `eidas.client.idp-metadata-signing-certificate-key-id` | Не | Наименованието на сертификата, използван за подписване на метаданните от Specific-Connector в хранилището. По подразбиране: `metadata`. |

Table 2.3.3 - Настройки за изпращаната AuthnRequest и SAML отговор

| Параметър | Задължителен | Описание, пример |
| :---------------- | :---------- | :----------------|
| `eidas.client.provider-name` | Да | Късо наименование на доставчика на услуги. Стойността на `/saml2p:AuthnRequest/@ProviderName`. |
| `eidas.client.request-signing-key-id` | Да <sup>2</sup> | Наименованието на ключа за подписване на заявките за SAML автентикация. |
| `eidas.client.request-signing-key-pass` | Да <sup>1</sup> | Парола за ключа за подписване на заявките за SAML автентикация. |
| `eidas.client.accepted-clock-skew` | Не | Максимален времеви дрифт (в секунди), който се приема между IDP и SP. По подразбиране 2. |
| `eidas.client.maximum-authentication-lifetime` | Не | Време за живот на заявките за автентикация в секунди. По подразбиране 900. |
| `eidas.client.response-message-lifetime` | Не | Време за живот на SAML отговора в секунди. По подразбиране 900. |
| `eidas.client.request-signature-algorithm` | Не | Алгоритъм за подписване на заявките за автентикация. По подразбиране `http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha512` |
| `eidas.client.available-countries` | Не | Позволени кодове на страни. |
| `eidas.client.default-loa` | Не | Ниво на гарантираност в eIDAS, ако потребителя не е подал различно ниво. Позволени стойности: 'LOW', 'SUBSTANTIAL', 'HIGH'. По подразбиране 'SUBSTANTIAL'. |
| `eidas.client.allowed-eidas-attributes` | Не | Списък от разделени със запетая стойности на EidasAttributes. По подразбиране е списъка на всички възможни стойности на EidasAttribute. |

<sup>1</sup> При `eidas.client.hsm.enabled=true`, се игнорира.

<sup>2</sup> Приложимо както за софтуерни хранилища, така и за HSM.

Table 2.3.4 - Настройки за сигуроността

| Параметър | Задължителен | Описание, пример |
| :---------------- | :---------- | :----------------|
| `security.allowed-authentication-port` | Не | Ако е посочен, ограничава заявките до точките за автентикация (`/login` и `/returnUrl`) само чрез посочения порт. В този случай `403 Forbidden` и описание на грешката (JSON обект) се връщат при опит да се достъпи през друг порт. Позволени стойности: цели числа в диапазон 1 - 65535. |
| `security.disabled-http-methods` | Не | Списък от разделени със запетая HTTP методи. Ако е посочен, ограничава достъпа до HTTP методите. В този случай, `HTTP 405` се връща при използване на различен метод от описаните. Ако не е посочен, HTTP методите които са забранени са: HEAD, PUT, PATCH, DELETE, OPTIONS, TRACE. Позволени стойности: GET, POST, HEAD, PUT, PATCH, DELETE, OPTIONS, TRACE |

Table 2.3.5 - Проверка на "пулс"

| Параметър | Задължителен | Описание, пример |
| :---------------- | :---------- | :----------------|
| `management.endpoint.heartbeat.timeout` | Не | Максимално време за отговор в секунди, на заявките за проверка на свързаните системи. По подразбиране:  3 секунди. |
| `management.endpoint.heartbeat.credentials.test-interval` | Не<sup>1</sup> | Интервал за проверка на ключовете за подписване на метаданните, ако HSM е конфигуриран<sup>2</sup>. По подразбиране 60 seconds. |

<sup>1</sup> Само ако `eidas.client.hsm.enabled=true`

<sup>2</sup> Тестовете на ключовете в HSM се извършват само `heartbeat` е извиан. Това цели да се намали натоварването към HSM. Ако се дефинира стойност, ще ограничи заявките и при извикване под него ще връща резултата от последната проверка, ако е успешна тя. При грешка, ще прави проверка на всяко извикване.

<a name="conf_hazelcast"></a>
Table 2.3.6 - Hazelcast конфигуриране

| Параметър | Задължителен | Описание, пример |
| :---------------- | :---------- | :----------------|
| `eidas.client.hazelcast-enabled` | Не | Активиране на Hazelcast. |
| `eidas.client.hazelcast-config` | Не <sup>1</sup> | <p>Посочва конфигурационни файл.</p><p>Пример: `classpath:hazelcast.xml` ако се чете чрез classpath или `file:/etc/eidas-client/hazelcast.xml` ако се указва файл.</p> |
| `eidas.client.hazelcast-signing-key` | Не <sup>1</sup> | <p>HMAC ключ в base64 енкодирана форма (за подписване на хеш таблиците). Дължината на ключа зависи от алгоритъм за подписване.</p><p>За HMAC512, е нужно 512-bit дълго произволно число.</p><p>Пример за генерирането на 512-bit ключ чрез openssl: `openssl rand -base64 64`</p>|
| `eidas.client.hazelcast-signing-algorithm` | Не | Алгоритъм за подписване (`HS512`, `HS384`, `HS256`). По подразбиране `HS512`. |
| `eidas.client.hazelcast-encryption-key` | Не <sup>1</sup> | <p>Ключ за криптиране в base64 форма (симетричен ключ използван за криптиране на съдържанието на хеш таблиците).</p><p>За `AES` алгоритъма, ключа трябва винаги да е 128 бита</p><p>Пример за генерирането на 128 битов чрез openssl `openssl rand -base64 16` </p>|
| `eidas.client.hazelcast-encryption-alg` | Не | Алгоритъм за криптиране спрямо стадартния [List of Java Cryptographic Algorithms](https://docs.oracle.com/javase/8/docs/technotes/guides/security/StandardNames.html#Cipher). По подразбиране `AES`. |

<sup>1</sup> Задължително, при `eidas.client.hazelcast-enabled`.


Примерна конфигурация:
```
eidas.client.hazelcast-enabled = true
eidas.client.hazelcast-config = file:/etc/eidas-client/hazelcast.xml
eidas.client.hazelcast-signing-key=JgeUmXWHRs1FClKuStKRNWvfNWfFHWGSR8jgN8_xEoBSGnkiHHgEEHMttYmMtzy88rnlO6yfmQpSAJ0yNA9NWw
eidas.client.hazelcast-signing-algorithm=HS512
eidas.client.hazelcast-encryption-key=K7KVMOrgRj7Pw5GDHdXjKQ==
eidas.client.hazelcast-encryption-alg=AES
```

Table 2.3.7 - Hazelcast точка за статистика

| Параметър | Задължителен | Описание, пример |
| :---------------- | :---------- | :----------------|
| `management.endpoint.hazelcast.enabled` | Не | Възможни стойности: `true`, `false`. Пуска `/hazelcast` точката. По подразбиране `false`. |

Table 2.3.8 - Настройки за non-notified LoAs

| Параметър | Задължителен | Описание, пример |
| :---------------- | :---------- | :----------------|
| `eidas.client.non-notified-assurance-levels[0].country` | Не | За коя страна става на въпрос. Само 1 за всяка страна. |
| `eidas.client.non-notified-assurance-levels[0].non-notified-level` | Не | non-notified LoA. Пример: `http://eidas.europa.eu/NonNotified/LoA/low` |
| `eidas.client.non-notified-assurance-levels[0].notified-level` | Не | Ако искания LoA е равен или по нисък от предоставения тук, тогава нивото на non-notifed LoA се прилага. Пример: `http://eidas.europa.eu/LoA/substantial` |


<a name="votmed"></a>
## 3. Генериране на SAML ключове

За да работи, приложениет изисква няколко двойки публични и частни ключове, заедно с публичния ключ подписал метаданните от Specific-Connector услугата, или т.нар. котва на доверие. Ключовите двойки се съхраняват в същото 'jks' хранилище (името по подразбиране е `samlKeystore.jks`, освен ако не е посочено друго в конфигурационния файл). Наименованието посочено в конфигурацията се подава в ключовата двойка.

Пример за генерирането на необходимите ключове посредством Java `keytool`:

**1. Създаване на хранилището и двойката за подписване на eIDAS-Client метаданните.**
`keytool -genkeypair -keyalg EC -keystore $keystoreFileName -keysize 384 -alias metadata -dname "CN=SP-metada-signing, OU=test, O=test, C=BG" -validity 730 -storepass $password -keypass $ passport`

**2. Двойка за подписване на заявките за автентикация**
`keytool -genkeypair -keyalg EC -keystore $keystoreFileName -keysize 384 -alias requestsigning -dname "CN=SP-auth-request-signing, OU=test, O=test, C=BG" -validity 730 -storepass $password - keypass $password`

**3. Двойка за криптиране на отговорите за автентикация**
`keytool -genkeypair -keyalg RSA -keystore $keystoreFileName -keysize 4096 -alias responseencryption -dname "CN=SP-response-encryption, OU=test, O=test, C=BG" -validity 730 -storepass $password -keypass $ password`

**4. Импортиране на сертификата за метаданните на Specific-Connector**
`keytool -importcert -keystore $keystoreFileName -storepass $password -file scripts/bg_eidasnode.pem -alias idpmetadata -noprompt`




<a name="login"></a>
## 4. Събиране на събитията
----------------

[Log4j2 framework](https://logging.apache.org/log4j/2.x/index.html) се използва за събиране на събитията, като може да бъде конфигурирана чрез [XML конфигурационен файл](https://logging.apache.org/log4j/ 2.x/manual/configuration.html) (`log4j2.xml`).

<a name="login_naidis"></a>
### 4.1. Конфигурация на събитията по подразбиране

Приложението идва с [конфигурация по подразбиране](../../eidas-client-webapp/src/main/resources/log4j2.xml) която записва към файловата система `/var/log/eidas` папка с наименование `eIDAS-Client-%d {yyyy-MM-dd}`, на пример `/var/log/eidas/eIDAS-Client-2019-08-06.log`. Приложението пише логовете за последните 7 дни в некомпресиран формат. Нивото на записване на събития в eIDAS-client е `INFO`, а за останалите събития `WARN`.

В конфигурацията по подразбиране, формата на записите е JSON, като всеки нов запис приключва със символ за нов ред `\n`.

Table 4.1.1 - Структура на записа

| Поле | Описание | Наличен винаги |
| :----------- | :-------- | :----------- |
| **date** | Дата и час на събитието във формат ISO-8601. Пример: `2018-09-13T10:06:50,682+0000` | Да |
| **level** | Ниво на събиране. Възможнис тойности ​​(от най ниския до най високия): `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL` | Да |
| **request** | Метод на заявката и URL адрес. Липсва стойност, ако събитието не е породено от заявка. Пример: `GET http://eidas-client.arendus.kit:8080/login` | Не |
| **requestId** | Стойността на хедъра `X-Request-ID` от заявката, ако липсва е произволно генерирана комбинация от букви и цифри с дължина 16 символа, която идентифицира заявката. Без стойност, ако събитието не е породено от заявка. | Не |
| **sessionId** | Стойността на хедъра `X-Correlation-ID` от заявката, или при липсата му, **sha256** хеш генериран от ID на сесията в base64 формат. Без стойност, ако събитието не е породено от заявка. | Не |
| **logger** | Име на събиращия | Да |
| **thread** | Име на нишката. | Да |
| **message** | Съобщение, оградено чрез JSON-_escaping_.| Да |
| **throwable** | Стек на грешката, ограден чрез JSON-_escaping_. | Не |

Пример:

```
{"date":"2018-09-13T10:06:50,682+0000", "level":"INFO", "request":"GET http://eidas-client.arendus.kit:8080/login", "requestId":"0VVIBKN0GMZAKCVP", "sessionId":"LgoVYrdPv4PiHkRFGLfMD9h08dqpOC9NiVAQDL0hpGw=", "logger":"bg.is-bg.eidas.client.AuthInitiationService", "thread":"http-nio-8080-exec-1", " message":"SAML request ID: _8d4900cb8ae92034fa2cd89e6d8e8d89"}
```

<a name="login_setting"></a>
### 4.2 Настройване на събитията по подразбиране

В настройките по подразбиране е възможно да се контролира изхода и нивото на събиране от eIDAS client събития.

Таблица 4.2.1 - Параметри, подлежащи на промяна в конфигурацият апо подразбиране

| Параметър | Описание | Стойност по подразбиране |
| :---------------- | :---------- | :----------------|
| `eidas.client.log.pattern` | Схема на съобщението. | `{"date":"%d{yyyy-MM-dd'T'HH:mm:ss,SSSZ}", "level":"%level"%notEmpty{, "request":"%X{request} "}%notEmpty{, "requestId":"%X{requestId}"}%notEmpty{, "sessionId":"%X{sessionId}"}, "logger":"%logger", "thread":"% thread", "message":"%enc{%msg}{JSON}"notEmpty{, "throwable":"%enc{%throwable}{JSON}"}}%n` |
| `eidas.client.log.level` | Ниво на събираните събития от eIDAS client. Едно от: `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE` | `info` |

Възможно е да се променят стойностите по подразбиране на тези параметри използвайки системни параметри при стартиране на приложението (виж [Инсталиране](Configuration_BG.md#war_deployment) точка 3), на пример:

```
export JAVA_OPTS="-Deidas.client.log.pattern=%m%n -Deidas.client.log.level=debug"
```

Table 4.2.2 - **MDC** (_Mapped Diagnostic Context_) стойности възможни при събиране на събития

| Стойност | Описание |
| :---------------- | :-------- |
| `request` | Метод и URL на заявката. Без стойност, ако събитието не е породено от заявка. Пример: `GET http://eidas-client.arendus.kit:8080/login` |
| `requestId` | Стойността на `X-Request-ID` хеъдра от заявката, при липсата му произволен 16 символен низ от букви и цифри, който идентифицра заявката. Без стойност ако събитието не е породено от заявка. |
| `sessionId` | Стойността на `X-Correlation-ID` хедъра от заявката, при липсата му **sha256** хеш генериран от ID на сесията в base64 форма. Без стойност, ако събитието не е породено от заявка. |


<a name="login_on"></a>
### 4.3 Използване на външен log4j2.xml конфигурационен файл

При необходимост може да се използва собствен конфигурационен файл, различен от този по подразбиране. За целта, локацията на новия файл трябва да бъде подадена към приложението при стартирането му (виж [Инсталиране](Configuration_BG.md#war_deployment) точка 3), на пример:

```
export JAVA_OPTS="-Dlogging.config=/etc/eidas-client/log4j2.xml"
```

<a name="heartbeat"></a>
## 5. Мониториране - статус на приложението

Статуса на приложението е наличен чрез **/heartbeat** точката.

Spring Boot Actuator се използва за да покаже информация за статуса на приложениет. По подразбиране, всички точки освен **/heartbeat** са изключени. 

Ако е необходимо, допълнителни точки могат да бъдат конфигурирани спрямо ръководството: <https://docs.spring.io/spring-boot/docs/2.2.1.RELEASE/reference/htmlsingle/#production-ready-endpoints-enabling-endpoints> .



<a name="clustering"></a>
## 6. Hazelcast и много-инстанционна инсталация

The eIDAS-Client must keep track of sent SAML requests to determine the correctness of the SAML response. By default, information about issued and unanswered requests is stored in the server's memory, which means that when clustering, the response must always come to the same shoulder where the request was issued. An alternative is to use the hash table in the Hazelcast cluster to share request information between eIDAS-Client instances.

<a name="hazelcast"></a>
### 6.1 Пускане на Hazelcast

Hazelcast се изпълнява, като част от eIDAS-client приложението. Hazelcast се стартира само ако местополижението на Hazelcast xml файла е посочено в конфигурационния файл (виж [конфигурационни параметри](#conf_hazelcast)).

<a name="hazelcast_settings"></a>
### 6.2 Конфигуриране на Hazelcast

Hazelcast се конфигурира декларативно чрез xml конфигурационен файл. Повече за настройването на Hazelcast [тук](https://docs.hazelcast.org/docs/3.11/manual/html-single/index.html#configuring-declaratively).

Пример за минимална конфигурация, използвайки TCP-IP механизма за откриване:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<hazelcast xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns="http://www.hazelcast.com/schema/config"
           xsi:schemaLocation="http://www.hazelcast.com/schema/config
                               https://hazelcast.com/schema/config/hazelcast-config-3.7.xsd">
    <group>
        <name>eidas-client-cluster</name>
    </group>
    <network>
        <port auto-increment="false">5702</port>
        <join>
            <multicast enabled="false"></multicast>
            <tcp-ip enabled="true">
				<member>xxx.xxx.xxx.xxx:5702</member>
                <member>yyy.yyy.yyy.yyy:5702</member>
                <member>zzz.zzz.zzz.zzz:5702</member>
			</tcp-ip>
        </join>
    </network>
</hazelcast>
```

<a name="hazelcast_turva"></a>
### 6.3 Сигурност на информацията

eIDAS-Client криптира със симетричен ключ (AES алгоритъм по подразбиране) и подписва данните (по подразбиране HMAC512 алгоритъм) преди да запише в споделената хаш таблица. Когато се извиква информация от Hazelcast, подписа се верифицира и само тогава декриптира.

За конфигуриране на алгоритмите, виж [конфигурационните параметри](#conf_hazelcast).

<a name="hazelcast_monitoring"></a>
### 6.4 Мониториране и статистика

Hazelcast може да се мониторира чрез собствения му [health endpoint](https://docs.hazelcast.org/docs/3.12/manual/html-single/index.html#health-check) (изключен по подразбиране).

В допълнение, възможно е да се извади по детайлна информация от [журнала за диагностика](https://docs.hazelcast.org/docs/3.12/manual/html-single/index.html#diagnostics) и да се провери клъстера чрез пускане на [JMX порта] (https://docs.hazelcast.org/docs/3.11/manual/html-single/index.html#monitoring-with-jmx).

eIDAS-Client подава към `/hazelcast` точката (спряна по подразбиране) минимална статистика.

