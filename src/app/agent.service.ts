import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  headers: HttpHeaders = new HttpHeaders();
  conversationId: string = '';
  userId: string = '';

  // Copy the connection string from your Copilot Studio agent native app channel to the agentTokenUrl below
  agentTokenUrl = '';
  directLineUrl = 'https://directline.botframework.com/v3/directline/conversations';

  constructor(private http: HttpClient) {
    this.userId = this.generateGuid();
  }

  async getAgentToken(): Promise<string> {
    const res = await this.get(this.agentTokenUrl);
    console.log('Agent token:', res.token);

    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${res.token}`
    });

    return res.token;
  }

  async getAgentStreamUrl(): Promise<string> {
    const res = await this.post(this.directLineUrl, null);
    this.conversationId = res.conversationId;
    return res.streamUrl;
  }

  async startConversation(): Promise<any> {
    console.log('startConversation');
    return await this.post(`${this.directLineUrl}/${this.conversationId}/activities`,
      {
        "channelId": "webchat",
        "entities": [
          {
            "requiresBotState": true,
            "supportsListening": true,
            "supportsTts": true,
            "type": "ClientCapabilities"
          }
        ],
        "from": {
          "id": this.userId,
          "role": "user"
        },
        "name": "startConversation",
        "type": "event"
      });
  }

  async sendMessage(message: string): Promise<any> {
    console.log('sendMessage');
    return await this.post(`${this.directLineUrl}/${this.conversationId}/activities`,
      {
        "from": {
          "id": this.userId,
          "role": "user"
        },
        "text": message,
        "type": "message"
      });
  }

  async signInUser(tokenExchangeResourceId: string, connctionName: string, userAccessToken: string): Promise<any> {
    console.log('signInUser');
    return await this.post(`${this.directLineUrl}/${this.conversationId}/activities`,
      {
        "channelId": "directline",
        "from": {
          "id": this.userId,
          "role": "user"
        },
        "name": "signin/tokenExchange",
        "serviceUrl": "https://directline.botframework.com/",
        "type": "invoke",
        "value": {
          "connectionName": connctionName,
          "id": tokenExchangeResourceId,
          "token": userAccessToken
        }
      }
    );
  }

  async get(apiUrl: string): Promise<any> {
    return await lastValueFrom(this.http.get(apiUrl, { headers: this.headers }));
  }

  async post(apiUrl: string, body: any): Promise<any> {
    return await lastValueFrom(this.http.post(apiUrl, body, { headers: this.headers }));
  }

  generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
