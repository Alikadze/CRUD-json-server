import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, share, switchMap, tap } from 'rxjs';
import { User } from '../models/users';

export const AgeValidator = (control: AbstractControl<any>): any => {
  const birthDate = new Date(control.value);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  return age >= 18 ? null : { age: true };
};

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgIf
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
})
export class UserCreateComponent {
  userService = inject(UserService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
    lastName: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
    birthDate: new FormControl('',[Validators.required, AgeValidator]),
    number: new FormControl(),
    address: new FormGroup({
      city: new FormControl(''),
      street: new FormControl(''),
    }),
    skills: new FormArray<any>([
      new FormGroup({
        skill: new FormControl(''),
      }),
    ]),
    experiences: new FormArray([
      new FormGroup({
        place: new FormControl(''),
        position: new FormControl(''),
        years: new FormControl('')
      }),
    ]),
  });

  user$ = this.route.params.pipe(
    map((params) => params['id']),
    switchMap(id => {
      if (id) {
        return this.userService.getUser(id);
      } else {
        return [];
      }
    }),
    tap((user) => {
      if (user) {
        this.form.patchValue(user);
      }
    }),
    share()
  );
    
  onSubmit () {
    if (this.form.invalid) {
    console.log('Invalid Info');

    this.form.markAllAsTouched();
    
    return;
    }

    const {
      id,
      name,
      lastName,
      number,
      birthDate,
      skills,
      experiences,
      address
      
    } = this.form.value;

    

    const randomId = String(Math.floor(Math.random() * 1000));

    const user = {
      id: randomId,
      name,
      lastName,
      number,
      birthDate,
      skills,
      experiences,
      address
    } as User;

    if (id) {
      this.userService.updateUser({
        id,
        name,
        number,
        lastName,
        birthDate,
        skills,
        experiences,
        address
      } as User)
        .subscribe((res) => {
          this.router.navigate(['/list'])
        })
    } else {
      this.userService.createUser(user).subscribe((res) => {
        this.router.navigate(['/list']);
      });
    }

  };

  get skills(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  addSkill() {
    const newControl = new FormGroup({
      skill: new FormControl('')
    });
    this.skills.push(newControl);
  }

  removeSkill(i: number) {
    this.skills.removeAt(i);
  }

  get experiences(): FormArray {
    return this.form.get('experiences') as FormArray;
  }

  addExperience() {
    const newControl = new FormGroup({
      place: new FormControl(''),
      position: new FormControl(''),
      years: new FormControl('')
    });
    this.experiences.push(newControl);
  }

  removeExperience(i: number) {
    this.experiences.removeAt(i);
  }  
}

