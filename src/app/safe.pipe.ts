import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safe', pure: true })

export class SafePipe implements PipeTransform { 
  constructor(private sanitizer: DomSanitizer) {}

  transform(url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}