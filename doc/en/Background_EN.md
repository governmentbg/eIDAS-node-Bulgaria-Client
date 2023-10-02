## Concepts

eIDAS connector service -
SAML -


## Publication of institution metadata

The eIDAS Specific-Connector service needs the institution's metadata to receive a SAML authentication request and prepare a response. The eIDAS client publishes its metadata in the `/metadata` endpoint. Metadata is generated and signed for each access.

## Loading eIDAS connector service metadata

The metadata of the eIDAS Specific-Connector service is read in when the eIDAS client is started (from the previously configured URL) and buffered. The buffer is continuously updated according to the [SAML metadata](https://docs.oasis-open.org/security/saml/v2.0/saml-metadata-2.0-os.pdf) `validUntil` or `cacheDuration` parameters.

Without access to the connector service, the eIDAS client will NOT start.

## Identity process

Simplified, the personal identification process between the eIDAS client and the eIDAS Specific-Connector service works as follows.

1. The user navigates to the main page, after which the eIDAS client displays a form for selecting destination countries.

2. The user selects the destination country and, if desired, the authentication level and whether he wants the results in machine-readable or human-readable form. The user presses 'Login'. The web page makes an HTTP POST request to the `/login` page with the selected parameters. On the server side of the Eidas client, the content of the `SAMLRequest` parameter is put together and a redirection form is returned to the user, which is automatically forwarded to the eIDAS Specific-Connector service.

3. The browser automatically directs the user to the eIDAS connector service with `SAMLRequest`, `RelayState` and `Country` parameters, where all cross-border personal identification steps are performed in subsequent steps. Among them, the user is redirected to the eIDAS Node service of the destination country, if necessary, the user's consent to the publication of data is requested and personal identification is performed.

4. After passing the cross-border identification process, the eIDAS Specific-connector service sends the result to the `/returnUrl` address of the eIDAS client, together with the `SAMLResponse` and `RelayState` parameters. The eIDAS client validates the response, decrypts the content and displays the identified person's data.

## List of supported countries

NB! The list of supported target countries (in JSON format) is downloaded from the URL specified in the configuration during application startup and buffered (buffer expiration is configurable).