import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SocioService } from '../../../services/socio.service';
import { Socio, Usuario } from '../../../model/supabase.models';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-socio',
  imports: [ReactiveFormsModule, NgFor,RouterLink],
  templateUrl: './socio.component.html',
  styleUrl: './socio.component.css',
})
export class SocioComponent implements OnInit {


  socioForm!: FormGroup;
  usuarios: Usuario[] = [];
  socios: Socio[] = [];

  constructor(
    private fb: FormBuilder,
    private socioService: SocioService,
    private usuarioService: SocioService
  ) {}

  ngOnInit(): void {
    this.socioForm = this.fb.group({
      ID_de_usuario: ['', Validators.required],
      lugar_trabajo: [''],
      teléfono_trabajo: [''],
    });

    this.loadUsuarios();
    this.loadSocios()
  }

  async loadUsuarios() {
    try {
      this.usuarios = await this.usuarioService.getUsuarios(); // Método para listar usuarios
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  async loadSocios() {
    try {
      this.socios = await this.usuarioService.getSocios();
      console.log(this.socios); // Método para listar usuarios
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  async onSubmit() {
    if (this.socioForm.invalid) return;

    try {
      const nuevoSocio = await this.socioService.createSocio(
        this.socioForm.value
      );
      console.log('Socio creado:', nuevoSocio);
      this.socioForm.reset();
    } catch (error) {
      console.error('Error al crear socio:', error);
    }
  }

  deleteSocio(arg0: any) {
    throw new Error('Method not implemented.');
  }
}
