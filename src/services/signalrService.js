import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = null;
    }

    startConnection(token) {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            return Promise.resolve();
        }

        // Initialize the connection
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`http://${window.location.hostname}:5000/active`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        return this.connection.start()
            .then(() => {
                console.log("SignalR Connected!");
            })
            .catch(err => {
                console.error("SignalR Connection Error: ", err);
                // Retry or throw logic? 
                // We'll let automatic reconnect handle drops, but initial fail needs handling manually if critical.
            });
    }

    stopConnection() {
        if (this.connection) {
            this.connection.stop();
            this.connection = null;
        }
    }

    on(eventName, callback) {
        if (this.connection) {
            this.connection.on(eventName, callback);
        }
    }

    off(eventName) {
        if (this.connection) {
            this.connection.off(eventName);
        }
    }
}

const signalRService = new SignalRService();
export default signalRService;
