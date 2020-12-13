import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateClassComponent } from './create-class/create-class.component';

import { HttpClientModule } from '@angular/common/http';
import { EncryptionService } from './encryption.service';
import { LehrerViewComponent } from './lehrer-view/lehrer-view.component';
import { TeacherAuthComponent } from './teacher-auth/teacher-auth.component';
import { StudentViewComponent } from './student-view/student-view.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateClassComponent,
    LehrerViewComponent,
    TeacherAuthComponent,
    StudentViewComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [HttpClientModule, EncryptionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
