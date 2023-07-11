<!--
title: 'Enquete-Online'
description: 'O projeto "enquete-online" foi desenvolvido com o objeto de aprendizado das ferramentas Serveless, GraphQl e WebSockets. Esse projeto utilizou também o NodeJs Express API e banco de dados DynamoDB. Ele foi projetado para ser executado na AWS Lambda.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->
# Enquete-Online


## Introdução

O projeto "enquete-online" foi desenvolvido com o objeto de aprendizado das ferramentas Serveless, GraphQl e WebSockets. Esse projeto utilizou também o NodeJs Express API e banco de dados DynamoDB. Ele foi projetado para ser executado na AWS Lambda.

## Componentes Principais

A arquitetura do sistema "Enquete-Online" é composta pelos seguintes componentes principais:

### Frontend:

Responsável por notificar o usuário ao criar uma nova enquete, realizar votações e encerrar a enquete.

### Backend:

Responsável por gerenciar a lógica das enquetes. É desenvolvido em Node.js e utiliza o framework Express para ligar com as rotas e solicitações HTTP. Utiliza-se também o Apollo para realizar as requisições entre o GraphQL e o Node.js.

### Banco de Dados:

Armazena os dados do sistema. Utilizamos o banco de dados DynamDB para garantir a consitência e integridade dos dados.

## Fluxo de Dados
O fluxo de dados no sistema "Enquete-Online" é o seguinte:
O GraphQL envia uma solicitação HTTP para o backend para realizando a criação e finalização de enquetes e adição de votos.
O WebSocket fica responsável por "escutar" as rotas já mapeadas e enviar para o frontend uma notificação da ação realizada.

## Seção de boas práticas
#### Segurança:

    Criptografar dados sensíveis.
    Implementar autenticação e autorização adequadas.
    Realizar validação de entrada e evitar ataques de injeção.

#### Escalabilidade:

    Projetar para escalabilidade horizontal, usando serviços como AWS Lambda.
    Utilizar serviços gerenciados como DynamoDB, que oferece escalabilidade automática.

#### Monitoramento:

    Implementar logs e utilizar ferramentas de monitoramento, como AWS CloudWatch.
    Configurar alertas para problemas críticos.

#### Melhores Práticas de Codificação:

    Seguir princípios SOLID.
    Padronizar nomenclatura e escrever código claro.
    Escrever testes automatizados e documentar o código.
    Utilizar controle de versão (Git).

#### Serverless, GraphQL e WebSockets:

    Aproveitar os benefícios do serverless.
    Dividir a aplicação em funções lambda.
    Utilizar GraphQL para comunicação eficiente entre frontend e backend.
    Implementar proteção contra ataques em WebSockets.

## Diagrama

![image](https://github.com/simeialves/enquete-online/assets/55514588/52532865-5176-45bf-a6f0-fb80908a894b)
