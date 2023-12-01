package bg.is.eidas.client.webapp.controller;

import bg.is.eidas.client.response.AuthenticationResult;
import bg.is.eidas.client.AuthInitiationService;
import bg.is.eidas.client.AuthResponseService;
import bg.is.eidas.client.authnrequest.AssuranceLevel;
import bg.is.eidas.client.authnrequest.SPType;
import bg.is.eidas.client.config.EidasClientProperties;
import bg.is.eidas.client.webapp.security.CryptoUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.time.Instant;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import static bg.is.eidas.client.webapp.EidasClientApi.ENDPOINT_AUTHENTICATION_LOGIN;
import static bg.is.eidas.client.webapp.EidasClientApi.ENDPOINT_AUTHENTICATION_RETURN_URL;
import static bg.is.eidas.client.webapp.EidasClientApi.ENDPOINT_AUTHENTICATION_RETURN_URL_REST;
import static java.util.Objects.nonNull;

@Controller
public class AuthenticationController {

    @Autowired
    private AuthInitiationService authInitiationService;

    @Autowired
    private AuthResponseService authResponseService;

    @Autowired
    private EidasClientProperties properties;

    private AuthenticationResult authenticationResultRest = null;

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

    @GetMapping(value = ENDPOINT_AUTHENTICATION_RETURN_URL_REST)
    @ResponseBody
    public AuthenticationResult getAuthenticationResult() {
        if (nonNull(this.authenticationResultRest)) {
            AuthenticationResult result = this.authenticationResultRest;
            this.authenticationResultRest = null;
            return result;
        }
        return null;
    }

    @PostMapping(value = ENDPOINT_AUTHENTICATION_RETURN_URL)
    public ModelAndView newTest(HttpServletRequest req, ModelAndView mav, RedirectAttributes redirectAttributes)
        throws MissingServletRequestParameterException, JsonProcessingException {

        AuthenticationResult authenticationResult = authResponseService.getAuthenticationResult(req);
        if (!properties.getEavtActivateRedirectConfig()) {
            this.authenticationResultRest = authenticationResult;
            mav.setViewName("redirect:" + ENDPOINT_AUTHENTICATION_RETURN_URL_REST);
            return mav;
        }

        String auth = CryptoUtils.encrypt(createToken(authenticationResult), "pesho");
        mav.setViewName("redirect:" + buildEavtCallbackUrl() + auth);
        return mav;
    }

    private String createToken(AuthenticationResult authenticationResult) throws JsonProcessingException {
        Instant now = Instant.now();
        String token = Jwts.builder().setSubject(authenticationResult.getRequestId())
            .claim("attributes", authenticationResult.getAttributes())
            .claim("levelOfAssurance", authenticationResult.getLevelOfAssurance())
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(now.plusSeconds(properties.getEavtTokenExpireInSeconds())))
            .signWith(SignatureAlgorithm.HS256, properties.getEavtTokenSecret().getBytes())
            .compact();

        return token;
    }

    private String buildEavtCallbackUrl() {
        return properties.getEavtCallbackUrl() + "?" + properties.getEavtCallbackAuthRequestParam() + "=";
    }

}
