/* eslint-disable */
import BgLabelConstants from "@/constants/bg-label-constants";
import UrlConstants from "@/constants/url-constants";
import Calendar from "primevue/calendar";
import Dropdown from 'primevue/dropdown';
import {EidasService} from "@/services/eidas-service";
import ErrorModal from "@/components/ErrorModal";
import bgLabelConstants from "@/constants/bg-label-constants";
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import useVuelidate from "@vuelidate/core";
import {required} from 'vuelidate/lib/validators';

export default {
    components: {
        Calendar,
        Dropdown,
        ErrorModal,
        Card,
        Checkbox,
        RadioButton
    },
    data() {
        return {
            bgLabelConstants: BgLabelConstants,
            eidasService: new EidasService(),
            params: {
                selectedCountry: null,
                nameIdentifier: bgLabelConstants.NAME_IDENTIFIER_PERSISTENT,
                levelOfAssurance: 'D',
                comparisonOfLoa: 'minimum',
                core: {
                    familyName: bgLabelConstants.PERSON_CORE_FAMILY_NAME,
                    firstName: bgLabelConstants.PERSON_CORE_FIRST_NAME,
                    dateOfBirth: bgLabelConstants.PERSON_CORE_DATE_OF_BIRTH,
                    personIdentifier: bgLabelConstants.PERSON_CORE_IDENTIFIER,
                },
                opt: {
                    birthName: [],
                    placeOfBirth: [],
                    currentAddress: [],
                    gender: [],
                },
            },
            nameIdentifiers: [
                {
                    label: 'persistent',
                    value: 'persistent'
                },
                {
                    label: 'transient',
                    value: 'transient'
                },
                {
                    label: 'emailAddress',
                    value: 'emailAddress'
                },
                {
                    label: 'X509SubjectName',
                    value: 'X509SubjectName'
                },
                {
                    label: 'WindowsDomainQualifiedName',
                    value: 'WindowsDomainQualifiedName'
                },
                {
                    label: 'kerberos',
                    value: 'kerberos'
                },
                {
                    label: 'entity',
                    value: 'entity'
                },
                {
                    label: 'encrypted',
                    value: 'encrypted'
                },
                {
                    label: 'unspecified',
                    value: 'unspecified'
                },

            ],
            levelOfAssuranceList: [
                {
                    label: 'A - Low',
                    value: 'A'
                },
                {
                    label: 'B - Low',
                    value: 'B'
                },
                {
                    label: 'C - Substantial',
                    value: 'C'
                },
                {
                    label: 'D - Substantial',
                    value: 'D'
                },
                {
                    label: 'E - High',
                    value: 'E'
                },
            ],
            modal: {
                errorModalTitle: null,
                errorModalBody: null
            },
            spinner: {
                loading: false
            },
            version: null,
            selectedCountry: null,
            allCountries: [
                {name: 'Afghanistan', code: 'AF'},
                {name: 'Åland Islands', code: 'AX'},
                {name: 'Albania', code: 'AL'},
                {name: 'Algeria', code: 'DZ'},
                {name: 'American Samoa', code: 'AS'},
                {name: 'AndorrA', code: 'AD'},
                {name: 'Angola', code: 'AO'},
                {name: 'Anguilla', code: 'AI'},
                {name: 'Antarctica', code: 'AQ'},
                {name: 'Antigua and Barbuda', code: 'AG'},
                {name: 'Argentina', code: 'AR'},
                {name: 'Armenia', code: 'AM'},
                {name: 'Aruba', code: 'AW'},
                {name: 'Australia', code: 'AU'},
                {name: 'Austria', code: 'AT'},
                {name: 'Azerbaijan', code: 'AZ'},
                {name: 'Bahamas', code: 'BS'},
                {name: 'Bahrain', code: 'BH'},
                {name: 'Bangladesh', code: 'BD'},
                {name: 'Barbados', code: 'BB'},
                {name: 'Belarus', code: 'BY'},
                {name: 'Belgium', code: 'BE'},
                {name: 'Belize', code: 'BZ'},
                {name: 'Benin', code: 'BJ'},
                {name: 'Bermuda', code: 'BM'},
                {name: 'Bhutan', code: 'BT'},
                {name: 'Bolivia', code: 'BO'},
                {name: 'Bosnia and Herzegovina', code: 'BA'},
                {name: 'Botswana', code: 'BW'},
                {name: 'Bouvet Island', code: 'BV'},
                {name: 'Brazil', code: 'BR'},
                {name: 'British Indian Ocean Territory', code: 'IO'},
                {name: 'Brunei Darussalam', code: 'BN'},
                {name: 'Bulgaria', code: 'BG'},
                {name: 'Burkina Faso', code: 'BF'},
                {name: 'Burundi', code: 'BI'},
                {name: 'Cambodia', code: 'KH'},
                {name: 'Cameroon', code: 'CM'},
                {name: 'Canada', code: 'CA'},
                {name: 'Cape Verde', code: 'CV'},
                {name: 'Cayman Islands', code: 'KY'},
                {name: 'Central African Republic', code: 'CF'},
                {name: 'Chad', code: 'TD'},
                {name: 'Chile', code: 'CL'},
                {name: 'China', code: 'CN'},
                {name: 'Christmas Island', code: 'CX'},
                {name: 'Cocos (Keeling) Islands', code: 'CC'},
                {name: 'Colombia', code: 'CO'},
                {name: 'Comoros', code: 'KM'},
                {name: 'Congo', code: 'CG'},
                {name: 'Congo, The Democratic Republic of the', code: 'CD'},
                {name: 'Cook Islands', code: 'CK'},
                {name: 'Costa Rica', code: 'CR'},
                {name: 'Cote D\'Ivoire', code: 'CI'},
                {name: 'Croatia', code: 'HR'},
                {name: 'Cuba', code: 'CU'},
                {name: 'Cyprus', code: 'CY'},
                {name: 'Czech Republic', code: 'CZ'},
                {name: 'Denmark', code: 'DK'},
                {name: 'Djibouti', code: 'DJ'},
                {name: 'Dominica', code: 'DM'},
                {name: 'Dominican Republic', code: 'DO'},
                {name: 'Ecuador', code: 'EC'},
                {name: 'Egypt', code: 'EG'},
                {name: 'El Salvador', code: 'SV'},
                {name: 'Equatorial Guinea', code: 'GQ'},
                {name: 'Eritrea', code: 'ER'},
                {name: 'Estonia', code: 'EE'},
                {name: 'Ethiopia', code: 'ET'},
                {name: 'Falkland Islands (Malvinas)', code: 'FK'},
                {name: 'Faroe Islands', code: 'FO'},
                {name: 'Fiji', code: 'FJ'},
                {name: 'Finland', code: 'FI'},
                {name: 'France', code: 'FR'},
                {name: 'French Guiana', code: 'GF'},
                {name: 'French Polynesia', code: 'PF'},
                {name: 'French Southern Territories', code: 'TF'},
                {name: 'Gabon', code: 'GA'},
                {name: 'Gambia', code: 'GM'},
                {name: 'Georgia', code: 'GE'},
                {name: 'Germany', code: 'DE'},
                {name: 'Ghana', code: 'GH'},
                {name: 'Gibraltar', code: 'GI'},
                {name: 'Greece', code: 'GR'},
                {name: 'Greenland', code: 'GL'},
                {name: 'Grenada', code: 'GD'},
                {name: 'Guadeloupe', code: 'GP'},
                {name: 'Guam', code: 'GU'},
                {name: 'Guatemala', code: 'GT'},
                {name: 'Guernsey', code: 'GG'},
                {name: 'Guinea', code: 'GN'},
                {name: 'Guinea-Bissau', code: 'GW'},
                {name: 'Guyana', code: 'GY'},
                {name: 'Haiti', code: 'HT'},
                {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
                {name: 'Holy See (Vatican City State)', code: 'VA'},
                {name: 'Honduras', code: 'HN'},
                {name: 'Hong Kong', code: 'HK'},
                {name: 'Hungary', code: 'HU'},
                {name: 'Iceland', code: 'IS'},
                {name: 'India', code: 'IN'},
                {name: 'Indonesia', code: 'ID'},
                {name: 'Iran, Islamic Republic Of', code: 'IR'},
                {name: 'Iraq', code: 'IQ'},
                {name: 'Ireland', code: 'IE'},
                {name: 'Isle of Man', code: 'IM'},
                {name: 'Israel', code: 'IL'},
                {name: 'Italy', code: 'IT'},
                {name: 'Jamaica', code: 'JM'},
                {name: 'Japan', code: 'JP'},
                {name: 'Jersey', code: 'JE'},
                {name: 'Jordan', code: 'JO'},
                {name: 'Kazakhstan', code: 'KZ'},
                {name: 'Kenya', code: 'KE'},
                {name: 'Kiribati', code: 'KI'},
                {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},
                {name: 'Korea, Republic of', code: 'KR'},
                {name: 'Kuwait', code: 'KW'},
                {name: 'Kyrgyzstan', code: 'KG'},
                {name: 'Lao People\'S Democratic Republic', code: 'LA'},
                {name: 'Latvia', code: 'LV'},
                {name: 'Lebanon', code: 'LB'},
                {name: 'Lesotho', code: 'LS'},
                {name: 'Liberia', code: 'LR'},
                {name: 'Libyan Arab Jamahiriya', code: 'LY'},
                {name: 'Liechtenstein', code: 'LI'},
                {name: 'Lithuania', code: 'LT'},
                {name: 'Luxembourg', code: 'LU'},
                {name: 'Macao', code: 'MO'},
                {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
                {name: 'Madagascar', code: 'MG'},
                {name: 'Malawi', code: 'MW'},
                {name: 'Malaysia', code: 'MY'},
                {name: 'Maldives', code: 'MV'},
                {name: 'Mali', code: 'ML'},
                {name: 'Malta', code: 'MT'},
                {name: 'Marshall Islands', code: 'MH'},
                {name: 'Martinique', code: 'MQ'},
                {name: 'Mauritania', code: 'MR'},
                {name: 'Mauritius', code: 'MU'},
                {name: 'Mayotte', code: 'YT'},
                {name: 'Mexico', code: 'MX'},
                {name: 'Micronesia, Federated States of', code: 'FM'},
                {name: 'Moldova, Republic of', code: 'MD'},
                {name: 'Monaco', code: 'MC'},
                {name: 'Mongolia', code: 'MN'},
                {name: 'Montserrat', code: 'MS'},
                {name: 'Morocco', code: 'MA'},
                {name: 'Mozambique', code: 'MZ'},
                {name: 'Myanmar', code: 'MM'},
                {name: 'Namibia', code: 'NA'},
                {name: 'Nauru', code: 'NR'},
                {name: 'Nepal', code: 'NP'},
                {name: 'Netherlands', code: 'NL'},
                {name: 'Netherlands Antilles', code: 'AN'},
                {name: 'New Caledonia', code: 'NC'},
                {name: 'New Zealand', code: 'NZ'},
                {name: 'Nicaragua', code: 'NI'},
                {name: 'Niger', code: 'NE'},
                {name: 'Nigeria', code: 'NG'},
                {name: 'Niue', code: 'NU'},
                {name: 'Norfolk Island', code: 'NF'},
                {name: 'Northern Mariana Islands', code: 'MP'},
                {name: 'Norway', code: 'NO'},
                {name: 'Oman', code: 'OM'},
                {name: 'Pakistan', code: 'PK'},
                {name: 'Palau', code: 'PW'},
                {name: 'Palestinian Territory, Occupied', code: 'PS'},
                {name: 'Panama', code: 'PA'},
                {name: 'Papua New Guinea', code: 'PG'},
                {name: 'Paraguay', code: 'PY'},
                {name: 'Peru', code: 'PE'},
                {name: 'Philippines', code: 'PH'},
                {name: 'Pitcairn', code: 'PN'},
                {name: 'Poland', code: 'PL'},
                {name: 'Portugal', code: 'PT'},
                {name: 'Puerto Rico', code: 'PR'},
                {name: 'Qatar', code: 'QA'},
                {name: 'Reunion', code: 'RE'},
                {name: 'Romania', code: 'RO'},
                {name: 'Russian Federation', code: 'RU'},
                {name: 'RWANDA', code: 'RW'},
                {name: 'Saint Helena', code: 'SH'},
                {name: 'Saint Kitts and Nevis', code: 'KN'},
                {name: 'Saint Lucia', code: 'LC'},
                {name: 'Saint Pierre and Miquelon', code: 'PM'},
                {name: 'Saint Vincent and the Grenadines', code: 'VC'},
                {name: 'Samoa', code: 'WS'},
                {name: 'San Marino', code: 'SM'},
                {name: 'Sao Tome and Principe', code: 'ST'},
                {name: 'Saudi Arabia', code: 'SA'},
                {name: 'Senegal', code: 'SN'},
                {name: 'Serbia and Montenegro', code: 'CS'},
                {name: 'Seychelles', code: 'SC'},
                {name: 'Sierra Leone', code: 'SL'},
                {name: 'Singapore', code: 'SG'},
                {name: 'Slovakia', code: 'SK'},
                {name: 'Slovenia', code: 'SI'},
                {name: 'Solomon Islands', code: 'SB'},
                {name: 'Somalia', code: 'SO'},
                {name: 'South Africa', code: 'ZA'},
                {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
                {name: 'Spain', code: 'ES'},
                {name: 'Sri Lanka', code: 'LK'},
                {name: 'Sudan', code: 'SD'},
                {name: 'Suriname', code: 'SR'},
                {name: 'Svalbard and Jan Mayen', code: 'SJ'},
                {name: 'Swaziland', code: 'SZ'},
                {name: 'Sweden', code: 'SE'},
                {name: 'Switzerland', code: 'CH'},
                {name: 'Syrian Arab Republic', code: 'SY'},
                {name: 'Taiwan, Province of China', code: 'TW'},
                {name: 'Tajikistan', code: 'TJ'},
                {name: 'Tanzania, United Republic of', code: 'TZ'},
                {name: 'Thailand', code: 'TH'},
                {name: 'Timor-Leste', code: 'TL'},
                {name: 'Togo', code: 'TG'},
                {name: 'Tokelau', code: 'TK'},
                {name: 'Tonga', code: 'TO'},
                {name: 'Trinidad and Tobago', code: 'TT'},
                {name: 'Tunisia', code: 'TN'},
                {name: 'Turkey', code: 'TR'},
                {name: 'Turkmenistan', code: 'TM'},
                {name: 'Turks and Caicos Islands', code: 'TC'},
                {name: 'Tuvalu', code: 'TV'},
                {name: 'Uganda', code: 'UG'},
                {name: 'Ukraine', code: 'UA'},
                {name: 'United Arab Emirates', code: 'AE'},
                {name: 'United Kingdom', code: 'GB'},
                {name: 'United States', code: 'US'},
                {name: 'United States Minor Outlying Islands', code: 'UM'},
                {name: 'Uruguay', code: 'UY'},
                {name: 'Uzbekistan', code: 'UZ'},
                {name: 'Vanuatu', code: 'VU'},
                {name: 'Venezuela', code: 'VE'},
                {name: 'Viet Nam', code: 'VN'},
                {name: 'Virgin Islands, British', code: 'VG'},
                {name: 'Virgin Islands, U.S.', code: 'VI'},
                {name: 'Wallis and Futuna', code: 'WF'},
                {name: 'Western Sahara', code: 'EH'},
                {name: 'Yemen', code: 'YE'},
                {name: 'Zambia', code: 'ZM'},
                {name: 'Zimbabwe', code: 'ZW'}
            ],
            countries: []
        }
    },
    setup() {
        return {v$: useVuelidate()}
    },
    validations: {
        params: {
            selectedCountry: {required},
            comparisonOfLoa: {required},
            levelOfAssurance: {required},
            nameIdentifier: {required},
            core: {
                familyName: {required},
                firstName: {required},
                dateOfBirth: {required},
                personIdentifier: {required},
            },
        },
    },
    methods: {
        async login() {
            console.log(this.params);
            this.v$.params.$touch();
            if (!this.v$.params.$error) {
                let form = this.$refs.form;
                let loginRequest = {};
                loginRequest.Country = this.params.selectedCountry.code;
                loginRequest.SPType = bgLabelConstants.SP_TYPE_PUBLIC;
                loginRequest.RequesterID = bgLabelConstants.BG_REQUESTER_ID;
                loginRequest.loginUrl = UrlConstants.EIDAS_SP_LOGIN_URL;
                //TODO: handle attributes interval delimited
                let coreAttributes = this.handleCoreAttributes();
                let optAttributes = this.handleOptAttributes();
                let loa = this.handleLoa();
                loginRequest.Attributes = coreAttributes + ' ' + optAttributes;
                loginRequest.LoA = loa;
                console.log(loginRequest);
                console.log(this.paramsSerializer(loginRequest));

                form.action = loginRequest.loginUrl;
                form.elements.Country.value = loginRequest.Country;
                form.elements.SPType.value = loginRequest.SPType;
                form.elements.RequesterID.value = loginRequest.RequesterID;
                form.elements.Attributes.value = loginRequest.Attributes;
                form.elements.LoA.value = loginRequest.LoA;
                console.log(form.elements.Country.value);
                console.log(form.elements.SPType.value);
                console.log(form.elements.RequesterID.value);
                console.log(form.elements.Attributes.value);
                console.log(form.elements.LoA.value);
                form.submit();
            }
        },
        async getSupportedCountries() {
            this.spinner.loading = true;
            await this.eidasService.getSupportedCountries()
            .then(countriesDto => {
                if (countriesDto.status === 'OK') {
                    console.log(countriesDto.data.public);
                    let allowedCountries = countriesDto.data.public;
                    if (allowedCountries.length > 0) {
                        this.countries = this.allCountries.filter(item => allowedCountries.includes(item.code));
                    }

                } else {
                    this.modal.errorModalTitle = countriesDto.error.errorModalTitle;
                    this.modal.errorModalBody = countriesDto.error.errorModalBody;

                    this.showErrorModal();
                    setTimeout(() => {
                        this.hideErrorModal()
                    }, 4000)

                }
            }).finally(() => {
                this.spinner.loading = false;
            })
        },
        showErrorModal() {
            this.$modal.show('errorModal');
        },
        hideErrorModal() {
            this.$modal.hide('errorModal');
        },
        startClock() {
            setInterval(function () {
                document.getElementById('clockId').innerHTML = new Date().toString();
            }, 1000);
        },
        paramsSerializer(params) {
            return Object.entries(Object.assign({}, params)).map(([key, value]) => {
                return value ? `${key}=${value}` : null
            }).filter(Boolean).join('&');
        },
        handleCoreAttributes() {
            let params = this.params.core;
            return Object.entries(Object.assign({}, params)).map(([key, value]) => {
                return value ? `${value}` : null
            }).filter(Boolean).join(' ');
        },
        handleOptAttributes() {
            let params = this.params.opt;
            return Object.entries(Object.assign({}, params)).map(([key, value]) => {
                return value !== undefined && value !== null && value.length > 0 ? `${value[0]}` : null
            }).filter(Boolean).join(' ');
        },
        handleLoa() {
            let loa = this.params.levelOfAssurance;
            switch (loa) {
                case 'A':
                    return 'LOW';
                case 'B':
                    return 'LOW';
                case 'C':
                    return 'SUBSTANTIAL';
                case 'D':
                    return 'SUBSTANTIAL';
                case 'E':
                    return 'HIGH';
                default:
                    return 'SUBSTANTIAL';
            }
        },
    },
    mounted() {
        this.startClock();
        this.getSupportedCountries();
    }
}

