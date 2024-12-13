# Conceitos de Nest - 👨🏻‍💻

Consiste em um projeto por meio do qual, ao cadastrar pessoas no banco de dados, é possível mandar recados entre os usuários criados.
* O sistema foi desenvolvido usando NestJS e utiliza Postgres como banco de dados.

## Instalação do projeto

```bash
$ npm install
```

## Compilar e executar o projeto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Executar os testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


### Observações sobre o projeto

<details>
  <summary> ⚠️ Como acompanhar a evolução do projeto</summary>

a) O projeto baseia-se em uma evolução das ferramentas do Nest, em que cada etapa são adicionadas novas funcionalidades;  
b) Contudo, algumas funções são retiradas porque são colocadas apenas para entender para o que servem, não havendo necessidade de persisterem;  
c) Então, é importante acompanhar os commits feitos no projeto para entender o que está sendo feito;  
d) Há rotas, em determinados momentos do projeto, em que é necessário estar logado para poder utilizá-las;  
e) Logo, será necessário autenticar o usuário e inserir no Header dos endpoints que necessitam de Token, no campo Authorization, da seguinte forma:
```
`Bearer {token}`
```
</details>

#### Auth

| Método | Funcionalidade | URL |
|---|---|---|
| `POST` | Autentica a pessoa | http://localhost:3000/auth |

Nas requisições POST é necessário informar o seguinte JSON:

```
{
    "email": "emmaiil@email.com",
    "password": "123456"
}
```

#### Pessoa

| Método | Funcionalidade | URL |
|---|---|---|
| `GET` | Retorna as pessoas | http://localhost:3000/pessoas |
| `GET` | Retorna a pessoa especificada com seu id | http://localhost:3000/pessoas/id |
| `POST` | Cria uma nova pessoa | http://localhost:3000/pessoas |
| `POST` | Envia uma foto para o perfil da pessoa | http://localhost:3000/pessoas/upload-picture |
| `PATCH` | Atualiza uma pessoa em específico | http://localhost:3000/pessoas/id |
| `DELETE` | Deleta uma pessoa em específico | http://localhost:3000/pessoas/id |

Na requisição POST é necessário informar o seguinte JSON:
```
{
   "email": "emmaiil@email.com",
   "password": "123456",
   "nome": "Felipe"
}
```

Na requisição POST para enviar fotos, é necessário informar o seguinte JSON:
```
{
  "method": "POST",
  "url": "{{baseUrl}}/pessoas/upload-picture/",
  "headers": {
    "Authorization": "Bearer {{authToken}}",
    "Content-Type": "multipart/form-data"
  },
  "body": {
    "file": "man.png"
  }
}
```

#### Recados

| Método | Funcionalidade | URL |
|---|---|---|
| `GET` | Retorna os recados criados | http://localhost:3000/recados |
| `GET` | Retorna o recado especificado com seu id | http://localhost:3000/recados/id |
| `POST` | Cria um novo recado | http://localhost:3000/recados |
| `PATCH` | Atualiza um recado em específico | http://localhost:3000/recados/id |
| `DELETE` | Deleta um recado em específico | http://localhost:3000/recados/id |

Na requisição POST é necessário informar o seguinte JSON:
```
{
    "texto": "Recado para a pessoa interessada.",
    "paraId": 21
}
```



<details>
  <summary>💡 Conceitos Importantes sobre o Nest </summary>
  
  a) Providers: São responsáveis por fazer algo específico, como buscar dados no banco, realizar cálculos ou enviar e-mails, e podem ser reutilizados em várias partes do sistema.  
  b) Imports: Servem para "trazer" funcionalidades de outras caixas (módulos) para dentro do módulo que você está construindo.  
  c) Exports: Permitem "compartilhar" funcionalidades do seu módulo com outras caixas (módulos).  
  d) Pipes: Pipes são como filtros que verificam ou ajustam os dados que entram no sistema antes de processá-los.  
  e) Guards: Eles são como "porteiros" que decidem quem pode ou não acessar certas partes do sistema.  
  f) Interceptors: Eles atuam como "câmeras" ou "filtros avançados" que conseguem capturar e modificar o que está indo ou voltando do sistema, antes que a resposta final chegue ao usuário.  
  
</details>


