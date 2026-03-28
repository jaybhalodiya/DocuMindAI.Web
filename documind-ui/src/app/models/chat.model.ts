import { SafeHtml } from "@angular/platform-browser";

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
}

export interface Message {
  text: string | SafeHtml;
  type: 'user' | 'ai';
  timestamp: Date;
  sources?: string[];
}