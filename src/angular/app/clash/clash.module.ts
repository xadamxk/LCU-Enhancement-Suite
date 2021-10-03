import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ClashRoutingModule } from './clash-routing.module';
import { ClashComponent } from './clash.component';

@NgModule({
  declarations: [ClashComponent],
  imports: [CommonModule, SharedModule, ClashRoutingModule]
})
export class ClashModule { }
