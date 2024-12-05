import { IsEmail } from 'class-validator';

import { Recado } from 'src/recados/entities/recado.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  @IsEmail()
  email: string;
  @Column({ length: 255 })
  passwordHash: string;
  @Column({ length: 100 })
  nome: string;
  @CreateDateColumn()
  createdAt?: Date;
  @UpdateDateColumn()
  updatedAt?: Date;

  // uma pessoa pode ter enviados muitos recados com o seu ID atrelado em "de"
  @OneToMany(() => Recado, recado => recado.de)
  // esses recados sao relacionados ao campo "de" na entidade recado
  recadosEnviados: Recado[];
  // uma pessoa pode ter recebido muitos recados com o seu ID atrelado em "para"
  // esses recados sao relacionados ao campo "para" na entidade recado
  @OneToMany(() => Recado, recado => recado.para)
  recadosRecebidos: Recado[];

  @Column({ default: true })
  active: boolean;
}
