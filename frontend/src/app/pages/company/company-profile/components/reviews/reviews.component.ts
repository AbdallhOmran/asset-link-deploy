import { Component } from '@angular/core';
import { Star } from 'lucide-angular';


@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
readonly Star = Star;

  reviews = [
    {
      initials: 'JR',
      color: 'bg-blue-500',
      name: 'James Reyes',
      company: 'Apex Construction',
      date: 'Jul 2, 2025',
      rating: 5,
      comment:
        'Extremely professional. Equipment arrived on time and in perfect condition. The escrow process was seamless.'
    },
    {
      initials: 'LP',
      color: 'bg-pink-500',
      name: 'Linda Park',
      company: 'Meridian Infrastructure',
      date: 'Jun 18, 2025',
      rating: 5,
      comment:
        "Best equipment rental experience we've had. TerraEquip's fleet is well-maintained and documentation was thorough."
    },
    {
      initials: 'CR',
      color: 'bg-emerald-500',
      name: 'Carlos Ruiz',
      company: 'Summit Engineering',
      date: 'May 29, 2025',
      rating: 4,
      comment:
        'Good overall experience. Minor delay on pickup but communication was excellent and they resolved it quickly.'
    }
  ];
}
