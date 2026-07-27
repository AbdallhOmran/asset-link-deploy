import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-widget',
  templateUrl: './score-widget.component.html',
  styleUrls: ['./score-widget.component.css'],
})
export class ScoreWidgetComponent {
  @Input() score: number = 0;
  @Input() title: string = '';
}
