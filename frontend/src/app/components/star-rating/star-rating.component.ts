import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() rating: number = 4;
  @Input() maxStars: number = 5;
  @Input() readonly: boolean = false;
  @Input() showLabel: boolean = true;
  @Output() ratingChange = new EventEmitter<number>();

  get stars(): number[] {
    return Array(this.maxStars).fill(0);
  }

  setRating(newRating: number) {
    if (!this.readonly) {
      this.rating = newRating;
      this.ratingChange.emit(this.rating);
    }
  }
}
