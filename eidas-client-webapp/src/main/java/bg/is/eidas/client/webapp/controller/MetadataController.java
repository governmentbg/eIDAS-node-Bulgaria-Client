package bg.is.eidas.client.webapp.controller;

import bg.is.eidas.client.config.EidasClientProperties;
import bg.is.eidas.client.util.OpenSAMLUtils;
import bg.is.eidas.client.webapp.EidasClientApi;
import bg.is.eidas.client.AuthInitiationService;
import bg.is.eidas.client.authnrequest.SPType;
import bg.is.eidas.client.metadata.IDPMetadataResolver;
import bg.is.eidas.client.metadata.SPMetadataGenerator;
import org.opensaml.saml.saml2.metadata.EntityDescriptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
public class MetadataController {

    @Autowired
    private EidasClientProperties eidasClientProperties;

    @Autowired
    private SPMetadataGenerator metadataGenerator;

    @Autowired
    private AuthInitiationService authInitiationService;

    @Autowired
    private IDPMetadataResolver idpMetadataResolver;

    @GetMapping(value = EidasClientApi.ENDPOINT_METADATA_METADATA, produces = { "application/xml", "text/xml" }, consumes = MediaType.ALL_VALUE)
    public @ResponseBody String metadata() {
        EntityDescriptor entityDescriptor = metadataGenerator.getMetadata();
        return OpenSAMLUtils.getXmlString(entityDescriptor);
    }

    @GetMapping(value = EidasClientApi.ENDPOINT_METADATA_SUPPORTED_COUNTRIES, produces = { "application/json" }, consumes = MediaType.ALL_VALUE)
    public @ResponseBody
    Map<SPType, List<String>> countries() {
        return idpMetadataResolver.getSupportedCountries();
    }
}
