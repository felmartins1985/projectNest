import { Repository } from 'typeorm';
import { PessoasService } from './pessoas.service';
import { Pessoa } from './entities/pessoa.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
jest.mock('fs/promises');
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
            remove: jest.fn(),
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
    it('show throw ForbiddenException', async () => {
      // Arrange
      const pessoaId = 1; // Usuário certo (ID 1)
      const tokenPayload = { sub: 2 } as any; // Usuário diferente (ID 2)
      const updatePessoaDto = { nome: 'Jane Doe' };
      const existingPessoa = { id: pessoaId, nome: 'John Doe' };
      // Simula que a pessoa existe
      jest
        .spyOn(pessoaRepository, 'preload')
        .mockResolvedValue(existingPessoa as any);
      // Act e Assert
      await expect(
        pessoaService.update(pessoaId, updatePessoaDto, tokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });
    it('should throw NotFoundException', async () => {
      // Arrange
      const pessoaId = 1;
      const tokenPayload = { sub: pessoaId } as any;
      const updatePessoaDto = { nome: 'Jane Doe' };
      // Simula que preload retornou null
      jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(null);
      // Act e Assert
      await expect(
        pessoaService.update(pessoaId, updatePessoaDto, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('remove', () => {
    it('should remove a person if authorize', async () => {
      // Arrange
      const pessoaId = 1; // Pessoa com ID 1
      const tokenPayload = { sub: pessoaId } as any; // Usuário com ID 1
      const existingPessoa = { id: pessoaId, nome: 'John Doe' }; // Pessoa é o Usuário
      // findOne do service vai retornar a pessoa existente
      jest
        .spyOn(pessoaService, 'findOne')
        .mockResolvedValue(existingPessoa as any);
      // O método remove do repositório também vai retornar a pessoa existente
      jest
        .spyOn(pessoaRepository, 'remove')
        .mockResolvedValue(existingPessoa as any);
      // Act
      const result = await pessoaService.remove(pessoaId, tokenPayload);
      // Assert
      // Espero que findOne do pessoaService seja chamado com o ID da pessoa
      expect(pessoaService.findOne).toHaveBeenCalledWith(pessoaId);
      // Espero que o remove do repositório seja chamado com a pessoa existente
      expect(pessoaRepository.remove).toHaveBeenCalledWith(existingPessoa);
      // Espero que a pessoa apagada seja retornada
      expect(result).toEqual(existingPessoa);
    });
    it('should throw ForbiddenException if not authorize', async () => {
      // Arrange
      const pessoaId = 1; // Pessoa com ID 1
      const tokenPayload = { sub: 2 } as any; // Usuário com ID 2
      const existingPessoa = { id: pessoaId, nome: 'John Doe' }; // Pessoa NÃO é o Usuário
      // Espero que o findOne seja chamado com pessoa existente
      jest
        .spyOn(pessoaService, 'findOne')
        .mockResolvedValue(existingPessoa as any);
      // Espero que o servico rejeite porque o usuário é diferente da pessoa
      await expect(
        pessoaService.remove(pessoaId, tokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });
    it('should throw NotFoundException if person not founded', async () => {
      const pessoaId = 1;
      const tokenPayload = { sub: pessoaId } as any;
      // Só precisamos que o findOne lance uma exception e o remove também deve lançar
      jest
        .spyOn(pessoaService, 'findOne')
        .mockRejectedValue(new NotFoundException());
      await expect(
        pessoaService.remove(pessoaId, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('uploadPicture', () => {
    it('shoudl save an image correctly and update a person', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;
      const mockPessoa = {
        id: 1,
        nome: 'Luiz',
        email: 'luiz@email.com',
      } as Pessoa;
      const tokenPayload = { sub: 1 } as any;
      jest.spyOn(pessoaService, 'findOne').mockResolvedValue(mockPessoa);
      jest.spyOn(pessoaRepository, 'save').mockResolvedValue({
        ...mockPessoa,
        picture: '1.png',
      });
      const filePath = path.resolve(process.cwd(), 'pictures', '1.png');
      // Act
      const result = await pessoaService.uploadPicture(mockFile, tokenPayload);
      // Assert
      expect(fs.writeFile).toHaveBeenCalledWith(filePath, mockFile.buffer);
      expect(pessoaRepository.save).toHaveBeenCalledWith({
        ...mockPessoa,
        picture: '1.png',
      });
      expect(result).toEqual({
        ...mockPessoa,
        picture: '1.png',
      });
    });
    it('should throw BadRequestException if the file is too small', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 500, // Menor que 1024 bytes
        buffer: Buffer.from('small content'),
      } as Express.Multer.File;
      const tokenPayload = { sub: 1 } as any;
      // Act & Assert
      await expect(
        pessoaService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw NotFoundException if not found the person', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;
      const tokenPayload = { sub: 1 } as any;
      jest
        .spyOn(pessoaService, 'findOne')
        .mockRejectedValue(new NotFoundException());
      // Act & Assert
      await expect(
        pessoaService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
