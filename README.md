## DESAFIO CUBOS

<h2>processo Seletivo - BackEnd</h2>
<h1>Carlos Baraúna<h1>

### Instalação

Utilizar o yarn ou npm

<li>```usar o comando install```</li>

## Database

Os dados do projeto estão armazedados no arquivo: rules.json no diretório src/file/rules.json

## Endpoints

## Listar regras

### Buscar as regras cadastradas

`localhost:3333/rules` GET

### Cadastro de regra de atendimento

`localhost:3333/rules` POST

Há três possibilidades

<li>m dia especifico, por exemplo: irá atender dia 02/02/2020 nos intervalos de 14:30 até 15:20 e de 15:30 até as 16:00
</li>

por exemplo

```
{
  "daily": null,
  "weekly": null,
  "day": "02-02-2020",
  "daysWeek": [],
  "intervals": [
    { "start": "14:30", "end": "15:20" },
    { "start": "15:30", "end": "16:00" },
  ]
}
```

<li>Semanalmente irá atender todas segundas e quartas das 08:00 até as 11:30
 </li>

```
{
 "daily": null,
 "weekly": true,
 "day": null,
 "daysWeek": [
   {"day": "monday"},
   {"day": "wednesday"},
],
 "intervals": [
   { "start": "08:00", "end": "11:30" },
 ]
}
```

<li>Diáriamente, por exemplo: irá atender todos os dias das 13:30 até as 14:00</li>

```
{
  "daily": true,
  "weekly": null,
  "day": null,
  "daysWeek": [],
  "intervals": [
    { "start": "13:30", "end": "14:00" },
  ]
}
```

### Apagar regra

`localhost:3000/regras` DELETE

Passar o mesmo conteudo do post no body da requisição

```
{
  "daily": true,
  "weekly": false,
  "day": false,
  "daysWeek": [],
  "intervals": [
    { "start": "13:30", "end": "14:00" },
  ]
}
```

### Filtrar dados

`localhost:3000/regras?start=10-01-2020&end=02-02-2020` GET
