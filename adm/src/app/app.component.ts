import { Component } from '@angular/core';
import { GlobalService } from './core/global.service';
import { RouterModule } from '@angular/router';
import { PageService } from './core/page.service';
import * as moment from 'moment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'adm';
  logged: boolean = false;
  user: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    public global: GlobalService,
    public pageService: PageService,
    public routerModule: RouterModule,
    private breakpointObserver: BreakpointObserver,
  ) {

    console.log("routerModule : ", routerModule);

    // Moment configuration
    moment.locale('es');

    // (+) User

    this.global.getUserAsObservable().subscribe((result) => {
      this.logged = result;
      this.user = this.global.getUser();
      if (!this.logged) {
        this.pageService.navigateRoute("/login");
      } else this.pageService.navigateRoute("/subproducts");
    });
    this.global.checkUser();

    // (-) User


  }
  changePassword() {
    let user = this.global.getUser()
    this.pageService.navigateRoute("/administrators/" + user.id + "/changePassword");
  }
  logout() {
    this.global.removeUser();
  }

}
