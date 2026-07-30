import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export interface CompanyInfo {
  companyName: string;
  companyType: string;
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
  company: { companyName: '', companyType: 'Both', industry: '', companySize: '', country: 'United States', website: '' },
  contact: { firstName: '', lastName: '', jobTitle: '', email: '', phone: '' },
  account: { password: '', confirmPassword: '', agreeTerms: false },
};

@Injectable({
  providedIn: 'root',
})
export class RegisterStateService {
  private formDataSubject = new BehaviorSubject<RegisterFormData>(initialData);
  public formData$: Observable<RegisterFormData> = this.formDataSubject.asObservable();
  private registeredEmail: string = '';

  constructor(private authService: AuthService) {}

  get currentData(): RegisterFormData {
    return this.formDataSubject.value;
  }

  getRegisteredEmail(): string {
    return this.registeredEmail || this.currentData.contact.email;
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
    this.registeredEmail = '';
  }

  submitRegistration(): Observable<any> {
    const payload = this.currentData;

    const apiPayload = {
      companyName: payload.company.companyName,
      companyEmail: payload.contact.email,
      phoneNumber: payload.contact.phone || '',
      password: payload.account.password,
      confirmPassword: payload.account.confirmPassword,
      companyAddress: payload.company.country,
      companyType: payload.company.companyType
    };

    this.registeredEmail = payload.contact.email;

    return this.authService.register(apiPayload);
  }
}