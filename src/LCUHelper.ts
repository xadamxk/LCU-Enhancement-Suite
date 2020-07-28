// Imports
const https = require('https');
const axios = require('axios');
const getJSONValue = require('lodash/get');
// 
const LCUConnection = require('./LCUConnection');

//TODO: Refactor how API gets called (all the same code)

class LCUHelper {
    private connectionInfo: Object;
    constructor(connectorInfo: Object) {
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
            .then(function (response: any) {
                return response;
            })
            .catch(function (error: { [x: string]: any; }) {
                return error["response"];
            });
    }

    async getInviteGroups() {
        return await axios.get(this.getBaseUrl() + "/lol-chat/v1/friend-groups",
            this.getRequestOptions()
        )
            .then(function (response: any) {
                return response;
            })
            .catch(function (error: { [x: string]: any; }) {
                return error["response"];
            });
    }

    async sendInvite(summonerIds: any[]) {
        const invitees = summonerIds.map((summonerId: number) => {
            return { "toSummonerId": summonerId }
        })
        return await axios.post(this.getBaseUrl() + "/lol-lobby/v2/lobby/invitations",
            invitees,
            this.getRequestOptions()
        )
            .then(function (response: any) {
                return response;
            })
            .catch(function (error: { [x: string]: any; }) {
                return error["response"];
            });
    }

    async getFriends() {
        return await axios.get(this.getBaseUrl() + "/lol-chat/v1/friends",
            this.getRequestOptions()
        )
            .then(function (response: any) {
                return response;
            })
            .catch(function (error: { [x: string]: any; }) {
                return error["response"];
            });
    }
}

module.exports = LCUHelper;