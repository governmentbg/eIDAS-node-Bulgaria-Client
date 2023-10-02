package bg.is.eidas.client.webapp.controller;

import bg.is.eidas.client.response.AuthenticationResult;
import bg.is.eidas.client.AuthInitiationService;
import bg.is.eidas.client.AuthResponseService;
import bg.is.eidas.client.authnrequest.AssuranceLevel;
import bg.is.eidas.client.authnrequest.SPType;
import bg.is.eidas.client.config.EidasClientProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static bg.is.eidas.client.webapp.EidasClientApi.ENDPOINT_AUTHENTICATION_LOGIN;
import static bg.is.eidas.client.webapp.EidasClientApi.ENDPOINT_AUTHENTICATION_RETURN_URL;

@Controller
public class AuthenticationController {

    @Autowired
    private AuthInitiationService authInitiationService;

    @Autowired
    private AuthResponseService authResponseService;

    @Autowired
    private EidasClientProperties properties;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }

    @GetMapping(value = ENDPOINT_AUTHENTICATION_LOGIN)
    public void authenticate(HttpServletResponse response,
            @RequestParam("Country") String country,
            @RequestParam(value = "LoA", required=false) AssuranceLevel loa,
            @RequestParam(value = "RelayState", required=false) String relayState,
            @RequestParam(value = "Attributes", required=false) String eidasAttributes,
            @RequestParam("RequesterID") String requesterId,
            @RequestParam("SPType") SPType spType) {
        authInitiationService.authenticate(response, country, loa, relayState, eidasAttributes, spType, requesterId);
    }

    @PostMapping(value = ENDPOINT_AUTHENTICATION_RETURN_URL)
    @ResponseBody
    public AuthenticationResult getAuthenticationResult(HttpServletRequest req) throws MissingServletRequestParameterException {
        return authResponseService.getAuthenticationResult(req);
    }

}
