# Спецификация на интерфейса
-----------

## **Комуникационни точки**

Всички заявки и отговори са презентирани в UTF-8 енкодинг.
Използването на HTTPS е задължително. Препоръчително е да се и двупосочен HTTPS.

Използването на `X-Requested-ID` и `X-Correlation-ID` хедъри е препоръчително. При изолзването им, тяхната стойност се записва в журнала на събития като `requestId` и `sessionId`, което улеснява проследяването между различни системи.

Метод | HTTP заявка | Описание
------------- | ------------- | -------------
[**login**](Service-API_BG.md#login) | **GET** /login | конструира и връща заявката изисквана от eIDAS Specific-Connector за започване на автентикация, както и генерира страницата, пренасочваща клиента.
[**returnUrl**](Service-API_BG.md#returnUrl) | **POST** /returnUrl | Обработка на отговора след трансгранична автентикация. SAML отговора се валидира спрямо [SAML 2 Web SSO Profile](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf). Връща данните за лицето при успешно преминаване на проверките. 
[**metadata**](Service-API_BG.md#metadata) | **GET** /metadata | Връща SAML метаданните за клиента.
[**supportedCountries**](Service-API_BG.md#supportedCountries) | **GET** /supportedCountries | Връща списък с поддържаните страни от услугата.
[**heartbeat**](Service-API_BG.md#heartbeat) | **GET** /heartbeat or /heartbeat.json | Връща информация за статус.
[**hazelcast**](Service-API_BG.md#hazelcast) | **GET** /hazelcast or /hazelcast.json | Връща информация за Hazelcast клъстера. **Спряна по подразбиране**.


<a name="login"></a>
## **/login**

### Заявка

Параметри:

| Име на параметъра | Задължителен | Описание |
| ------------- |:-------------:| :-----|
| **Country** | Да | Посочва страната на гражданина, който ще се идентифицира.([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) код). |
| **RequesterID** | Да | Уникален идентификатор на информационната система |
| **SPType** | Да | Определя дали клиента е в публичен сектор (`public`) или частен (`private`). |
| **LoA** | Не | Определя изискваното ниво на LoA при идентификация. Една от следните стойности: `LOW`, `SUBSTANTIAL`, `HIGH`. Ако липсва, по подразбиране се използва `SUBSTANTIAL`. |
| **RelayState** | Не | Параметър, който се изпраща без модификация към Specific-connector. Стойността трябва да отговаря следните възможни символи `[a-zA-Z0-9-_]{0,80}`. |
| **Attributes** | Не | Параметъра съдържа разделение с интервал eIDAS атрибути (wyw formata *FriendlyName*), които се изискват в заявката за автентикация. Интервалите се репрезентират чрез ([RFC 3986](https://www.ietf.org/rfc/rfc3986.txt)). Позволените eIDAS атрибути са: `FamilyName`, `FirstName`, `DateOfBirth`, `PersonIdentifier`, `BirthName`, `PlaceOfBirth`,`CurrentAddress`,`Gender`, `LegalPersonIdentifier`, `LegalName`, `LegalAddress`, `VATRegistration `, `TaxReference`, `LEI`, `EORI`, `SEED`, `SIC`, `D-2012-17-EUIdentifier` (виж още [eIDAS Attribute Profile](https://ec.europa. eu/cefdigital/wiki/download/attachments/46992719/eIDAS%20SAML%20Attribute%20Profile%20v1.1_2.pdf?version=1&modificationDate=1497252920100&api=v2)).

Example:
```bash
curl 'https://localhost:8889/login?Country=CA&RequesterID=d7942ab8&SPType=public'
```

```bash
curl 'https://localhost:8889/login?Country=CA&RequesterID=d7942ab8&SPType=public&LoA=LOW'
```

```bash
curl 'https://localhost:8889/login?Country=CA&RequesterID=d7942ab8&SPType=public&LoA=LOW&RelayState=kse2vna8221lyauej'
```

```bash
curl 'https://localhost:8889/login?Country=CA&RequesterID=d7942ab8&SPType=public&LoA=LOW&RelayState=kse2vna8221lyauej&Attributes=LegalPersonIdentifier%20LegalName%20LegalAddress'
```


### Отговор

При успешен **отговор**, HTTP статус с код 200 се връща, заедмо със SAML заявка и HTML страница, която е необходима да пренасочи клиента.

| Име на атрибута | Задължителен | Описание |
| ------------- |:-------------:| :-----|
| **country** | Да | Посочва страната на лицето, което се идентифицира. Стойността отговаря на [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) стандарта. |
| **SAMLRequest** | Да | SAML `AuthnRequest` заявка спрямо спецификацията на Specific-Connector. |
| **RelayState** | Не | Параметър, който се подава към конектора без промяна. Стойността трябва да отговаря на диапазона `[a-zA-Z0-9-_]{0,80}`. |

Пример:
```xml
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
    <body onload="document.forms[0].submit()">
        <noscript>
            <p>
                <strong>Note:</strong> Since your browser does not support JavaScript,
                you must press the Continue button once to proceed.
            </p>
        </noscript>
        <form action="https://eidas-test.egov.bg/:8080/EidasNode/ServiceProvider" method="post">
            <div>
                <input type="hidden" name="SAMLRequest" value="PD94bWw...........MnA6QXV0aG5SZXF1ZXN0Pg=="/>
                <input type="hidden" name="country" value="CA"/>
            </div>
            <noscript>
                <div>
                    <input type="submit" value="Continue"/>
                </div>
            </noscript>
        </form>
    </body>
</html>
```

**При грешка**, отговора е във формат описан в [**поведение при грешка**](Service-API_BG.md#error handling). Възможние ситуации за грешка са описани по-долу:

| HTTP статус код | Кратко описание | Текст, описващ грешката |
| :-------------: |:-------------| :-----|
| 400 | Bad request | Required request parameter 'Country' for method parameter type String is not present |
| 400 | Bad request | Required request parameter 'RequesterID' for method parameter type String is not present |
| 400 | Bad request | Required request parameter 'SPType' for method parameter type SPType is not present |
| 400 | Bad request | Invalid country! Valid countries:[...] |
| 400 | Bad request | Invalid LoA! One of [...] expected. |
| 400 | Bad request | Invalid RelayState! Must match the following regexp: [...] |
| 400 | Bad request | Invalid SPType! Must match the following regexp: [...] |
| 400 | Bad request | Found one or more invalid Attributes value(s). Valid values ​​are: [...] |
| 400 | Bad request | Attributes value '[.]' is not allowed. Allowed values ​​are: : [...] |
| 403 | Forbidden | Endpoint not allowed to be accessed via port number [...] |
| 405 | Method Not Allowed | Request method [...] not supported |
| 500 | Internal Server Error | Something went wrong internally. Please consult server logs for further details. |



------------------------------------------------


<a name="returnUrl"></a>
## **/returnUrl**

### Заявка

| Хедър |
| :------------------------- |
| `Content-Type: application/x-www-form-urlencoded` |

| Параметър | Задължителен | Описание |
| ------------- |:-------------:| :-----|
| **SAMLResponse** | Да | SAML отговора във (Base64 енкодирана форма) от транс-граничната автентикация. |

Example:

```bash
curl -X POST \
  https://localhost:8889/returnUrl \
  -H 'content-type: application/x-www-form-urlencoded' \
  -d 'SAMLResponse=..........................'
```

### Отговор

**HTTP 200** се връща заедно с личната информация, ако **автентикацията е успешна** (виж Таблица 1).

Име на атрибут | Задължителен | Описание | Тип
------------ | ------------- | ------------- | -------------
**levelOfAssurance** | Да | Ниво на автентикация. Възможни стойности: `http://eidas.europa.eu/LoA/low`, `http://eidas.europa.eu/LoA/substantial`, `http://eidas.europa.eu/LoA/high` | **Низ**
**attributes** | Да | Списък от атрибути с персонални данни. Атрибутите са презентирани като ключ-стойност двойки, където ключа отговаря на `FriendlyName`, а стойността на `AttributeValue` спрямо eIDAS SAML Attribute Profile document<p>**Mandatory attributes** - Съдържа атрибути, които са задължителни.</p><p> 1. Четири атрибута винаги се връщат при физическо лице: `FirstName`, `FamilyName`, `PersonIdentifier` и ` DateOfBirth`.</p><p>2. За юридическо лице: `LegalPersonIdentifier`, `LegalName` се връщат винаги **само ако** са изискани в заявката.</p><p>**Опционални допълнителни атрибути** - В допълнение,е възможно в EIDAS заявката опционални атрибути: `RepresentativeLegalName`, `RepresentativeLegalAddress`, `RepresentativeLegalPersonIdentifier`, `RepresentativeSEED`, `RepresentativeSIC`,`RepresentativeTaxReference`, `RepresentativeVATRegistration`</p> | **Обект**
**attributes.FirstName** | Да | Име на лицето | **Низ**
**attributes.FamilyName** | Да | Фамилия на лицето. | **Низ**
**attributes.PersonIdentifier** | Да | Уникален код идентифициращ лицето. <br><br>Подаден във формат XX+ “/“ + YY + “/“ + ZZZZZZ..., където XX е кодът на държавата на идентифицираното лице (ISO 3166-1 alpha-2), YY е кодът на държавата (ISO 3166-1 alpha-2), чието лице трябва да бъде удостоверено, и ZZZZZZ... е кодът, идентифициращ лице от страната на местоназначение (точният формат зависи от държавата на местоназначение). | **Низ**
**attributes.DateOfBirth** | Да | Дата на разждане във формат: YYYY + “-“ + MM + “-“ + DD (където YYYY е годината, MM е месеца и DD е деня) | **Низ**
**attributes.LegalPersonIdentifier** | Не | Идентификатор на юридическото лице. Ще бъде върнат, само ако лицето е пожелало. | **Низ**
**attributes.LegalName** | Не | Името на юридическото лице. Ще бъде върнат, само ако лицето е пожелало. | **Низ**
**attributesTransliterated** | Не | Съдържа стойности на атрибути в транслитерирана форма. Атрибутите са представени като двойки ключ-стойност, където ключът е `FriendlyName`, а стойността е транслитерираното съдържание на елемента `AttributeValue` според документа на eIDAS SAML Attribute Profile. | **Обект**
Таблица 1.

Пример:
```json
{
   "levelOfAssurance":"http://eidas.europa.eu/LoA/substantial",
   "attributes":{
      "DateOfBirth":"1965-01-01",
      "PersonIdentifier":"CA/CA/12345",
      "FamilyName":"Ωνάσης",
      "FirstName":"Αλέξανδρος"
   },
   "attributesTransliterated":{
      "FamilyName":"Onassis",
      "FirstName":"Alexander"
   }
}
```

В случай на **неуспешна автентикация**, **HTTP 401** и [**описание на грешката**](Service-API_BG.md#error description) се връщат, спрямо описаните. Възможните ситуации са в таблицата по долу:

| HTTP статус код | Кратко описание | Текст описващ грешката |
| :-------------: |:-------------| :-----|
| 401 | Unauthorized | Authentication files |
| 401 | Unauthorized | No user consent received. User denied access. |

При **други грешки**, отговора е оформен спрямо [**error handling**](Service-API_BG.md#error handling). Възможните стойности са в таблицата по долу:

| HTTP статус код | Кратко описание | Текст описващ грешката |
| :-------------: |:-------------| :-----|
| 400 | Bad request | Required request parameter 'SAMLResponse' for method parameter type String is not present |
| 400 | Bad request | Invalid SAMLResponse. [...] |
| 403 | Forbidden | Endpoint not allowed to be accessed via port number [...] |
| 405 | Method Not Allowed | Request method [...] not supported |
| 500 | Internal Server Error | Something went wrong internally. Please consult server logs for further details. |

------------------------------------------------


<a name="metadata"></a>
## **/metadata**


### Заявка

Не са нужни параметри.

Example:
```bash
curl 'https://localhost:8889/metadata'
```

### Отговор

В случай на **успешен отговор**, HTTP статус код 200 и XML метаданни се връщат.

Пример:
```xml
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" ID="_dst76fjthbqaxisvsrros6nytpf9m4sz8daw0ch" entityID="https://localhost:8081/metadata" validUntil="2018-03-13: 40:21.927Z">
	<ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
		<ds:SignedInfo>
			<ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
			<ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha512"/>
			<ds:Reference URI="#_dst76fjthbqaxisvsrros6nytpf9m4sz8daw0ch">
				<ds:Transforms>
					<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
					<ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
				</ds:Transforms>
				<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha512"/>
				<ds:DigestValue>
aX3WTeCMC37Y/qutWVGmwSGFzjjx7+dpoYfvg7RGlkmfGJTSzohUpsZXoHB9W6nKcZoL5MhcscfG Ku4F2ZovIw==
				</ds:DigestValue>
			</ds:Reference>
		</ds:SignedInfo>
		<ds:SignatureValue>
L+5MkF5MyiYZAUl6mCOBdl+d87mLp0m1AaTS/9SLP72K4XZh00iFKh5FMyC+iUiP2nZAgKFWVeNE myR+rl+JejTm3EzdrVbKhRVSEcl+dTpBEZ6APLQZMwe/8KmaRR7L
		</ds:SignatureValue>
		<ds:KeyInfo>
			<ds:X509Data>
				<ds:X509Certificate>
MIIB4jCCAWagAwIBAgIEW1u+vzAMBggqhkjOPQQDAgUAMEcxCzAJBgNVBAYTAkVFMQ0wCwYDVQQK EwR0ZXN0MQ0wCwYDVQQLEwR0ZXN0MRowGAYDVQQDExFTUC1tZXRhZGEtc2lnbmluZzAeFw0xODAzMDkxNjE1NTRaME cxCzAJBgNVBAYTAkVFMQ0wCwYDVQQKEwR0ZXN0MQ0w CwYDVQQLEwR0ZXN0MRowGAYDVQQDExFTUC1tZXRhZGEtc2lnbmluZzB2MBAGByqGSM49AgEGBSuB BAAiA2IABGj1C5gvuR8ZG7Q5b5KSYFV3QzDwo+2aewjBm+SKIotc+5HBUGelflK Jn7fKJQfVGwEc I+oVvXcIs0XyV4qQIHT3ylh4SlZg9AUUSZeF2ktLTEHApJ8wHpt89WF+oKqFu6MhMB8wHQYDVR0O BBYEFPd/0ir9wkxXsq1gHdz6CkcSOfQMMAwGCCqGSM49BAMCBQADaAAwZQIxAKab7Kc2NMLyFyMr tGWb HKKq28b5yJoy2//vqjZrVFuRUflYfQnom5Na9za3VYptUQIwPZF083qWwyJNAIK0Qc1c2Lir d0CVMSovoZUCvLmNNWwBUjqTdqIY/3PDO6PRGloT
				</ds:X509Certificate>
			</ds:X509Data>
		</ds:KeyInfo>
	</ds:Signature>
	<md:Extensions xmlns:alg="urn:oasis:names:tc:SAML:metadata:algsupport">
		<alg:SigningMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha512"/>
	</md:Extensions>
	<md:SPSSODescriptor AuthnRequestsSigned="true" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
		<md:KeyDescriptor use="signing">
			<ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
				<ds:X509Data>
					<ds:X509Certificate>
MIIB7zCCAXKgAwIBAgIEFWvpjzAMBggqhkjOPQQDAgUAME0xCzAJBgNVBAYTAkVFMQ0wCwYDVQQK EwR0ZXN0MQ0wCwYDVQQLEwR0ZXN0MSAwHgYDVQQDExdTUC1hdXRoLXJlcXVlc3Qtc2lnbmluZzAe Fw0xODAzMDkxNjE1NTVaFw0yMDAzMD gxNjE1NTVaME0xCzAJBgNVBAYTAkVFMQ0wCwYDVQQKEwR0 ZXN0MQ0wCwYDVQQLEwR0ZXN0MSAwHgYDVQQDExdTUC1hdXRoLXJlcXVlc3Qtc2lnbmluZzB2MBAG ByqGSM49AgEGBSuBBAAiA2IABNqM3bEf8xJl3dvpeqM5rF+pJxAw9 ao3hFK2D40j8FMmtkTxUt4b f/WQrg0DhW+Qudkdd8nGpzKieF7hIQ1I9WVWW71alaxwcVggR2iD0SpMcnbvjfQ1/zRu16Yw6TjS IaMhMB8wHQYDVR0OBBYEFMeaE0rtTLhOrnBjb/2sDPuuEw+dMAwGCCqGSM49BAMCBQADaQAwZ gIx AIW7dSy696VgJkRWYMC3tpqViQGGSXF10qbpXycCSbf5HTvG02OfO/y/lSUduUwsywIxAJEEQZAp JSyRx3O3cmsKqPS/I4lY6pmOfdBCoJK8RRIqHIIIlfvEvoX7koO4wLbgwg==
					</ds:X509Certificate>
				</ds:X509Data>
			</ds:KeyInfo>
		</md:KeyDescriptor>
		<md:KeyDescriptor use="encryption">
			<ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
				<ds:X509Data>
					<ds:X509Certificate>
MIIFNzCCAx+gAwIBAgIEfHFvpTANBgkqhkiG9w0BAQsFADBMMQswCQYDVQQGEwJFRTENMAsGA1UE ChMEdGVzdDENMAsGA1UECxMEdGVzdDEfMB0GA1UEAxMWU1AtcmVzcG9uc2UtZW5jcnlwdGlvbjAe Fw0xODAzMDkxNjE1NTdaFw0yMDAzMDgxNj E1NTdaMEwxCzAJBgNVBAYTAkVFMQ0wCwYDVQQKEwR0 ZXN0MQ0wCwYDVQQLEwR0ZXN0MR8wHQYDVQQDExZTUC1yZXNwb25zZS1lbmNyeXB0aW9uMIICIjAN BgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAiWMUi8QBhP9w5rt32ICTxwDPorbfcqioP 4UDmGQf iZjf4+/bzYMO0l6qwJHb1//McQ2KKEgcVGGZgJia9yFjjPSjJlmAKP26aPjTXmmshNGsZG7ErDK4 +Y9B2TXZnDIDbKPLliT4KlCTUbC9YSeWC1/6Z05fn1ggWORBoSmi1vndzfZ7yPHxA0TvvFC6vEGx cnuOh8diF5i YzaWV3MTrxwSFJ2uBKkBOpDStPwZNRS/hEcFPEoRzRU5dPET+YkNkZcQmofzYI9zK t6XDx0dzCWLwBsSNeAwK5Yn84zYNPqFzGE2fCubL7X7eUVaVaXGqU49hJEVKPCNsigQwennuq/GC xt/HtIe9XI4Z+ScbFBvL2CVSUk +562f6jTOBjrJJbrjafWpk51xDFydGWyvYxpKJgmynT0sfyK5r TyK2g1CAkKwLgdxgBi/aoB21DZCdhvmntHjV+DFjaq5TEU9xQCAH2GkUdv8mbzmFUb+vvM7RtUVQoskMxEM43Y+GoHPgcp2+lDJQ9rTV3INIFwE+XeP3HdnDpKrzeQqmPy1raIUJSpSQ6nG+K6bCbZrL I9wUCVgH6BJ1euD1mOjir4P6yP9+j7j6RCItM9weXPNEeG/ENZFZ9fBKJ+jNdqJW03zuOQWdYPlp YHtOKk 46L9JruEF5jMbqXjxfmUuFCSlwPF8CAwEAAaMhMB8wHQYDVR0OBBYEFFJ47K8Dr0b/eIQI HsL6IPs5RJspMA0GCSqGSIb3DQEBCwUAA4ICAQBm1dmD7P3xJ3QBm9evVEAfPpGxp8b+elcceKHP NiWon73SH560cNXq9xgHeF9t 4Ta35rptONSg/trxBew5y31MxaE/XRKT7CJcTa/1JKqapCgFS9NA L2O6+uiPJW+9xCEYD0x5xJ1Sq1njwCoGlfyFfh4NABbPmtDHrVHJzjaEHMw5YYHAREYPSLf0GHkS qCZ020qg3QJS0FYk+xOCKM63xDeGFSe+Qeo/bYhowbD 65gdXjvNtMumfis7E4375dIUGrpdovm6D IPYb1h/PcoPC3gOaTaC3SnXx/FiSGWgnuRvJfifTCepsdIrojbWUh/2ffTBcTNOlXVC8Azxdud3s 7DaKun6XI3Q6DaQqlc13d4uuqbZG51uCb0GCTt36ATJ3vDs6G0NrKgRaKmp5CJKA g75jOtq7UT Sg4ItvGvz9V8eMwZBJdqc6KaHcjlq6NCX5NFOHwBKvCsEi6e575w +UsUKliB6FepZ3VdIlC6Iq+X CYs/CwXLb8nZa6k3ZLoW6/K8eukv+5nYGyI3Ubf7Wi2E624hckG2DVBRPXHaWpODgYr5hIQt1FHEwrbTPHQn5yamuAWBhIEMeDgCMlYimW5DpCjm4ncstpTn+u2y6Oy9G6vzIRzI7OsneXEWUYSQAHei pZSiFLgSx7k5bj/6ocA0CxRzhCghhAvAbrqOfQ==
					</ds:X509Certificate>
				</ds:X509Data>
			</ds:KeyInfo>
		</md:KeyDescriptor>
		<md:NameIDFormat>
urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified
		</md:NameIDFormat>
		<md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://localhost:8081/returnUrl" index="0"/>
	</md:SPSSODescriptor>
</md:EntityDescriptor>
```

**При грешка**, отговора се форматира спрямо [**error handling**](Service-API_BG.md#error handling). Възможните стойности са в таблицата по долу:

| HTTP стаутс код | Кратко описание | Текст описващ грешката |
| :-------------: |:-------------| :-----|
| 405 | Method Not Allowed | Request method [...] not supported |
| 500 | Internal Server Error | Something went wrong internally. Please consult server logs for further details. |

--------------------------------------------------

<a name="supportedCountries"></a>
## **/supportedCountries**


### Заявка

Няма параметри.

Example:
```bash
curl 'https://localhost:8889/supportedCountries'
```

### Отговор

При **правилен отговор** ще се върне HTTP статус код 200 и списък на поддържаните страни за частен и публичен сектор.

Пример:
```json
{
  "public": ["EE","BG","CA"],
  "private": ["BG"]
}
```

**при грешка**, отговора е форматиран спрямо [**error handling**](Service-API_BG.md#error handling). Възможните стойности са в таблицата по долу:

| HTTP статус код | Кратко описание | Текст описващ грешката |
| :-------------: |:-------------| :-----|
| 405 | Method Not Allowed | Request method [...] not supported |
| 500 | Internal Server Error | Something went wrong internally. Please consult server logs for further details. |

--------------------------------------------------


<a name="heartbeat"></a>
## **/heartbeat**

Статуса на приложението може да бъде проверен чрез Spring Boot Actuator **/heartbeat** или **/hearbeat.json**. Ако е нужно, могат да се пуснат и други Spring Boot Actuator идникатори чрез `management.health.defaults.enabled=true` (виж <a href="https://docs.spring.io/spring-boot/docs/ current/reference/html/application-properties.html">Common Application Properties</a> или използване на `health` чрез `management.endpoints.web.exposure.include=health,hazelcast`

### Заявка

Без параметри.

Example:
```bash
curl 'https://localhost:8889/heartbeat'
```

### Отговор

| Атрибут | Задължителен | Описание |
| ------------- |:-------------:| :-----|
| **status** | Да | Параметър, който показва статуса на приложението. Възможни стойности: `UP`, `DOWN` |
| **name** | Да | Име на приложението. |
| **version** | Да | Версия на приложението. |
| **buildTime** | Да | Дата на компилиране на приложението в UNIX timestamp. |
| **startTime** | Да | Кога е пуснато приложението в UNIX timestamp. |
| **currentTime** | Да | Кога е направена заявката в UNIX timestamp. |
| **dependencies** | Да | Списък на външните системи, нужни за работа на приложението. За достъпните системи, `UP` се подава като `status`, а `DOWN` за системи които не са. Ако една от системите, на които разчита приложението е `DOWN`, цялостния `status` на отговора е `DOWN`. |
| **dependencies.status** | Да | Статус на външна система. Възможни стойности: `UP`, `DOWN` |
| **dependencies.name** | Да | Кратко име на системата. Пример: `eIDAS-Node`, `hazelcast`, `credentials`. |

Примерна структура на отговора:
```json
{
    "status": "UP",
    "name": "eidas-client-webapp",
    "version": "1.0.0-SNAPSHOT",
    "buildTime": 1528117155,
    "startTime": 1528121189,
    "currentTime": 1528121277,
    "dependencies": [
        {
            "status": "UP",
            "name": "eIDAS-Node"
        },
        {
            "status": "UP",
            "name": "hazelcast"
        },
        {
            "status": "UP",
            "name": "credentials"
        }
    ]
}
```

**При работещо приложение** HTTP статус код 200 се връща заедно с JSON отговор в който `$.status` е `UP`.

Пример 1: Успешен отговор
```bash
curl http://localhost:8889/heartbeat.json
  % Total % Received % Xferd Average Speed ​​Time Time Time Current
                                 Dload Upload Total Spent Left Speed
100 195 0 195 0 0 112 0 --:--:-- 0:00:01 --:--:-- 112{"status":"UP","name":"eidas-client-webapp" ,"version":"1.0.0-SNAPSHOT","buildTime":1528829409,"startTime":1528877695,"currentTime":1528877733,"dependencies":[{"status":"UP","name":" eIDAS-Node"},{"status":"UP","name":"hazelcast"},{"status":"UP","name":"credentials"}]}
```

**При неработоспособно приложение** (на пример, липсва външна система), HTTP статус код 200  се връща заедно с JSON отговор в който `$.status` е `DOWN`.


Пример 2: Неработоспособно приложение
```bash
$ curl http://localhost:8889/heartbeat.json
  % Total % Received % Xferd Average Speed ​​Time Time Time Current
                                 Dload Upload Total Spent Left Speed
100 199 0 199 0 0 98 0 --:--:-- 0:00:02 --:--:-- 98{"status":"DOWN","name":"eidas-client-webapp" ,"version":"1.0.0-SNAPSHOT","buildTime":1528829409,"startTime":1528877695,"currentTime":1528877831,"dependencies":[{"status":"DOWN","name":" eIDAS-Node"},{"status":"UP","name":"hazelcast"},{"status":"UP","name":"credentials"}]}
```


<a name="hazelcast"></a>
## **/hazelcast**


Ако е конфигуриран Hazelcast, неговия саттус и [информация за хеш таблиците](https://docs.hazelcast.org/docs/3.11/manual/html-single/index.html#map-statistics) се визуализират от Spring Boot Actuator чрез **/hazelcast** или **/hazelcast.json**.

Тази провекра е спряна по подразбиране.

### Заявка

Няма параметри.

Example:
```bash
curl 'https://localhost:8889/hazelcast'
```

### Отговор

| Име на атрибута | Задължителен | Описание |
| ------------- |:-------------:| :-----|
| **clusterState** | Да | Статус на клъстера. `ACTIVE` ако е готов да облсужва заявки. Възможни стойности спрямо [API документацията](https://docs.hazelcast.org/docs/3.11/manual/html-single/index.html#managing-cluster-and-member-states) |
| **clusterSize** | Да | Брой членове на клъстера. |
| **maps** | Да | Масив от генерираните хеш таблици. |
| **maps[].mapName** | Да | Име на хеш таблица. |
| **maps[].creationTime** | Да | Дата на създаване на хеш таблицата в UNIX timestamp. |
| **maps[].ownedEntryCount** | Да | Брой записи в локалната инстанция. |
| **maps[].backupEntryCount** | Да | Брой на бекъп записите в локалната инстанция. |
| **maps[].backupCount** | Да | Брой бекъпи в секунда. |
| **maps[].hitsCount** | Да | Броя на операциите за чете към локалната инстанция. |
| **maps[].lastUpdateTime** | Да | Последното време за обновен запис в локалната инстанция. |
| **maps[].lastAccessTime** | Да | Послендото време за прочетен запис от локалната инстанция. |
| **maps[].lockedEntryCount** | Да | Брой заключени записи в локалната инстанция. |
| **maps[].dirtyEntryCount** | Да | Брой на записи с неприложени промени. |
| **maps[].totalGetLatency** | Да | Максимално време за GET операция. |
| **maps[].totalPutLatency** | Да | Максимално време за PUT операция. |
| **maps[].totalRemoveLatency** | Да | Максимално време за премахване на запис. |
| **maps[].heapCost** | Да | Размер на съгранените данни в байтове. |

Примерна структура на отговор:
```json
{
   "clusterState":"ACTIVE",
   "clusterSize": 3,
   "maps":[
      {
         "mapName":"unansweredRequestsMap",
         "currentCapacity":0,
         "creationTime":1541962062911,
         "ownedEntryCount":0,
         "backupEntryCount":0,
         "backupCount":0,
         "hitsCount":0,
         "lastUpdateTime":0,
         "lastAccessTime":0,
         "lockedEntryCount":0,
         "dirtyEntryCount":0,
         "totalGetLatency":0,
         "totalPutLatency":0,
         "totalRemoveLatency: ":0,
         "heapCost": 0
      }
   ]
}
```

При **включен Hazelcast**, HTTP статус код 200 и JSON отговор се връщат:

Пример:
```bash
curl http://localhost:8889/hazelcast.json
  % Total % Received % Xferd Average Speed ​​Time Time Time Current
                                 Dload Upload Total Spent Left Speed
100 381 0 381 0 0 8106 0 --:--:-- --:--:-- --:--:-- 8106{"clusterState":"ACTIVE","clusterSize":1,"maps ":[{"mapName":"unansweredRequestsMap","currentCapacity":0,"creationTime":1541962062911,"ownedEntryCount":0,"backupEntryCount":0,"backupCount":0,"hitsCount":0,"lastUpdateTime ":0,"lastAccessTime":0,"lockedEntryCount":0,"dirtyEntryCount":0,"totalGetLatency":0,"totalPutLatency":0,"totalRemoveLatency: ":0,"heapCost":0}]}
```


<a name="error handling"></a>
## **Управление на грешките**

### HTTP статус код

HTTP статус кодовете се определят спрямо [RFC2616](https://tools.ietf.org/html/rfc2616) стандарта.

На пример, стаутс кодове в диапазона 400 показват грешки в заявката на клиента (като липсващи или невалидни параметри), а статус кодове от 500 показват проблем в сървъра (претоварване).

### HTTP тяло на отговора

Описанието на грешката се връща, като JSON обект.

Име на атрибута | Задължително | Описание | Тип
------------ | ------------- | ------------- | -------------
**error** | Да | Кратко описание на грешката. | **Низ**
**message** | Да | Текст описващ проблема. | **Низ**

Пример:
```json
{
   "error": "Bad Request",
   "message" : "Required request parameter 'Country' for method parameter type String is not present"
}
```
