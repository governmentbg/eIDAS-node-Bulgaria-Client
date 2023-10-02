# eIDAS-Client

## What is the eIDAS client?

The eIDAS-client project is a sample solution that [communicates](doc/en/Background_EN.md) with Bulgarian eIDAS Node connector service.


The solution consists of two parts:

1. **Library** - provides functions necessary for trust operations, including service provider metadata generation, connector service metadata acquisition, authentication request generation and response validation, and processing.
2. **Web service** - microservice that provides a web interface for performing SAML specific operations. Publishing metadata of the service provider, processing metadata of the connector service and sending and receiving authentication requests from the connector service are supported.

### Architecture

An overview of the construction and components of the eIDAS client project can be found [**here**](doc/en/Structure_EN.md).


### Web Service API

You can find an overview of which endpoints the eIDAS client web service offers [**here**](doc/en/Service-API_EN.md).



### Construction and installation of the web service

Activities necessary to install and start the eIDAS client web service in brief (requires Java 8):

1. Get the latest source code from git
>`git clone https://git.egov.bg/meu/eidas-node-bulgaria/eidas-client/5_25.07.2022.git`

2. Build the eIDAS-client project
>`./mvnw clean install`

3. Generate sample keys and associated configuration file (or create your own, see [**Configuration**](doc/en/Configuration_EN.md))
>`eidas-client-webapp/src/test/resources/scripts/generateTestConfiguration.sh`

4. Start the web service
>`java -jar eidas-client-webapp/target/eidas-client-webapp-1.0.0 -SNAPSHOT.war`

5. To verify that the application launched successfully, open the URL http://localhost:8889/metadata in the browser

> In order to actually use the eidas client against the test connector service, a subscription agreement must be concluded and the metadata public key from the generated keystore must be transferred to the EGOV (in the case of the generated sample configuration /eidas-client-webapp/target/generated-test-conf/sp_metadata.crt)

You can find a longer and more detailed explanation of how to install and configure the web service in the [**integrator guide**](doc/en/Configuration_EN.md).

