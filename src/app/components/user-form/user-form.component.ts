import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    
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
    if (this.userForm.valid) {
      alert('Form Submitted!');
      console.log('Form Data:', this.userForm.value);

    this.userForm.reset();

    this.phoneNumbers.clear();
    
    this.addPhone();

    } else {
      alert('Form is invalid. Please check the fields.'); 
      console.log('Form Invalid');
    }
  }
}
