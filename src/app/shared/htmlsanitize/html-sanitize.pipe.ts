import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Pipe({
  name: 'htmlSanitize'
})
export class HTMLSanitizePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer ) {}
  transform(value: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
