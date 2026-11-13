import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../../../interfaces/user.interfaces';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  if (confirmPassword.value && password.value !== confirmPassword.value) {
    const currentErrors = confirmPassword.errors || {};
    confirmPassword.setErrors({
      ...currentErrors,
      passwordMismatch: true,
      mismatch: true,
    });
    return { passwordMismatch: true };
  } else {
    if (confirmPassword.errors && (confirmPassword.hasError('passwordMismatch') || confirmPassword.hasError('mismatch'))) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      delete errors['mismatch'];
      confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
    return null;
  }
};

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register-page',
  styleUrl: './register-page.css',
  templateUrl: './register-page.html',
})
export class RegisterPage {

  userForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: [passwordMatchValidator] }
  );

  isFieldInvalid(fieldName: string, errorType?: string): boolean {
    const control = this.userForm.get(fieldName);
    if (!control) return false;
    const isTouchedOrDirty = control.touched || control.dirty;
    if (!isTouchedOrDirty) return false;

    if (errorType) {
      if (errorType === 'minlength') {
        return control.hasError('minlength') && !control.hasError('required');
      }
      if (errorType === 'email') {
        return control.hasError('email') && !control.hasError('required');
      }
      if (errorType === 'passwordMismatch' || errorType === 'mismatch') {
        return (control.hasError('passwordMismatch') || control.hasError('mismatch')) && !control.hasError('required');
      }
      return control.hasError(errorType);
    }

    return control.invalid;
  }

  hasError(fieldName: string, errorType: string): boolean {
    return this.isFieldInvalid(fieldName, errorType);
  }

  onSubmit() {
    if (this.userForm.valid) {
      const newUser: User = {
        id: 0,
        name: this.userForm.value.name!,
        email: this.userForm.value.email!,
        password: this.userForm.value.password!,
      };
      console.log('Usuario registrado:', newUser);
      this.userForm.reset();
    } else {
      console.log('Invalid form');
      this.userForm.markAllAsTouched();
    }
  }
}
