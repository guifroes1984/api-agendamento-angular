import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.tokenService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.registerForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.tokenService.saveToken(response.token);
        this.tokenService.saveUser(response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.errorMessage = error.error || 'Usuário ou e-mail já existe';
        } else {
          this.errorMessage = 'Erro ao cadastrar. Tente novamente.';
        }
        console.error('Erro no registro:', error);
      }
    });
  }
}