import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { WorldleService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wordle';

  public dayWord: any;

  private jsonSize: number = 10;

  public showBoard: boolean = false;

  public wordForm: any;

  public disabledButton: boolean = true;

  public attempts: number = 0;

  constructor(
    private _worldleService: WorldleService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.wordForm = this._formBuilder.group({
      word: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.wordForm.get('word').valueChanges.subscribe(() => {
      if (this.wordForm.get('word').errors) {
        this.disabledButton = true;
      } else {
        this.disabledButton = false;
      }
    });

    const promises: Promise<any>[] = [];
    promises.push(this.getRandomWord());
    Promise.all(promises).then(() => {
      this.dayWord = this.dayWord.word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
      this.showBoard = true;
    });
  }

  private async getRandomWord() {
    const wordAux = this._worldleService.getRandomWord(this.randomNumber());
    this.dayWord = await lastValueFrom(wordAux);
  }

  public checkWord() {
    const inputWord = this.wordForm.get('word').value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    let correctLetter = 0;
    let animationDelay = 0;

    this.wordForm.reset();
    for (let i = 0; i < inputWord.length; i++) {
      const index = this.attempts.toString() + i.toString();
      const cell = document.getElementById(index);

      if (cell !=null) {
        cell.style.transform = 'rotateX(360deg)';
        cell.style.transformStyle = 'preserve-3d';
        cell.style.transition = '0.6s ease ' + animationDelay.toString() + 'ms';
        setTimeout(() => cell.innerHTML = inputWord.charAt(i), animationDelay);
        animationDelay = animationDelay + 150;
      }

      if (this.dayWord.charAt(i) === inputWord.charAt(i)) {
        if (cell !== null) {
          cell.style.backgroundColor = '#43a047';
          correctLetter++;
          if (correctLetter === 5) {
            setTimeout(() => {
              if (confirm('ENHORABUENA, HAS ADIVINADO LA PALABRA DEL DÍA')) {
                window.location.reload();
              }
            }, 1000)
          }

        }
      } else if (this.dayWord.includes(inputWord.charAt(i))) {
        if (cell !== null) {
          cell.style.backgroundColor = '#e4a81d';
        }
      } else {
        if (cell !== null) {
          cell.style.backgroundColor = '#757575';
        }
      }
    }

    if (this.attempts === 5) {
      setTimeout(() => {
        if (confirm('NO HAS ADIVINADO LA PALABRA DEL DÍA, LA PALABRA ERA: ' + this.dayWord)) {
          window.location.reload();
        }
      }, 1000)
    } else {
      this.attempts++;
    }
  }

  private randomNumber(): number {
    return Math.floor(Math.random() * (this.jsonSize - 1 + 1)) + 1;
  }

}
