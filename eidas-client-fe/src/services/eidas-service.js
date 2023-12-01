import axios from 'axios';
import UrlConstants from "@/constants/url-constants";

export class EidasService {
    async getSupportedCountries() {
        let countries = {};

        await axios.get(UrlConstants.EIDAS_SP_SUPPORTED_COUNTRIES_URL).then((response) => {
            countries.status = 'OK';
            countries.data = response.data;

        }).catch((err) => {
            console.log('err', err)//TODO да оправим съобщенията
            countries.status = 'ERROR';
            countries.error = {
                errorModalTitle: 'EIDAS failed',
                errorModalBody: 'EIDAS Get Supported Countries failed!'
            };
        });
        return countries;
    }
}