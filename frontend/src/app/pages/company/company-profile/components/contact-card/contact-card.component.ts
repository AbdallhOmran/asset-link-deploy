import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent {
 contact = {
    email: 'contact@terraequip.com',
    phone: '+1 (503) 555-0182',
    website: 'terraequip.com',
    address: '1240 NW Industrial Ave, Portland, OR 97201'
  };
}
