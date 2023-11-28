import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormArray,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css'],
})
export class SearchMovieComponent implements OnInit {
  movieForm = this.formBuilder.group({
    movieDetails: this.formBuilder.array([]),
    type: ['series', Validators.required],
    année_de_sortie: ['', rangeDateValidator(1900, 2023)],
    fiche: ['', Validators.required],
  });

  defaultFiche() {
    this.movieForm.patchValue({
      fiche: 'courte',
    });
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    // get Observable from FormGroup
    this.movieForm.valueChanges
      // listen to value change
      .subscribe((value) => {
        console.log('movie form value changes : ', value);
      });
  }

  get movieDetails(): FormArray {
    const detailsForm = this.formBuilder.group(
      {
        titre: ['', Validators.required],
        identifiant: ['', Validators.required],
      },
      { validator: isRequiredValidator('titre', 'identifiant') }
    );

    const movieDetails = this.movieForm.get('movieDetails') as FormArray;
    movieDetails.push(detailsForm);

    return movieDetails;
  }

  onSubmit() {
    // Get form value as JSON object
    console.log('movie form submitted : ', this.movieForm.value);
  }
}

export function rangeDateValidator(
  minYear: number,
  maxYear: number
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = control.value < minYear || control.value > maxYear;
    return forbidden ? { rangeError: { min: minYear, maxYear } } : null;
  };
}

export function isRequiredValidator(
  title: string,
  identifiant: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const titleControl = control.get(title)?.value;
    const identifiantControl = control.get(identifiant)?.value;
    console.log('is required validator');
    if (!titleControl && !identifiantControl) {
      return { isRequired: { value: titleControl } };
    }
    return null;
  };
}
