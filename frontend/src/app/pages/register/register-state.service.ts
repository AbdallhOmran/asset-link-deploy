import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CompanyInfo {
  companyName: string;
  industry: string;
  companySize: string;
  country: string;
  website?: string;
}

export interface ContactDetails {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone?: string;
}

export interface AccountSetup {
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface RegisterFormData {
  company: CompanyInfo;
  contact: ContactDetails;
  account: AccountSetup;
}

const initialData: RegisterFormData = {
  company: { companyName: '', industry: '', companySize: '', country: 'United States', website: '' },
  contact: { firstName: '', lastName: '', jobTitle: '', email: '', phone: '' },
  account: { password: '', confirmPassword: '', agreeTerms: false },
};

@Injectable({
  providedIn: 'root',
})
export class RegisterStateService {
  private formDataSubject = new BehaviorSubject<RegisterFormData>(initialData);
  public formData$: Observable<RegisterFormData> = this.formDataSubject.asObservable();

  // matches: router.post('/register-company', authController.registerCompany) in auth.routes.js
  private registerUrl = 'http://localhost:3000/api/auth/register-company';

  constructor(private http: HttpClient) {}

  get currentData(): RegisterFormData {
    return this.formDataSubject.value;
  }

  updateCompanyInfo(info: Partial<CompanyInfo>): void {
    const current = this.currentData;
    this.formDataSubject.next({ ...current, company: { ...current.company, ...info } });
  }

  updateContactDetails(contact: Partial<ContactDetails>): void {
    const current = this.currentData;
    this.formDataSubject.next({ ...current, contact: { ...current.contact, ...contact } });
  }

  updateAccountSetup(account: Partial<AccountSetup>): void {
    const current = this.currentData;
    this.formDataSubject.next({ ...current, account: { ...current.account, ...account } });
  }

  reset(): void {
    this.formDataSubject.next(initialData);
  }

  // ✅ fixed: now actually calls the backend instead of a fake setTimeout.
  // maps the front-end wizard fields to what auth.controller.js's
  // registerCompany actually expects (companyName, companyEmail, phoneNumber,
  // password, confirmPassword, companyAddress, commercialRegistrationNumber)
  submitRegistration(): Observable<any> {
    const { company, contact, account } = this.currentData;

    const payload = {
      companyName: company.companyName,
      companyEmail: contact.email,
      phoneNumber: contact.phone,
      password: account.password,
      confirmPassword: account.confirmPassword,
      companyAddress: company.country, // TODO: confirm mapping with backend field if a dedicated address field exists
    };

    return this.http.post(this.registerUrl, payload);
  }
}