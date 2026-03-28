import { Component } from '@angular/core';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatBoxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'documind-ui';
}
