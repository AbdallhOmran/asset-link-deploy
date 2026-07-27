import { Component, EventEmitter, Input, Output } from '@angular/core';

// Matches the "Images & Media" upload step:
// - Big dashed dropzone with upload icon + "Click to upload photos"
// - Below it, a grid of dashed placeholder squares with a "+" icon
// - Once a photo is added, its square shows the actual image with a remove (x) button
@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
})
export class ImageGalleryComponent {
  @Input() images: string[] = []; // preview URLs (existing images or local object URLs)
  @Input() maxImages = 8;

  // Emits the raw FileList so the parent component/service can handle the actual upload
  @Output() filesSelected = new EventEmitter<FileList>();
  // Emits the updated images array whenever an image is removed locally
  @Output() imagesChange = new EventEmitter<string[]>();

  get remainingSlots(): number {
    return Math.max(this.maxImages - this.images.length, 0);
  }

  get placeholderSlots(): number[] {
    // Show at least a few empty dashed placeholders, capped by remaining slots
    return Array(Math.min(this.remainingSlots, 4)).fill(0);
  }

  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.filesSelected.emit(input.files);

      // Local preview only - actual upload/storage handled by parent via filesSelected
      Array.from(input.files).forEach((file) => {
        if (this.images.length < this.maxImages) {
          const previewUrl = URL.createObjectURL(file);
          this.images = [...this.images, previewUrl];
        }
      });
      this.imagesChange.emit(this.images);
    }
    input.value = ''; // reset so the same file can be re-selected later
  }

  removeImage(index: number) {
    this.images = this.images.filter((_, i) => i !== index);
    this.imagesChange.emit(this.images);
  }
}