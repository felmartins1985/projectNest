import { validate } from 'class-validator';
import { CreatePessoaDto } from './create-pessoa.dto';
describe('CreatePessoaDto', () => {
  it('should validate a DTO', async () => {
    const dto = new CreatePessoaDto();
    dto.email = 'teste@example.com';
    dto.password = 'senha123';
    dto.nome = 'Luiz Otávio';
    const errors = await validate(dto);
    expect(errors.length).toBe(0); // Nenhum erro significa que o DTO é válido
  });
  it('should fail if the email is invalid', async () => {
    const dto = new CreatePessoaDto();
    dto.email = 'email-invalido';
    dto.password = 'senha123';
    dto.nome = 'Luiz Otávio';
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
  });
  it('should fail if the password is too short', async () => {
    const dto = new CreatePessoaDto();
    dto.email = 'teste@example.com';
    dto.password = '123';
    dto.nome = 'Luiz Otávio';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });
  it('should fail if the name is empty', async () => {
    const dto = new CreatePessoaDto();
    dto.email = 'teste@example.com';
    dto.password = 'senha123';
    dto.nome = '';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('nome');
  });
  it('should fail if the name is too long', async () => {
    const dto = new CreatePessoaDto();
    dto.email = 'teste@example.com';
    dto.password = 'senha123';
    dto.nome = 'a'.repeat(101);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('nome');
  });
});
