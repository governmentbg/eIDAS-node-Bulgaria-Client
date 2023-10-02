# Functional requirements

<a name="authentication response"></a>
## General authentication response checks

| ID | Brief description | Claim |
|:----:|:--------------|:-----|
| AV-1 | Check for mandatory parameters | The presence of all mandatory parameters must be checked according to [**API description**](Service-API_EN.md#returnUrl). Otherwise, a **400 Bad Request** error must be returned.|
| AV-2 | Check of allowed values ​​of all parameters | The value of all parameters must be checked according to the restrictions given in [**API description**](Service-API_EN.md#returnUrl). Otherwise, a **400 Bad Request** error must be returned.|
| AV-3 | SAML Response XML Schema Check | Before any content checks, SAMLResponse content must be checked against SAML2 core and eIDAS XML schemas. If the SAMLResponse content does not match the schema, a **400 Bad Request** error must be returned. A more detailed error description is given in [**API description**](Service-API_EN.md#error handling).|
| AV-4 | The SAML response is always signed | The incoming SAML Response must be signed. If not, **400 Bad Request** error is returned. |
| AV-5 | SAML Response Signature Verification | The signature of the incoming SAML Response must be validated using the signing certificate provided in the metadata of the connector service (not the certificate in the response). If the signature does not validate, a **400 Bad Request** error must be returned. |
| AV-6 | SAML Response Status Check | Further processing of the SAML message shall be aborted if the first-level status code in the SAML response is not **urn:oasis:names:tc:SAML:2.0:status:Success**. <p>The error **401 Unauthorized** is returned to the user if the second-level status code is one of the following status codes. <ul><li>**urn:oasis:names:tc:SAML:2.0:status:AuthnFailed** (authentication failed)</li><li>**urn:oasis:names:tc:SAML:2.0: status:RequestDenied** (user did not consent to disclosure of personal information)</li></ul></p><p>For all other error codes **HTTP 500 Internal Server Error** is returned and statusCode and statusMessage are logged at the error level. </p> |
| AV-7 | SAML response time control | The SAML response issue (`/saml2p:Response/@IssueInstant`) must not be expired or future. The output time must be between `/saml2p:Response/@IssueInstant` - allowed interval - allowed clock difference and `/saml2p:Response/@IssueInstant` + allowed interval + allowed clock difference. Otherwise, a **400 Bad Request** error must be returned. |
| AV-8 | Check for a valid request associated with the SAML response | The content of the `InResponseTo` attribute of the incoming SAML Response must refer to a valid, raw request in the message correspondence table. Otherwise, a **400 Bad Request** error must be returned. |
| AV-9 | The `Assertion` element of a successful authentication response must be encrypted | The content of the incoming verified SAML response must contain exactly one encrypted `Assertion` element (in the form of `EncryptedAssertion`) **400 Bad Request**. |
| AV-10 | `Assertion' content NO specific restrictions | The decrypted portion of the content of a successful authentication response must contain exactly one instance of `<saml2:Assertion>`, `<saml2:AuthnStatement>`, `<saml2:AttributeStatement>`, `<saml2:Subject>`, and `<saml2:AuthnContext>`. . Otherwise, a **400 Bad Request** error must be returned. |
| AV-11 | The SAML `Assertion` of a successful authentication response must be signed | For successful authentication, the SAML `Assertion` must be signed. If there is no signature, **400 Bad Request** must be returned. |
| AV-12 | The SAML `Assertion` of a failed authentication response may be signed by | In case of failed authentication, the SAML `Assertion` may (but need not) be signed.
| AV-13 | SAML `Assertion` issue time check | The time of issuing the authentication result (`saml2:Assertion/@IssueInstant`) must not be in the future or expired taking into account the server clock difference and the maximum allowed message lifetime. The issue time must fall between `saml2:Assertion/@IssueInstant` - allowed interval - allowed clock difference and `saml2:Assertion/@IssueInstant` + allowed interval + allowed clock difference. Otherwise, a **400 Bad Request** error must be returned. |
| AV-14 | SAML `Assertion` signature check | If the `Assertion` element in the SAML response is signed, its validity must be validated using the public key published in the metadata of the connector service (KeyDescriptor/@use=signing). If the signature of the authentication response does not validate, a **400 Bad Request** error must be returned. |
| AV-15 | SAML `Assertion/Issuer` check | The `saml2:Assertion/Issuer/@Format` attribute must always be `urn:oasis:names:tc:SAML:2.0:nameid-format:entity` and the content of the element must match the metadata url of the connector service. If the authentication response does not meet the conditions, the error **400 Bad Request** must be returned.|
| AV-16 | SAML `Assertion/Subject` checks - allowed name form | A SAML response must always contain exactly one `saml2:Assertion/saml2:Subject/saml2:NameID` element and the format must be one of the following values: `urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified`, ` urn:oasis:names:tc:SAML:2.0:nameid-format:transient` or `urn:oasis:names:tc:SAML:2.0:nameid-format:persistent`. If the conditions are not met, the error **400 Bad Request** must be returned.</p>|
| AV-17 | SAML `Assertion/Subject` checks - allowed method | A SAML response must always contain exactly one `saml2:Assertion/saml2:Subject/saml2:SubjectConfirmation` element, and only the `urn:oasis:names:tc:SAML:2.0:cm:bearer` method is supported as its `@Method` attribute. If the conditions are not met, the error **400 Bad Request** must be returned.</p>|
| AV-18 | SAML `Assertion/Subject` checks - Expiration check | The value of `/saml2p:Response/saml2:Assertion/saml2:Subject/saml2:SubjectConfirmation/saml2:SubjectConfirmationData/@NotOnOrAfter` must not be greater than the current moment + allowed clock difference + max response lifetime. Otherwise, a **400 Bad Request** error must be returned. |
| AV-19 | SAML `Assertion/Subject` checks - recipient check | The value of `/saml2p:Response/saml2:Assertion/saml2:Subject/saml2:SubjectConfirmation/saml2:SubjectConfirmationData/@Recipient` must be the same as the message receiving point set in the configuration. Otherwise, a **400 Bad Request** error must be returned. |
| AV-20 | SAML `Assertion/Subject` checks - InResponseTo check | `/saml2p:Response/saml2:Assertion/saml2:Subject/saml2:SubjectConfirmation/saml2:SubjectConfirmationData/@InResponseTo` must contain an entry for the sent request in the message correspondence table. Otherwise, a **400 Bad Request** error must be returned. |
| AV-21 | Constraints supported by SAML `Assertion/Conditions` | <p>A SAML response must always contain exactly one `saml2:Assertion/saml2:Conditions` element, and only `AudienceRestriction` must be supported among its children. Otherwise, a **400 Bad Request** error must be returned. |
| AV-22 | SAML `Assertion/Conditions` validity check | The value of the `NotBefore` and `NotOnOrAfter` attributes of the `saml2:Assertion/saml2:Conditions` element in the SAML response must be checked. The current moment must not be less than the value of `NotBefore' and greater than the value of `NotOnOrAfter'. If the conditions are not met, the error **400 Bad Request** must be returned.</p>|
| AV-23 | Processing of SAML `Assertion/Conditions` constraints | The `saml2:Assertion/saml2:Conditions/saml2:AudienceRestriction` in the SAML response must contain at least one Audience record. There must be at least one Audience element whose content is the endpoint address of the client's metadata. If the conditions are not met, the error **400 Bad Request** must be returned. |
| AV-24 | SAML `Assertion` `AuthnStatement` checks | <p>A SAML response must always contain exactly one `/saml2:Assertion/saml2:AuthnStatement` element and, on successful authentication, must contain an AuthnContext/AuthnContextClassRef element whose content must correspond to an LoA equal to or higher than the LoA requested in the original request . If the conditions are not met, the error **400 Bad Request** must be returned.|
| AV-25 | SAML `Assertion` `AuthnStatement` checks - `AuthnInstant` validity check| The value of the `/saml2:Assertion/saml2:AuthnStatement/@AuthnInstant` attribute must not be expired (server clock difference and expiration time) nor in the future. If the conditions are not met, the error **400 Bad Request** must be returned.|
| AV-26 | Unhandled errors | All errors not addressed in the requirements must be caught and **500 Internal Server Error** returned to the user. |
| AV-27 | Presence of required attributes in response | The SAML authentication response must contain all mandatory attributes described in the request. If not, a **400 Bad Request** error is returned. |
| AV-29 | Successful authentication | Upon passing the checks and in the case of a successful authentication response, a JSON response is created according to the description given in [**API description**](Service-API_EN.md#returnUrl). |