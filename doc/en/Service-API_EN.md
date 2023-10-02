# Interface specification
-----------

## **Endpoints**

All requests and responses are presented in UTF-8 encoding.
Use of HTTPS is mandatory. It is recommended to use bi-directional HTTPS.

The use of `X-Request-ID' and `X-Correlation-ID' headers is recommended. When using headers, the values ​​of the corresponding headers are logged in the log entries as `requestId` and `sessionId` values, which greatly simplifies the association of log events between different parts of the system.

Method | HTTP Request | Description
------------- | ------------- | -------------
[**login**](Service-API_EN.md#login) | **GET** /login | Constructs and returns the request required to initiate the cross-border identity process with an HTML redirect form.
[**returnUrl**](Service-API_EN.md#returnUrl) | **POST** /returnUrl | Cross-border personal identification result check. SAML response validation according to [SAML 2 Web SSO Profile](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf) and Connector Service Specification. Return of personal data upon successful completion of checks.
[**metadata**](Service-API_EN.md#metadata) | **GET** /metadata | Returned by the eIDAS client service SAML metadata.
[**supportedCountries**](Service-API_EN.md#supportedCountries) | **GET** /supportedCountries | The eIDAS client returns countries supported by the service.
[**heartbeat**](Service-API_EN.md#heartbeat) | **GET** /heartbeat or /heartbeat.json | Returns information about the eIDAS client service version and status.
[**hazelcast**](Service-API_EN.md#hazelcast) | **GET** /hazelcast or /hazelcast.json | Returns information about the Hazelcast cluster instance running in the eIDAS client service. **Disabled by default**.


<a name="login"></a>
## **login**


### Query

Parameters:

| Parameter name | Mandatory | Explanation |
| ------------- |:-------------:| :-----|
| **Country** | Yes | The parameter specifies the country of the citizen to be identified ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code). |
| **RequesterID** | Yes | Unique identifier of the information system |
| **SPType** | Yes | Determines whether it is a public sector (`public`) or private sector (`private`) client. |
| **LoA** | No | The parameter, defines the required level of eIDAS personal identification. One of the following values: `LOW`, `SUBSTANTIAL`, `HIGH`. If the parameter is undefined, the default value is `SUBSTANTIAL`. |
| **RelayState** | No | A parameter that is passed to the connector service unchanged. The value must match the regular expression `[a-zA-Z0-9-_]{0,80}`. |
| **Attributes** | No | The parameter contains a space-separated list of eIDAS attributes (in the form of *FriendlyName*) that are requested from the eIDAS identity service of the target country in the authentication request. Represent spaces using URL encoding ([RFC 3986](https://www.ietf.org/rfc/rfc3986.txt)). Allowed eIDAS attributes: `FamilyName`, `FirstName`, `DateOfBirth`, `PersonIdentifier`, `BirthName`, `PlaceOfBirth`,`CurrentAddress`,`Gender`, `LegalPersonIdentifier`, `LegalName`, `LegalAddress`, `VATRegistration `, `TaxReference`, `LEI`, `EORI`, `SEED`, `SIC`, `D-2012-17-EUIdentifier` (see also attribute descriptions in [eIDAS Attribute Profile](https://ec.europa. eu/cefdigital/wiki/download/attachments/46992719/eIDAS%20SAML%20Attribute%20Profile%20v1.1_2.pdf?version=1&modificationDate=1497252920100&api=v2)). If the parameter is undefined,

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


### Answer

On a **successful response**, an HTTP status code of 200 is returned along with the SAML request and HTML redirect form required to redirect to the destination country.

| Attribute Name | Mandatory | Explanation |
| ------------- |:-------------:| :-----|
| **country** | Yes | The parameter specifies the country of the identified citizen. The value must correspond to that given in the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) standard. |
| **SAMLRequest** | Yes | SAML `AuthnRequest` request according to the Connector service specification. |
| **RelayState** | No | A parameter that is passed to the connector service unchanged. The value must match the regular expression `[a-zA-Z0-9-_]{0,80}`. |

Example:
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

**In case of an error**, the response is formed according to the [**error handling**](Service-API_EN.md#error handling) chapter. Possible error situations are given in the following table:

| HTTP Status Code | Brief description of the error | Text explaining the error |
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
## **returnUrl**

### Query

| Headers |
| :------------------------- |
| `Content-Type: application/x-www-form-urlencoded` |

| The parameter | Mandatory | Explanation |
| ------------- |:-------------:| :-----|
| **SAMLResponse** | Yes | The SAML response (Base64 encoded) from the cross-border authentication channel. |

Example:

```bash
curl -X POST \
  https://localhost:8889/returnUrl \
  -H 'content-type: application/x-www-form-urlencoded' \
  -d 'SAMLResponse=..........................'
```

### Answer

**HTTP 200** is returned with personal information if **authentication is successful** (see Table 1).

Attribute Name | Mandatory | Explanation | Type
------------ | ------------- | ------------- | -------------
**levelOfAssurance** | Yes | NONE authentication level. Possible values: `http://eidas.europa.eu/LoA/low`, `http://eidas.europa.eu/LoA/substantial`, `http://eidas.europa.eu/LoA/high` | **String**
**attributes** | Yes | Contains attributes with authenticated person data. Attributes are presented as key-value pairs, where the key is `FriendlyName` and the value `AttributeValue` element content according to the eIDAS SAML Attribute Profile document. <p>**Mandatory attributes** - contain data that member states are required to return.</p><p> 1. Four attributes are always returned by default for a natural person: `FirstName`, `FamilyName`, `PersonIdentifier` and ` DateOfBirth`.</p><p>2. For a legal entity, `LegalPersonIdentifier`, `LegalName` values ​​are always returned **only if** this is requested in the request.</p><p>**Optional additional attributes** - In addition, it is possible to request EIDAS additional attributes, `RepresentativeLegalName`, `RepresentativeLegalAddress`, `RepresentativeLegalPersonIdentifier`, `RepresentativeSEED`, `RepresentativeSIC`,`RepresentativeTaxReference`, `RepresentativeVATRegistration`</p> | **Object**
**attributes.FirstName** | Yes | Person's first name. | **String**
**attributes.FamilyName** | Yes | The person's last name. | **String**
**attributes.PersonIdentifier** | Yes | Unique code identifying the person. <br><br>Submitted in the format XX+ “/“ + YY + “/“ + ZZZZZZ..., where XX is the country code of the identified person (ISO 3166-1 alpha-2), YY is the country code (ISO 3166-1 alpha-2) whose person is to be authenticated, and ZZZZZZ... is the code identifying the person of the destination country (the exact format depends on the destination country). | **String**
**attributes.DateOfBirth** | Yes | Date of birth in the format: YYYY + “-“ + MM + “-“ + DD (where YYYY is the year, MM is the month and DD is the day) | **String**
**attributes.LegalPersonIdentifier** | No | Legal entity code. It will be returned only if the user wishes to do so. | **String**
**attributes.LegalName** | No | Name of the legal entity. It will be returned only if the user wishes to do so. | **String**
**attributesTransliterated** | No | Contains attribute values ​​in transliterated form. Attributes are represented as key-value pairs, where the key is `FriendlyName` and the value is the transliterated content of the `AttributeValue` element according to the eIDAS SAML Attribute Profile document. | **Object**
Table 1.

Example:
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

In case of **unsuccessful authentication**, **HTTP 401** and [**error description**](Service-API_EN.md#error description) are returned as described in the chapter. Possible authentication failure situations are listed in the following table:

| HTTP Status Code | Brief description of the error | Text explaining the error |
| :-------------: |:-------------| :-----|
| 401 | Unauthorized | Authentication files |
| 401 | Unauthorized | No user consent received. User denied access. |

In case of **other errors**, the response is formed according to the [**error handling**](Service-API_EN.md#error handling) chapter. Possible error situations are given in the following table:

| HTTP Status Code | Brief description of the error | Text explaining the error |
| :-------------: |:-------------| :-----|
| 400 | Bad request | Required request parameter 'SAMLResponse' for method parameter type String is not present |
| 400 | Bad request | Invalid SAMLResponse. [...] |
| 403 | Forbidden | Endpoint not allowed to be accessed via port number [...] |
| 405 | Method Not Allowed | Request method [...] not supported |
| 500 | Internal Server Error | Something went wrong internally. Please consult server logs for further details. |

------------------------------------------------


<a name="metadata"></a>
## **metadata**


### Query

There are no parameters.

Example:
```bash
curl 'https://localhost:8889/metadata'
```

### Answer

In the case of a **successful response**, HTTP status code 200 and XML metadata are returned.

Example:
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

**In case of an error**, the response is formed according to the [**error handling**](Service-API_EN.md#error handling) chapter. Possible error situations are given in the following table:

| HTTP Status Code | Brief description of the error | Text explaining the error |
| :-------------: |:-------------| :-----|
| 405 | Method Not Allowed | Request method [...] not supported |
| 500 | Internal Server Error | Something went wrong internally. Please consult server logs for further details. |

--------------------------------------------------

<a name="supportedCountries"></a>
## **supportedCountries**


### Query

There are no parameters.

Example:
```bash
curl 'https://localhost:8889/supportedCountries'
```

### Answer

A **successful response** will return an HTTP status code of 200 and supported countries for both public and private sectors.

Example:
```json
{
  "public": ["EE","DE","CA"],
  "private": ["DE"]
}
```

**In case of an error**, the response is formed according to the [**error handling**](Service-API_EN.md#error handling) chapter. Possible error situations are given in the following table:

| HTTP Status Code | Brief description of the error | Text explaining the error |
| :-------------: |:-------------| :-----|
| 405 | Method Not Allowed | Request method [...] not supported |
| 500 | Internal Server Error | Something went wrong internally. Please consult server logs for further details. |

--------------------------------------------------


<a name="heartbeat"></a>
## **heartbeat**

Application health status can be obtained via the Spring Boot Actuator endpoint **/heartbeat** or **/heartbeat.json**. If desired, it is also possible to enable other Spring Boot Actuator indicators by setting `management.health.defaults.enabled=true` (see <a href="https://docs.spring.io/spring-boot/docs/ current/reference/html/application-properties.html">Common Application Properties</a>) or use the actuator instead of the `heartbeat` endpoint to give the endpoint `health` by setting `management.endpoints.web.exposure.include=health,hazelcast`

### Query

There are no parameters.

Example:
```bash
curl 'https://localhost:8889/heartbeat'
```

### Answer

| Attribute Name | Mandatory | Explanation |
| ------------- |:-------------:| :-----|
| **status** | Yes | A parameter that indicates the operational state of the application. . Possible values: `UP`, `DOWN` |
| **name** | Yes | Application name. |
| **version** | Yes | Application version. |
| **buildTime** | Yes | Application build time. in Unix timestamp format. |
| **startTime** | Yes | Application launch time. in Unix timestamp format. |
| **currentTime** | Yes | The time the request was made. in Unix timestamp format. |
| **dependencies** | Yes | Contains a list of external systems that the application depends on. For external systems that can be contacted, `UP' is displayed as `status', and `DOWN' for systems that are not. If any external system that the application depends on is `DOWN`, the overall `status` of the response is also `DOWN`. |
| **dependencies.status** | Yes | External system status. Possible values: `UP`, `DOWN` |
| **dependencies.name** | Yes | Short name of the external system (for example: `eIDAS-Node`, `hazelcast`, `credentials`). |

Example of a response structure:
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

**In the case of a working application** HTTP status code 200 is returned and a JSON response in which `$.status` value is `UP`

Example 1: A successful response
```bash
curl http://localhost:8889/heartbeat.json
  % Total % Received % Xferd Average Speed ​​Time Time Time Current
                                 Dload Upload Total Spent Left Speed
100 195 0 195 0 0 112 0 --:--:-- 0:00:01 --:--:-- 112{"status":"UP","name":"eidas-client-webapp" ,"version":"1.0.0-SNAPSHOT","buildTime":1528829409,"startTime":1528877695,"currentTime":1528877733,"dependencies":[{"status":"UP","name":" eIDAS-Node"},{"status":"UP","name":"hazelcast"},{"status":"UP","name":"credentials"}]}
```

**In the case of a non-working application** (for example, if a dependency required for operation is not available), the HTTP status code 200 and a JSON response with the `$.status` value as `DOWN` are returned


Example 2: A working dependency is not available
```bash
$ curl http://localhost:8889/heartbeat.json
  % Total % Received % Xferd Average Speed ​​Time Time Time Current
                                 Dload Upload Total Spent Left Speed
100 199 0 199 0 0 98 0 --:--:-- 0:00:02 --:--:-- 98{"status":"DOWN","name":"eidas-client-webapp" ,"version":"1.0.0-SNAPSHOT","buildTime":1528829409,"startTime":1528877695,"currentTime":1528877831,"dependencies":[{"status":"DOWN","name":" eIDAS-Node"},{"status":"UP","name":"hazelcast"},{"status":"UP","name":"credentials"}]}
```


<a name="hazelcast"></a>
## **hazelcast**

If the application has Hazelcast configured, its status and hash tables [metainfo](https://docs.hazelcast.org/docs/3.11/manual/html-single/index.html#map-statistics) are displayed to the Spring Boot Actuator endpoint via **/hazelcast** or **/hazelcast.json**.

NB! endpoint is disabled by default.


### Query

There are no parameters.

Example:
```bash
curl 'https://localhost:8889/hazelcast'
```

### Answer

| Attribute Name | Mandatory | Explanation |
| ------------- |:-------------:| :-----|
| **clusterState** | Yes | Cluster status. `ACTIVE` if the cluster is operational and ready to serve requests. Possible values ​​according to [API documentation](https://docs.hazelcast.org/docs/3.11/manual/html-single/index.html#managing-cluster-and-member-states) |
| **clusterSize** | Yes | The number of members that have joined the cluster. |
| **maps** | Yes | An array of cluster generated hash tables. |
| **maps[].mapName** | Yes | The name of the specific hash table. |
| **maps[].creationTime** | Yes | Hashtable creation time. in Unix timestamp format. |
| **maps[].ownedEntryCount** | Yes | The number of records in the local instance. |
| **maps[].backupEntryCount** | Yes | The number of backup records in the local instance. |
| **maps[].backupCount** | Yes | Number of backups per record. |
| **maps[].hitsCount** | Yes | A counter of read operations for the local instance. |
| **maps[].lastUpdateTime** | Yes | The last record update time in the local instance. |
| **maps[].lastAccessTime** | Yes | The last time a record was read in the local instance. |
| **maps[].lockedEntryCount** | Yes | The number of locked records in the local instance. |
| **maps[].dirtyEntryCount** | Yes | Number of records with unapplied updates. |
| **maps[].totalGetLatency** | Yes | Maximum latency for GET operations. |
| **maps[].totalPutLatency** | Yes | Maximum latency for PUT operations. |
| **maps[].totalRemoveLatency** | Yes | Maximum license time for deleting records. |
| **maps[].heapCost** | Yes | Amount of stored data in bytes. |

Example of a response structure:
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

With **Hazelcast enabled**, HTTP status code 200 and JSON response are returned:

Example:
```bash
curl http://localhost:8889/hazelcast.json
  % Total % Received % Xferd Average Speed ​​Time Time Time Current
                                 Dload Upload Total Spent Left Speed
100 381 0 381 0 0 8106 0 --:--:-- --:--:-- --:--:-- 8106{"clusterState":"ACTIVE","clusterSize":1,"maps ":[{"mapName":"unansweredRequestsMap","currentCapacity":0,"creationTime":1541962062911,"ownedEntryCount":0,"backupEntryCount":0,"backupCount":0,"hitsCount":0,"lastUpdateTime ":0,"lastAccessTime":0,"lockedEntryCount":0,"dirtyEntryCount":0,"totalGetLatency":0,"totalPutLatency":0,"totalRemoveLatency: ":0,"heapCost":0}]}
```


<a name="error handling"></a>
## **Error Handling**

### HTTP status code

HTTP status codes are handled according to [RFC2616](https://tools.ietf.org/html/rfc2616) standard.


For example, codes in the 400 range indicate non-compliance of the client request (such as missing or invalid parameters), and status codes from 500 indicate server-side problems (such as overload).

### HTTP response body

The error description is returned as a JSON object.

Attribute Name | Mandatory | Explanation | Type
------------ | ------------- | ------------- | -------------
**error** | Yes | Brief description of the error. | **String**
**message** | Yes | Text explaining the error. | **String**

Example:
```json
{
   "error": "Bad Request",
   "message" : "Required request parameter 'Country' for method parameter type String is not present"
}
```
