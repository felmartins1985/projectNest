import { Repository } from 'typeorm';
import { PessoasService } from './pessoas.service';
import { Pessoa } from './entities/pessoa.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('PessoasService', () => {
  let pessoaService: PessoasService;
  let pessoaRepository: Repository<Pessoa>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoasService,
        {
          provide: getRepositoryToken(Pessoa),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    pessoaService = await module.resolve<PessoasService>(PessoasService);
    pessoaRepository = module.get<Repository<Pessoa>>(
      getRepositoryToken(Pessoa),
    );
    hashingService = module.get<HashingService>(HashingService);
  });

  it('pessoaService deve estar definido', () => {
    expect(pessoaService).toBeDefined();
  });
  describe('create', () => {
    it('should create a new person', async () => {
      const createPessoaDto: CreatePessoaDto = {
        email: 'luiz@email.com',
        nome: 'Luiz',
        password: '123456',
      };
      const passwordHash = 'HASHDESENHA';
      const novaPessoa = {
        id: 1,
        email: createPessoaDto.email,
        nome: createPessoaDto.nome,
        passwordHash,
      };
      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest.spyOn(pessoaRepository, 'create').mockReturnValue(novaPessoa as any);
      const result = await pessoaService.create(createPessoaDto);
      expect(hashingService.hash).toHaveBeenCalledWith(
        createPessoaDto.password,
      );
      expect(pessoaRepository.create).toHaveBeenCalledWith({
        email: createPessoaDto.email,
        nome: createPessoaDto.nome,
        passwordHash,
      });
      expect(pessoaRepository.save).toHaveBeenCalledWith(novaPessoa);
      expect(result).toEqual(novaPessoa);
    });
    it('shoud return a conflict exception whe the email already exists', async () => {
      jest.spyOn(pessoaRepository, 'save').mockRejectedValue({ code: '23505' });
      await expect(pessoaService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });
    it('shoud return a generic error', async () => {
      jest
        .spyOn(pessoaRepository, 'save')
        .mockRejectedValue(new Error('Erro genérico'));
      await expect(pessoaService.create({} as any)).rejects.toThrow(
        new Error('Erro genérico'),
      );
    });
  });
  describe('findOneBy', () => {
    it('should return a person if the person exists', async () => {
      const pessoaId = 1;
      const pessoaEncontrada = {
        id: pessoaId,
        nome: 'Luiz',
        email: 'luiz@email.com',
        passwordHash: '123456',
      };
      jest
        .spyOn(pessoaRepository, 'findOneBy')
        .mockResolvedValue(pessoaEncontrada as any);
      const result = await pessoaService.findOne(pessoaId);
      expect(result).toEqual(pessoaEncontrada);
    });
    it('should return an error if the person dont exists', async () => {
      const pessoaId = 1;
      await expect(pessoaService.findOne(pessoaId)).rejects.toThrow(
        new NotFoundException('Pessoa não encontrada'),
      );
    });
  });
  describe('findAll', () => {
    it('should return all the persons', async () => {
      const pessoasMock: Pessoa[] = [
        {
          id: 1,
          nome: 'Luiz',
          email: 'luiz@email.com',
          passwordHash: '123456',
        } as Pessoa,
      ];
      jest.spyOn(pessoaRepository, 'find').mockResolvedValue(pessoasMock);
      const result = await pessoaService.findAll();
      expect(result).toEqual(pessoasMock);
      expect(pessoaRepository.find).toHaveBeenCalledWith({
        order: {
          id: 'DESC',
        },
      });
    });
  });
  describe('update', () => {
    it('should update a person', async () => {
      const pessoaId = 1;
      const updatePessoaDto = { nome: 'Joana', password: '654321' };
      const tokenPayload = { sub: pessoaId } as any;
      const passwordHash = 'HASHDESENHA';
      const updatedPessoa = { id: pessoaId, nome: 'Joana', passwordHash };
      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest
        .spyOn(pessoaRepository, 'preload')
        .mockResolvedValue(updatedPessoa as any);
      jest
        .spyOn(pessoaRepository, 'save')
        .mockResolvedValue(updatedPessoa as any);
      const result = await pessoaService.update(
        pessoaId,
        updatePessoaDto,
        tokenPayload,
      );

      expect(hashingService.hash).toHaveBeenCalledWith(
        updatePessoaDto.password,
      );
      expect(pessoaRepository.preload).toHaveBeenCalledWith(updatedPessoa);
      expect(pessoaRepository.save).toHaveBeenCalledWith(updatedPessoa);
      expect(result).toEqual(updatedPessoa);
    });
  });
});
