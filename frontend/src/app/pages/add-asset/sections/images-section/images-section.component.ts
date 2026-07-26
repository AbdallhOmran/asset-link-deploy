import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-images-section',
  templateUrl: './images-section.component.html',
})
export class ImagesSectionComponent {
  @Output() imagesChange = new EventEmitter<string[]>();

  images: string[] = [];

  onFilesSelected(files: FileList): void {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.images = [...this.images, e.target?.result as string];
        this.imagesChange.emit(this.images);
      };
      reader.readAsDataURL(file);
    });
  }

  onImagesChange(images: string[]): void {
    this.images = images;
    this.imagesChange.emit(images);
  }
}
