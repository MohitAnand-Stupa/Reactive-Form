import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import * as countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  userForm: FormGroup;
  submitted = false;
  countryList: { code: string; name: string }[] = [];
  submittedUsers: any[] = []; 
  editIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.countryList = Object.entries(countries.getNames('en')).map(([code, name]) => ({
      code,
      name
    }));

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        city: ['', Validators.required],
        country: ['', Validators.required]
      }),
      phoneNumbers: this.fb.array([this.createPhoneField()])
    });
  }

  get phoneNumbers(): FormArray {
    return this.userForm.get('phoneNumbers') as FormArray;
  }

  get addressGroup(): FormGroup {
    return this.userForm.get('address') as FormGroup;
  }

  createPhoneField() {
    return this.fb.control('', [Validators.required, Validators.pattern('^[0-9]{10}$')]);
  }

  addPhone() {
    this.phoneNumbers.push(this.createPhoneField());
  }

  removePhone(index: number) {
    this.phoneNumbers.removeAt(index);
  }

  onSubmit() {
    this.submitted = true;

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData = this.userForm.value;

    if (this.editIndex !== null) {
      
      this.submittedUsers[this.editIndex] = userData;
      this.editIndex = null;
    } else {
      
      this.submittedUsers.push(userData);
    }

    this.resetForm();
  }

  editUser(index: number) {
    const user = this.submittedUsers[index];
    this.editIndex = index;

    this.resetForm();

    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      address: {
        city: user.address.city,
        country: user.address.country
      }
    });

    user.phoneNumbers.forEach((phone: string) => {
      this.phoneNumbers.push(this.fb.control(phone, [Validators.required, Validators.pattern('^[0-9]{10}$')]));
    });
  }

  deleteUser(index: number) {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');

    if (!confirmDelete) return;

    this.submittedUsers.splice(index, 1);

    
    if (this.editIndex === index) {
      this.resetForm();
      this.editIndex = null;
    } else if (this.editIndex !== null && index < this.editIndex) {
      
      this.editIndex -= 1;
    }
  }

  getCountryName(code: string) {
    const country = this.countryList.find(c => c.code === code);
    return country ? country.name : '';
  }

  private resetForm() {
    this.userForm.reset();
    this.phoneNumbers.clear();
    this.addPhone();
    this.submitted = false;
  }
}
