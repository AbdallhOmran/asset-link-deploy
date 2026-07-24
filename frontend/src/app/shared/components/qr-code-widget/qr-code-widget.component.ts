import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-qr-code-widget',
  templateUrl: './qr-code-widget.component.html',
  styleUrls: ['./qr-code-widget.component.css'],
})
export class QrCodeWidgetComponent {
  @Input() title: string = '';
  @Input() assetId: string = '';
}
