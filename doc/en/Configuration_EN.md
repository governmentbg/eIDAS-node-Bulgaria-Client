# Integrator Guide

- [Integrator Guide](#integrator-guide)
  - [1. Installation prerequisites](#1-installation-prerequisites)
  - [2. eIDAS-Client configuration](#2-eidas-client-configuration)
    - [2.1. Configuration file](#21-configuration-file)
    - [2.2. Installation as a war file on the Tomcat application server](#22-installation-as-a-war-file-on-the-tomcat-application-server)
    - [2.3 Configuration parameters](#23-configuration-parameters)
  - [3. Test SAML key generation](#3-test-saml-key-generation)
  - [4. Logging in](#4-logging-in)
    - [4.1. Default logging configuration](#41-default-logging-configuration)
    - [4.2 Setting Default Configuration](#42-setting-default-configuration)
    - [4.3 Using the external log4j2.xml configuration file](#43-using-the-external-log4j2xml-configuration-file)
  - [5. Monitoring - Inquiring about the state of the application](#5-monitoring---inquiring-about-the-state-of-the-application)
  - [6. Hazelcast - multi-instance installation](#6-hazelcast---multi-instance-installation)
    - [6.1 Enabling Hazelcast](#61-enabling-hazelcast)
    - [6.2 Configuring Hazelcast](#62-configuring-hazelcast)
    - [6.3 Data security](#63-data-security)
    - [6.4 Monitoring and usage statistics](#64-monitoring-and-usage-statistics)

<a name="prerequisites"></a>
## 1. Installation prerequisites

To install the eIDAS-Client, the following is required as a minimum:
*JRE 11+
* Java application server (Tomcat 8.x or later recommended)


NB! In addition, access to the eIDAS Node application is also required


<a name="conf_all"></a>
## 2. eIDAS-Client configuration
--------------------

The configuration of the application works through the central Spring boot configuration file - `application.properties` - the location of which must be given to the application when it is started.

If the location of the configuration file is not specified or the file is not accessible, the default settings will be applied. It is possible to change the default setting by providing your own configuration zone file with the desired parameters at startup.

<a name="conf"></a>
### 2.1. Configuration file

The eIDAS-Client application needs a configuration file to work, which specifies the location of the SAML keys to be used, the client name and important URLs, which are necessary for forming and processing SAML requests. A detailed description of the configuration parameters is given in subsection [Configuration](#5.3-Configuration parameters))

The following is an example of the minimum configuration file required (with references to the keys generated in the previous point):

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
### 2.2. Installation as a war file on the Tomcat application server

1. Follow [**instructions**](../../README.md) and build the eIDAS-Client `war` file with the sample configuration file.
2. Install the war file on the application server. <br><br>NB! It is recommended to install eIDAS-Client as the only application in the application server (in the case of Tomcat as `ROOT` application)<br><br>
3. Provide the eIDAS-Client **configuration file location** to the application server. To do this, add a `setenv.sh` file to the `tomcat/bin` folder, in which the location of the Spring boot configuration file is referenced:
`export SPRING_CONFIG_ADDITIONAL_LOCATION=/etc/eidas-client/application.properties`



<a name="parameters"></a>
### 2.3 Configuration parameters

Table 2.3.1 - Service provider metadata setting

| The parameter | Mandatory | Description, Example |
| :---------------- | :---------- | :----------------|
| `eidas.client.hsm.enabled` | No | Hardware Security Module activation setting. Default `false` |
| `eidas.client.hsm.pin` | Yes<sup>1</sup> | Physical security module access password. |
| `eidas.client.hsm.library` | Yes <sup>1</sup> | Location of the interface physical security module driver. Sample value `/usr/lib/softhsm/libsofthsm2.so` when testing SoftHSM or HSM manufacturer specific library |
| `eidas.client.hsm.slot` | Yes <sup>1,2</sup> | Slot identifier of the physical security module. Example value `0` |
| `eidas.client.hsm.slot-list-index` | Yes <sup>1,2</sup> | The physical security module slot queue index. Example value `0` |
| `eidas.client.hsm.certificates-from-hsm` | No <sup>3</sup> | Indicates whether the certificates can be found on the physical security module in addition to the keys. Default `false` |
| `eidas.client.keystore` | Yes | Description of the location of the key store. Example: `classpath:samlKeystore.jks` if the file is read via classpath or `file:/etc/eidas-client/samlKeystore.jks` if read directly from the file system. The key storage must be JKS type. |
| `eidas.client.keystore-pass` | Yes | SAML keystore password. |
| `eidas.client.metadata-signing-key-id` | Yes <sup>5</sup> | SAML metadata signing key alias. |
| `eidas.client.metadata-signing-key-pass` | Yes<sup>4</sup> | The password for the SAML metadata signing key. |
| `eidas.client.metadata-signature-algorithm` | No | Metadata Signature Algorithm. Allowed values ​​respectively. Default `http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha512` |
| `eidas.client.response-decryption-key-id` | Yes <sup>5</sup> | An alias for the decryption key in the SAML authentication response. |
| `eidas.client.response-decryption-key-pass` | Yes <sup>4</sup> | The password for the decryption key in the SAML authentication response. |
| `eidas.client.sp-entity-id` | Yes | A URL that refers to the service provider's metadata. `/md:EntityDescriptor/@entityID` value in metadata. For example: https://hostname:8889/metadata |
| `eidas.client.callback-url` | Yes | A URL that references the service provider's SAML`/md:EntityDescriptor/md:SPSSODescriptor/md:AssertionConsumerService/@Location` value in the metadata. |

<sup>1</sup> Mandatory if `eidas.client.hsm.enabled=true`

<sup>2</sup> If `eidas.client.hsm.slot` is specified, `eidas.client.hsm.slot-list-index` value is ignored and its marking is not judicial.

<sup>3</sup> In case `eidas.client.hsm.certificates-from-hsm=false`, the certificates must be found by the same alias in the software keystore `eidas.client.keystore`

<sup>4</sup> If `eidas.client.hsm.enabled=true`, this setting is ignored.

<sup>5</sup> Applies to both software and hardware keystores.

Table 2.3.2 - Specific-Connector service metadata request setting

| The parameter | Mandatory | Description, Example |
| :---------------- | :---------- | :----------------|
| `eidas.client.idp-metadata-url` | Yes | url. Location of Specific-Connector service metadata. https://eidas-test.egov.bg/SpecificConnctor/ConnectorResponderMetadata |
| `eidas.client.idp-metadata-signing-certificate-key-id` | No | The alias of the certificate used to sign the Specific-Connector service metadata in the keystore. Default alias: `metadata`. |

Table 2.3.3 - Setting of sent AuthnRequest and SAML response

| The parameter | Mandatory | Description, Example |
| :---------------- | :---------- | :----------------|
| `eidas.client.provider-name` | Yes | Short name of the service provider. The value of `/saml2p:AuthnRequest/@ProviderName`. |
| `eidas.client.request-signing-key-id` | Yes <sup>2</sup> | Signing key alias for the SAML authentication request. |
| `eidas.client.request-signing-key-pass` | Yes <sup>1</sup> | The password for the SAML authentication request signing key. |
| `eidas.client.accepted-clock-skew` | No | Maximum acceptable time difference in seconds between IDP and SP systems. Default 2. |
| `eidas.client.maximum-authentication-lifetime` | No | Authentication request lifetime in seconds. Defaults to 900. |
| `eidas.client.response-message-lifetime` | No | SAML response lifetime in seconds. Defaults to 900. |
| `eidas.client.request-signature-algorithm` | No | Authentication request signature algorithm. Default `http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha512` |
| `eidas.client.available-countries` | No | Allowed country codes. |
| `eidas.client.default-loa` | No | EIDAS guarantee level if the user has not set the guarantee level himself. Allowed values: 'LOW', 'SUBSTANTIAL', 'HIGH'. Defaults to 'SUBSTANTIAL'. |
| `eidas.client.allowed-eidas-attributes` | No | A comma-separated list of allowed EidasAttribute values. The default value is a list of all possible EidasAttribute enum values. |

<sup>1</sup> If `eidas.client.hsm.enabled=true`, this setting is ignored.

<sup>2</sup> Applies to both software and hardware keystores.

Table 2.3.4 - security settings

| The parameter | Mandatory | Description, Example |
| :---------------- | :---------- | :----------------|
| `security.allowed-authentication-port` | No | If present, restricts access to authentication endpoints (`/login` and `/returnUrl`) only through the specified port, in which case `403 Forbidden` and [error description as JSON object](Service-API_EN.md#error presentation) are returned when accessing these endpoints through other ports. Allowed values: integer between 1 - 65535. |
| `security.disabled-http-methods` | No | A comma-separated list of HTTP methods. If present, restricts access to HTTP methods (HTTP 405 is returned if the listed method is used). If not specified, the list of HTTP methods disabled by default includes: HEAD, PUT, PATCH, DELETE, OPTIONS, TRACE. Allowed values: GET, POST, HEAD, PUT, PATCH, DELETE, OPTIONS, TRACE |

Table 2.3.5 - heartbeat endpoint setting

| The parameter | Mandatory | Description, Example |
| :---------------- | :---------- | :----------------|
| `management.endpoint.heartbeat.timeout` | No | Maximum response time in seconds for a query made when checking dependent systems. Default is 3 seconds. |
| `management.endpoint.heartbeat.credentials.test-interval` | No<sup>1</sup> | Interval for testing the health of keys used for metadata signing, if the physical security module is configured.<sup>2</sup> Default 60 seconds. |

<sup>1</sup> Valid only if `eidas.client.hsm.enabled=true`

<sup>2</sup> The keys of the physical security module are only tested if the `heartbeat` endpoint is called. To reduce the load on the physical security module, it is possible to set the `management.endpoint.heartbeat.credentials.test-interval` interval, which defines the minimum time when the test can be run. If the interval has not passed at the time of the call, the result of the previous test is returned, except in the event that an error has occurred in the use of keys by the application. If an error occurs in the use of keys during the operation of the application, the health of the keys is tested at each access to the `heartbeat' endpoint, regardless of whether the minimum testing interval has passed or not. If the order of the keys is restored, the check is continued according to the interval.

<a name="conf_hazelcast"></a>
Table 2.3.6 - Hazelcast configuration

| The parameter | Mandatory | Description, Example |
| :---------------- | :---------- | :----------------|
| `eidas.client.hazelcast-enabled` | No | Activating Hazelcast support. |
| `eidas.client.hazelcast-config` | No <sup>1</sup> | <p>Reference to the Hazelcast configuration file. </p><p>Example: `classpath:hazelcast.xml` if the file is read via classpath or `file:/etc/eidas-client/hazelcast.xml` if read directly from the file system.</p> |
| `eidas.client.hazelcast-signing-key` | No <sup>1</sup> | <p>HMAC key in base64 encoded form (for signing hash table contents). The length of the key depends on the choice of the signing algorithm.</p> <p>For the default HMAC512, a 512-bit random number must be used. </p><p>NB! Example of generating a 512-bit key with openssl: `openssl rand -base64 64`</p>|
| `eidas.client.hazelcast-signing-algorithm` | No | Signing Algorithm (`HS512`, `HS384`, `HS256`). Default `HS512`. |
| `eidas.client.hazelcast-encryption-key` | No <sup>1</sup> | <p>Encryption key in base64 encoded form (symmetric key used for encryption of hash table contents). </p><p>For the default `AES` algorithm, the key must always be 128 bits</p><p>Example of generating a 128 bit key with openssl `openssl rand -base64 16` </p>|
| `eidas.client.hazelcast-encryption-alg` | No | Encryption algorithm according to the standard [List of Java Cryptographic Algorithms](https://docs.oracle.com/javase/8/docs/technotes/guides/security/StandardNames.html#Cipher). Default `AES`. |

<sup>1</sup> Mandatory if `eidas.client.hazelcast-enabled` is set.


Example configuration:
```
eidas.client.hazelcast-enabled = true
eidas.client.hazelcast-config = file:/etc/eidas-client/hazelcast.xml
eidas.client.hazelcast-signing-key=JgeUmXWHRs1FClKuStKRNWvfNWfFHWGSR8jgN8_xEoBSGnkiHHgEEHMttYmMtzy88rnlO6yfmQpSAJ0yNA9NWw
eidas.client.hazelcast-signing-algorithm=HS512
eidas.client.hazelcast-encryption-key=K7KVMOrgRj7Pw5GDHdXjKQ==
eidas.client.hazelcast-encryption-alg=AES
```

Table 2.3.7 - Hazelcast usage statistics endpoint

| The parameter | Mandatory | Description, Example |
| :---------------- | :---------- | :----------------|
| `management.endpoint.hazelcast.enabled` | No | Possible values: `true`, `false`. Enables the `/hazelcast` endpoint. Default `false`. |

Table 2.3.8 - Setting of unreported collateral levels

| The parameter | Mandatory | Description, Example |
| :---------------- | :---------- | :----------------|
| `eidas.client.non-notified-assurance-levels[0].country` | No | The country where the non-reported guarantee level applies. Only 1 setting per country is allowed. |
| `eidas.client.non-notified-assurance-levels[0].non-notified-level` | No | Unreported collateral level. Example: `http://eidas.europa.eu/NonNotified/LoA/low` |
| `eidas.client.non-notified-assurance-levels[0].notified-level` | No | If the requested margin level is equal to or lower than the reported margin level defined here, then the non-reported margin level applies. Example: `http://eidas.europa.eu/LoA/substantial` |


<a name="votmed"></a>
## 3. Test SAML key generation

For its work, the web application needs several sets of public and private key pairs and, in addition, the public key of the metadata of the Specific-Connector service, or the so-called trust anchor. The key pairs are stored in the same `jks` keystore (the default file name is `samlKeystore.jks` unless specified otherwise in the configuration file). The alias specified in the configuration is passed to the key pair.

An example of generating the necessary keys using Java `keytool`:

**1. Creation of key store and trust anchor key pair (for signing eIDAS-Client metadata)**
`keytool -genkeypair -keyalg EC -keystore $keystoreFileName -keysize 384 -alias metadata -dname "CN=SP-metada-signing, OU=test, O=test, C=BG" -validity 730 -storepass $password -keypass $ passport`

**2. Authentication request signing key pair**
`keytool -genkeypair -keyalg EC -keystore $keystoreFileName -keysize 384 -alias requestsigning -dname "CN=SP-auth-request-signing, OU=test, O=test, C=BG" -validity 730 -storepass $password - keypass $password`

**3. Authentication response encryption key pair**
`keytool -genkeypair -keyalg RSA -keystore $keystoreFileName -keysize 4096 -alias responseencryption -dname "CN=SP-response-encryption, OU=test, O=test, C=BG" -validity 730 -storepass $password -keypass $ password`

**4. Specific-Connector service trust anchor import**
`keytool -importcert -keystore $keystoreFileName -storepass $password -file scripts/bg_eidasnode.pem -alias idpmetadata -noprompt`




<a name="login"></a>
## 4. Logging in
----------------

The [Log4j2 framework](https://logging.apache.org/log4j/2.x/index.html) is used for logging, which can be configured through an [XML configuration file](https://logging.apache.org/log4j/ 2.x/manual/configuration.html) (`log4j2.xml`).

<a name="login_naidis"></a>
### 4.1. Default logging configuration

The application comes with a [default configuration file](../../eidas-client-webapp/src/main/resources/log4j2.xml) that logs files in the local file system `/var/log/eidas` folder with the pattern `eIDAS-Client-%d {yyyy-MM-dd}`, for example `/var/log/eidas/eIDAS-Client-2019-08-06.log`. The application keeps logs of the last 7 days in uncompressed form. The logging level of events occurring in eIDAS client packets is `INFO`, all other events are logged at `WARN` level.
In the default setting, log entries are output in JSON format, each log entry is terminated by a newline symbol `\n`.

Table 4.1.1 - Log record structure

| Field | Description | Always available |
| :----------- | :-------- | :----------- |
| **date** | Event date and time in ISO-8601 format. Example: `2018-09-13T10:06:50,682+0000` | Yes |
| **level** | Log event level. Possible values ​​(from least severe to most severe): `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL` | Yes |
| **request** | Request method and URL. Unvalued if the log event has not been emitted during the request. Example: `GET http://eidas-client.arendus.kit:8080/login` | No |
| **requestId** | The value of the `X-Request-ID` header of the request, in its absence a randomly generated 16-character combination of letters and numbers identifying the request. Unvalued if the log event has not been emitted during the request. | No |
| **sessionId** | The value of the `X-Correlation-ID` header of the request, or in its absence, the **sha256** hash generated from the session ID in base64 form. Unvalued if the log event has not been emitted during the request. | No |
| **logger** | Logger name. | Yes |
| **thread** | Thread name. | Yes |
| **message** | Log message escaped with JSON-_escaping_.| Yes |
| **throwable** | Error _stack trace_ escaped with JSON-_escaping_. | No |

Example:

```
{"date":"2018-09-13T10:06:50,682+0000", "level":"INFO", "request":"GET http://eidas-client.arendus.kit:8080/login", "requestId":"0VVIBKN0GMZAKCVP", "sessionId":"LgoVYrdPv4PiHkRFGLfMD9h08dqpOC9NiVAQDL0hpGw=", "logger":"bg.is-bg.eidas.client.AuthInitiationService", "thread":"http-nio-8080-exec-1", " message":"SAML request ID: _8d4900cb8ae92034fa2cd89e6d8e8d89"}
```

<a name="login_setting"></a>
### 4.2 Setting Default Configuration

In the default setting, it is possible to control the logging output and the logging level of eIDAS client-specific log events.

Table 4.2.1 - Settable parameters of the default configuration file

| The parameter | Description | Default value |
| :---------------- | :---------- | :----------------|
| `eidas.client.log.pattern` | Log event pattern. | `{"date":"%d{yyyy-MM-dd'T'HH:mm:ss,SSSZ}", "level":"%level"%notEmpty{, "request":"%X{request} "}%notEmpty{, "requestId":"%X{requestId}"}%notEmpty{, "sessionId":"%X{sessionId}"}, "logger":"%logger", "thread":"% thread", "message":"%enc{%msg}{JSON}"notEmpty{, "throwable":"%enc{%throwable}{JSON}"}}%n` |
| `eidas.client.log.level` | Logging level of eIDAS client-specific events. One of the following values: `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE` | `info` |

It is possible to change the default values ​​of these parameters using the system parameters provided when starting the application (see [Deployment](Configuration_EN.md#war_deployment) point 3), for example:

```
export JAVA_OPTS="-Deidas.client.log.pattern=%m%n -Deidas.client.log.level=debug"
```

Table 4.2.2 - **MDC** (_Mapped Diagnostic Context_) attributes available for logging

| Attribute | Description |
| :---------------- | :-------- |
| `request` | Request method and URL. Unvalued if the log event has not been emitted during the request. Example: `GET http://eidas-client.arendus.kit:8080/login` |
| `requestId` | The value of the `X-Request-ID` header of the request, in its absence a randomly generated 16-character combination of letters and numbers identifying the request. Unvalued if the log event has not been emitted during the request. |
| `sessionId` | The value of the `X-Correlation-ID` header of the request, or in its absence, the **sha256** hash generated from the session ID in base64 form. Unvalued if the log event has not been emitted during the request. |


<a name="login_on"></a>
### 4.3 Using the external log4j2.xml configuration file

If necessary, it is possible to use your own configuration file instead of the default configuration file. To do this, the location of the new file must be given to the application at startup using system parameters (see [Deployment](Configuration_EN.md#war_deployment) point 3), for example:

```
export JAVA_OPTS="-Dlogging.config=/etc/eidas-client/log4j2.xml"
```

<a name="heartbeat"></a>
## 5. Monitoring - Inquiring about the state of the application

Application state information is available from the **/heartbeat** endpoint.

The Spring Boot Actuator framework is used to display application status information. By default, all endpoints except the **/heartbeat** endpoint are disabled.

If necessary, additional endpoints can be configured according to the guide: <https://docs.spring.io/spring-boot/docs/2.2.1.RELEASE/reference/htmlsingle/#production-ready-endpoints-enabling-endpoints> (NB! the application war file on a separate Tomcat application server, the configuration of endpoints is limited to enabling and disabling additional endpoints).



<a name="clustering"></a>
## 6. Hazelcast - multi-instance installation

The eIDAS-Client must keep track of sent SAML requests to determine the correctness of the SAML response. By default, information about issued and unanswered requests is stored in the server's memory, which means that when clustering, the response must always come to the same shoulder where the request was issued. An alternative is to use the hash table in the Hazelcast cluster to share request information between eIDAS-Client instances.

<a name="hazelcast"></a>
### 6.1 Enabling Hazelcast

Hazelcast is run together as part of the eIDAS-Client application. Hazelcast is started only if the location of the Hazelcast xml configuration file is specified in the configuration file (see [configuration parameters](#conf_hazelcast)).

<a name="hazelcast_settings"></a>
### 6.2 Configuring Hazelcast

Hazelcast is configured declaratively using an xml configuration file. Read more about Hazelcast configuration details [here](https://docs.hazelcast.org/docs/3.11/manual/html-single/index.html#configuring-declaratively).


An example of a minimal configuration using the TCP-IP discovery mechanism:

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
### 6.3 Data security

eIDAS-Client encrypts with a symmetric key (default AES algorithm) and signs the data (default HMAC512 algorithm) before saving to a shared hash table. When requesting data from Hazelcast, the signature is verified and only then decrypted.

For setting up algorithms, see [config parameters](#conf_hazelcast).

<a name="hazelcast_monitoring"></a>
### 6.4 Monitoring and usage statistics

Hazelcast can be monitored using Hazelcast's own [health endpoint](https://docs.hazelcast.org/docs/3.12/manual/html-single/index.html#health-check) (disabled by default).

In addition, it is possible to get more detailed information from the [diagnostics log](https://docs.hazelcast.org/docs/3.12/manual/html-single/index.html#diagnostics) and check the cluster in more detail by turning on [JMX port usage] (https://docs.hazelcast.org/docs/3.11/manual/html-single/index.html#monitoring-with-jmx).

eIDAS-Client is also provided by the `/hazelcast` endpoint (off by default) with minimal usage statistics.

