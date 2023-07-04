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

## Diagrama
