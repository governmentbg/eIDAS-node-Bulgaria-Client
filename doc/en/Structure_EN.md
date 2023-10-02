
## Structure of the service
-----------

Eidas client web service is packaged as a war file.

## Components


### eIDAS-client library

The Eidas client service layer relies on the [OpenSAML 3](https://wiki.shibboleth.net/confluence/display/OS30/Home) and [Spring Boot](https://projects.spring.io/spring-boot/) base libraries.

### Configuration

Application configuration is done through a central configuration file.

### Logging in

Logging is performed through SLF4J using the Log4j2 framework. Therefore, it is possible to configure logging through a standard Log4j2 configuration file. By default, events occurring in the `bg.is-bg.eidas.client` package are logged at the INFO level and everything else at the WARN level, and all logs are directed to the system console. Additional output channels can be configured if necessary.

## Interfaces offered

The list of endpoints required to initiate a cross-border personal identification request and the return response is given in Table 1. A more detailed description of the endpoints is given in the "Interface specification" section.

| End point | Supported Methods | Explanation |
| ------------- | :------: | :------------|
| `/login` | MAIL | When using the POST method, the personal identification process is initiated against the eIDAS hub of the selected country. |
| `/returnUrl` | MAIL | Reception of the result of personal identification. Display personal data or error according to parameters. |
| `/metadata` | GET | SAML 2.0 standard metadata endpoint. Necessary to create trust between the eIDAS connector service and the client. |
Table 1.

## Required interfaces

To function, the eIDAS client needs the eIDAS connector service and generated keys with settings.

| Component | Explanation |
| ------------- | :----- |
| ``EIDAS connector service metadata'' | The eIDAS client needs access to the SAML 2.0 metadata endpoint of the eIDAS connector service |
| ``EIDAS connector service authentication service'' | The endpoint of the eIDAS connector service identification request reception (referred to as ``SingleSignOnService'' in the eIDAS connector service metadata response) |
| `Key storage' | The keys required for signing SAML responses are stored in key stores (pkcs12, jks). |
| `Configuration` | Service management and configuration is done through a central configuration file. |
Table 2.