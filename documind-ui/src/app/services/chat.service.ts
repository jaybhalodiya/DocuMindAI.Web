import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, retry, throwError } from 'rxjs';
import { ChatRequest, ChatResponse } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private http = inject(HttpClient);

  private readonly API_URL = 'https://localhost:7083/api/chat';
  
  ask(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.API_URL}/ask`, { message }).pipe(
      timeout(45000), // 45s timeout for AI generation
      retry(1),       // Auto-retry once on network glitch
      catchError(err => throwError(() => new Error(err.error?.message || 'Server Timeout')))
    );
  }

  ingest(): Observable<any> {
    return this.http.post(`${this.API_URL}/ingest`, {});
  }
}
