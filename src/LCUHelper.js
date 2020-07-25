// Imports
const https = require('https');
const axios = require('axios');
const getJSONValue = require('lodash/get');
// 
const LCUConnection = require('./LCUConnection');

class LCUHelper {
    constructor(connectorInfo) {
        this.connectionInfo = new LCUConnection(connectorInfo);
    }

    getInfo() {
        return this.connectionInfo;
    }

    getCreds() {
        return [
            getJSONValue(this.connectionInfo, "protocol"),
            getJSONValue(this.connectionInfo, "address"),
            getJSONValue(this.connectionInfo, "port"),
            getJSONValue(this.connectionInfo, "username"),
            getJSONValue(this.connectionInfo, "password")
        ].join(":");

    }

    getLCUAuthentication() {
        return `Basic ${Buffer.from(
            [
                getJSONValue(this.connectionInfo, "username"),
                ":",
                getJSONValue(this.connectionInfo, "password"),
            ].join("")
        ).toString('base64')}`
    }

    getBaseUrl() {
        return [
            getJSONValue(this.connectionInfo, "protocol"),
            "://",
            getJSONValue(this.connectionInfo, "address"),
            ":",
            getJSONValue(this.connectionInfo, "port"),
        ].join("");
    }

    getRequestOptions() {
        return {
            headers: {
                "Authorization": this.getLCUAuthentication(),
                "Accept": "application/json"
            },
            httpsAgent: this.getModifiedHTTPAgent()
        }
    }

    getModifiedHTTPAgent() {
        return new https.Agent({
            rejectUnauthorized: false
        });
    }

    async getRecentlyPlayed() {
        return await axios.get(this.getBaseUrl() + "/lol-match-history/v1/recently-played-summoners",
            this.getRequestOptions()
        )
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                return error["response"];
            });
    }

    async sendInvite(summonerId) {
        return await axios.post(this.getBaseUrl() + "/lol-lobby/v2/lobby/invitations",
            [{ "toSummonerId": summonerId }],
            this.getRequestOptions()
        )
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                return error["response"];
            });
    }
}

module.exports = LCUHelper;