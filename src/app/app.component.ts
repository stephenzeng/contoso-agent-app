import { Component, OnDestroy } from '@angular/core';
import { AgentService } from './agent.service';

interface ChatMessage {
  from: string;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  title = 'contoso-agent-app';
  isAgentConnected = false;
  messages: ChatMessage[] = [];
  userAccessToken: string = '';
  private ws?: WebSocket;


  constructor(private agentService: AgentService) {
    this.messages = [
      { from: 'system', text: 'Please copy and paste your user access token to connect the agent' }
    ];
  }

  sendMessage(message: string) {
    if (!message) return;

    if (!this.isAgentConnected) { this.connectAgent(message); }
    else {
      this.messages.push({ from: 'user', text: message });
      this.agentService.sendMessage(message);
    }
  }

  async connectAgent(userAccessToken: string) {
    this.messages.push({ from: 'system', text: 'Connecting to agent...' });

    this.userAccessToken = userAccessToken;
    await this.agentService.getAgentToken();
    const messageStreamUrl = await this.agentService.getAgentStreamUrl();
    console.log('Message stream URL:', messageStreamUrl);

    this.subscribeToMessageStream(messageStreamUrl);
    await this.agentService.startConversation();
  }

  private subscribeToMessageStream(messageStreamUrl: string) {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(messageStreamUrl);
    this.ws.onmessage = (event) => this.handleWebSocketMessage(event)
    this.ws.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
    this.ws.onclose = () => {
      this.ws = undefined;
    };
  }

  private handleWebSocketMessage(event: MessageEvent) {
    const response = JSON.parse(event.data);
    const activity = response.activities[0];
    console.log('Received activity:', activity);

    if (activity?.type == "message") {
      if (this.isAgentConnected && activity?.text && activity?.from?.role == "bot") {
        this.messages.push({ from: activity?.from?.role, text: activity.text });
      }

      const attachment = activity.attachments[0];
      console.log('attachment:', attachment);
      if (attachment?.contentType == "application/vnd.microsoft.card.oauth") {
        const tokenExchangeResourceId = attachment.content?.tokenExchangeResource?.id;
        console.log('tokenExchangeResourceId:', tokenExchangeResourceId);

        if (tokenExchangeResourceId) {
          this.agentService.signInUser(tokenExchangeResourceId, this.userAccessToken).then(res => {
            console.log('signInUser response:', res);
            this.isAgentConnected = true;
          });
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
