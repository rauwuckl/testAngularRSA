import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateClassComponent } from './create-class/create-class.component'
import { IndexComponent } from './index/index.component';
import { LehrerViewComponent } from './lehrer-view/lehrer-view.component';
import { StudentViewComponent } from './student-view/student-view.component';
import { TestListComponent } from './test-list/test-list.component';

const routes: Routes = [
  {path: 'index', component: IndexComponent},
  {path: 'create', component: CreateClassComponent},
  {path: 'lehrer/:secret', component: LehrerViewComponent},
  {path: 'student/:secret', component: StudentViewComponent},
  {path: '', component: TestListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {  }
