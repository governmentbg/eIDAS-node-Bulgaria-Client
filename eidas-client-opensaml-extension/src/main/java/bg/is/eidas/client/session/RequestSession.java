package bg.is.eidas.client.session;

import bg.is.eidas.client.authnrequest.AssuranceLevel;
import bg.is.eidas.client.authnrequest.EidasAttribute;
import org.joda.time.DateTime;

import java.io.Serializable;
import java.util.List;

public interface RequestSession extends Serializable, Comparable<RequestSession> {
    String getRequestId();

    DateTime getIssueInstant();

    AssuranceLevel getLoa();

    List<EidasAttribute> getRequestedAttributes();

    String getCountry();
}
