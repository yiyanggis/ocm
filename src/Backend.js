import 'whatwg-fetch';
import {store} from './DataStore';


const env = process.env.REACT_APP_ENV;
var envModule;
if (env === undefined) {
    envModule = 'dev';
} else {
    envModule = env;
}
console.log('####### ENV=%s #######', envModule);
export const CONFIG = require('./config/' + envModule).default;


export default class Backend {

    constructor() {
        this.apiServer = CONFIG.api_server_url;
        this.apiKey = CONFIG.api_key;
    }

    /**
     * Load data from the backend
     */
    load(options={okHandler: function(e) {}, errorHandler: function(e){}})  {
        store.uiState.initiateDataLoad();

        const latlng = options.center[1] + ',' + options.center[0];
        const radius = options.radius;

        const api_url = this.apiServer + '/featureset?api_key=' + this.apiKey + '&latlng=' + latlng + '&r=' + radius;

        fetch(api_url)
            .then(function(response) {
                if (response.status !== 200) {
                    store.uiState.completeDataLoad();
                    options.errorHandler(response);
                } else {
                    return response.json();
                }
            })
            .then(function(json) {
                store.uiState.completeDataLoad();
                console.log("Raw data loaded from backend", json);
                options.okHandler(json);
            })
            .catch(function(ex) {
                store.uiState.completeDataLoad();
                console.log('Backend.load() failed', ex)
        });
    }

    /**
     * Save geojson data to the backend
     */
    save(geojson, opts={okHandler: function(e) {}, errorHandler: function(e){}}) {
        console.log('this', this.apiServer);
        console.log('Backend.save()', geojson);
        const apiUrl = this.apiServer + '/featureset?api_key=' + this.apiKey;
        console.log(apiUrl);
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: geojson
        }).then(function(response) {
            console.log('Backend.save() HTTP status: ', response.status);
            if (response.status === 200) {
                opts.okHandler(response.json);
                return response;
            } else {
                opts.errorHandler(response);
            }
        }).catch(function(ex) {
            console.log('Backend.load() failed', ex);
            opts.errorHandler(ex);
        });
    }
}