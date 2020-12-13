import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateClassComponent } from './create-class/create-class.component'
import { LehrerViewComponent } from './lehrer-view/lehrer-view.component';
import { StudentViewComponent } from './student-view/student-view.component';

const routes: Routes = [
  {path: 'create', component: CreateClassComponent},
  {path: 'lehrer/:secret', component: LehrerViewComponent},
  {path: 'student/:secret', component: StudentViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {  }
