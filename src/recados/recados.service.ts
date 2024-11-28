import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado) // injeta o repositório/BD da entidade Recado
    private readonly recadoRepository: Repository<Recado>, // passo a ter acesso ao BD
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado');
  }
  async findAll() {
    const recados = await this.recadoRepository.find();
    return recados;
  }
  async findOne(id: number) {
    // const recado = this.recados.find(item => item.id === id);
    const recado = await this.recadoRepository.findOne({
      where: { id },
    });
    if (recado) return recado;
    // throw new HttpException('Recado não encontrado', HttpStatus.NOT_FOUND);
    // throw new NotFoundException('Recado não encontrado');
    this.throwNotFoundError();
  }
  async create(createRecadoDto: CreateRecadoDto) {
    const novoRecado = {
      ...createRecadoDto,
      lido: false,
      data: new Date(),
    };
    const recado = await this.recadoRepository.create(novoRecado);
    return this.recadoRepository.save(recado);
  }
  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const partialUpdateDto = {
      lido: updateRecadoDto?.lido,
      text: updateRecadoDto?.texto,
    };
    const recado = await this.recadoRepository.preload({
      id,
      ...partialUpdateDto,
    });
    if (!recado) {
      this.throwNotFoundError();
    }
    return this.recadoRepository.save(recado);
  }
  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({
      id,
    });
    if (!recado) {
      this.throwNotFoundError();
    }
    return this.recadoRepository.remove(recado);
  }
}
