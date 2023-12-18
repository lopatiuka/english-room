import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  nameControl!: FormControl;
  error: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.nameControl = this.formBuilder.control('', Validators.required);

    if(this.data) {
      this.error = this.data.maxLengthError;
    }
  }

  close() {
    this.dialogRef.close(this.nameControl.value);
  }
}
