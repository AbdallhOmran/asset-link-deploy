import { Component } from '@angular/core';
import {Package,MapPin, Star} from 'lucide-angular';
@Component({
  selector: 'app-listed-assets',
  templateUrl: './listed-assets.component.html',
  styleUrls: ['./listed-assets.component.css']
})
export class ListedAssetsComponent {
  readonly Package = Package;
readonly MapPin = MapPin;
readonly Star = Star;
 assets = [
    {
      name: 'Caterpillar 390F Excavator',
      category: 'Excavator',
      rate: '$1,850',
      location: 'Portland, OR',
      status: 'Rented',
      rating: 4.8
    },
    {
      name: 'Liebherr LTM 1100 Crane',
      category: 'Mobile Crane',
      rate: '$3,200',
      location: 'Seattle, WA',
      status: 'Available',
      rating: 4.9
    },
    {
      name: 'Toyota 8FBU25 Forklift',
      category: 'Forklift',
      rate: '$420',
      location: 'Denver, CO',
      status: 'Rented',
      rating: 4.6
    },
    {
      name: 'Komatsu D65EX Bulldozer',
      category: 'Bulldozer',
      rate: '$2,100',
      location: 'Phoenix, AZ',
      status: 'Maintenance',
      rating: 4.7
    },
    {
      name: 'Genie S-125 Boom Lift',
      category: 'Aerial Platform',
      rate: '$780',
      location: 'Austin, TX',
      status: 'Available',
      rating: 4.5
    }
  ];
}
