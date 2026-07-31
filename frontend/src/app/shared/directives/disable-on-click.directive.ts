import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDisableOnClick]'
})
export class DisableOnClickDirective {
  @Input() disableTimeMs = 1500; // Default disable time

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click')
  onClick() {
    this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.7');
    
    // Automatically re-enable after the specified time
    setTimeout(() => {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
      this.renderer.removeStyle(this.el.nativeElement, 'pointer-events');
      this.renderer.removeStyle(this.el.nativeElement, 'opacity');
    }, this.disableTimeMs);
  }
}
