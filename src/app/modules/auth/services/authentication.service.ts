import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { delay, map } from "rxjs/operators";

import { ToastrService } from "ngx-toastr";
import { AuthModel } from "../models/auth.model";
import { environment } from "src/environments/environment";

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  windowObj: any = window;
  private readonly APIUrl = API_USERS_URL;
  //public
  private currentUser: BehaviorSubject<any>;
  private jWToken = "JWToken";
  private refToken = "RefreshToken";
  private currentUserSubject: any;
  constructor(
    private _http: HttpClient,
    private _toastrService: ToastrService
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // public get currentUserValue(): any {
  //   return this.currentUserSubject.value;
  // }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }


  isLoggedIn() {
    return true;
  }
  get isAdmin() {
    return true;
  }

  get isClient() {
    return true;
  }

  login(email: string, password: string): Observable<any> {
    var loginInfo = {
      AppId:"WEBAPP",
      DeviceToken: "null",
      Email:email,
      Password:password
    }
    return this._http.post<AuthModel>(`${API_USERS_URL}Login/Authenticate`, loginInfo);
    // return this.http.post<AuthModel>(`${API_USERS_URL}/login`, {
    //   email,
    //   password,
    // });
  }

  refreshToken(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    // ;
    var users = {
      RefreshToken: localStorage.getItem(this.refToken),
      AccessToken: localStorage.getItem(this.jWToken),
    };
    return this._http.post<any>(
      this.APIUrl + "Login/RefreshToken",
      users,
      httpOptions
    );
  }
  private saveToken(token: string, refreshToken: string): void {
    localStorage.setItem(this.jWToken, token);
    localStorage.setItem(this.refToken, refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem(this.jWToken);
  }
  logout() {
    this._http.get<any>(this.APIUrl + "Login/Revoke").subscribe((result) => {
      setTimeout(() => {
        this._toastrService.success("You have successfully Logout", "", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }, 1000);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("JWToken");
      localStorage.removeItem("RefreshToken");

      this.currentUserSubject.next(null);
    });
  }
}
