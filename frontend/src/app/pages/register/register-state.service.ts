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
  company: {
    companyName: '',
    industry: '',
    companySize: '',
    country: 'United States',
    website: ''
  },
  contact: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: ''
  },
  account: {
    password: '',
    confirmPassword: '',
    agreeTerms: false
  }
};

@Injectable({
  providedIn: 'root'
})
export class RegisterStateService {
  private formDataSubject = new BehaviorSubject<RegisterFormData>(initialData);
  public formData$: Observable<RegisterFormData> = this.formDataSubject.asObservable();

  get currentData(): RegisterFormData {
    return this.formDataSubject.value;
  }

  updateCompanyInfo(info: Partial<CompanyInfo>): void {
    const current = this.currentData;
    this.formDataSubject.next({
      ...current,
      company: { ...current.company, ...info }
    });
  }

  updateContactDetails(contact: Partial<ContactDetails>): void {
    const current = this.currentData;
    this.formDataSubject.next({
      ...current,
      contact: { ...current.contact, ...contact }
    });
  }

  updateAccountSetup(account: Partial<AccountSetup>): void {
    const current = this.currentData;
    this.formDataSubject.next({
      ...current,
      account: { ...current.account, ...account }
    });
  }

  reset(): void {
    this.formDataSubject.next(initialData);
  }

  /**
   * Submit complete registration data to Backend API
   */
  submitRegistration(): Observable<{ success: boolean; message: string }> {
    const payload = this.currentData;
    console.log('Submitting registration payload:', payload);

    // TODO: Replace with actual AuthService HTTP call
    // return this.http.post('/api/v1/auth/register', payload);

    return new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next({ success: true, message: 'Registration initial step completed successfully.' });
        subscriber.complete();
      }, 800);
    });
  }
}
