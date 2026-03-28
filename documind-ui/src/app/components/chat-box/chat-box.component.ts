import { Component, signal, viewChild, ElementRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/chat.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent {
  private chatService = inject(ChatService);
  private sanitizer = inject(DomSanitizer);

  isOpen = signal(false);
  isLoading = signal(false);
  messages = signal<Message[]>([
    { text: 'Hello! I am DocuMind. Ask me about your uploaded PDFs.', type: 'ai', timestamp: new Date() }
  ]);
  userInput = signal('');

  private scrollContainer = viewChild<ElementRef>('scrollFrame');

  constructor() {
    effect(() => {
      this.messages();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  toggleChat() {
    this.isOpen.update(v => !v);
  }

  sendMessage()
  {
    const text = this.userInput().trim();
    if (!text || this.isLoading()) return;

    this.messages.update(prev => [...prev, { text, type: 'user', timestamp: new Date() }]);
    this.userInput.set('');
    this.isLoading.set(true);

    this.chatService.ask(text).subscribe({
      next: async (res) => {
        const rawHtml = await marked.parse(res.answer);
        const safeHtml = this.sanitizer.bypassSecurityTrustHtml(rawHtml);

        this.messages.update(prev => [...prev, { 
          text: safeHtml, 
          type: 'ai', 
          timestamp: new Date(),
          sources: res.sources 
        }]);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messages.update(prev => [...prev, { 
          text: 'Sorry, I encountered an error connecting to the server.', 
          type: 'ai', 
          timestamp: new Date() 
        }]);
        this.isLoading.set(false);
      }
    });
  }

  private scrollToBottom() {
    const el = this.scrollContainer()?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
  
}
