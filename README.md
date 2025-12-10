<div align="center">

# Amigo Oculto

### Sistema web para sorteios com proteção por senha

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)



[Ver Demo](https://amigo-oculto-five.vercel.app/) 

</div>

---

## Sobre o Projeto

<table>
<tr>
<td>

Sistema completo para organizar sorteios de Amigo Oculto onde **cada participante cria sua própria senha** para proteger o resultado. 

**Por que usar?**
- ✅  Fácil de usar e compartilhar
- ✅  Privacidade garantida
- ✅  Funciona em qualquer dispositivo
- ✅  Sem necessidade de cadastro

</td>
</tr>
</table>

---

## Funcionalidades


- Sorteio Automático:  Algoritmo garante que ninguém tira a si mesmo
- Proteção Individual: Cada pessoa define sua senha ao revelar
- Link Único: Um único link para todos os participantes
- Responsivo: Funciona em qualquer tela
- Cloud Storage: Firebase Firestore
- Anti-Spoiler: Impossível ver sorteio alheio


</div>

---

##  Como Funciona

<details open>
<summary><b> Para o Organizador</b></summary>
<br>


1. Acesse o site
2. Digite o nome do evento
3. Liste os participantes (um por linha)
4. Clique em "Gerar Link"
5. Compartilhe o link gerado

</details>

<details>
<summary><b> Para os Participantes</b></summary>
<br>


1. Acesse o link recebido
2. Digite seu nome exatamente como cadastrado (Ao acessar o link é possivel ver a lista de todos os nomes)
3. Crie uma senha (primeira vez)
4. Veja quem você tirou!
5. Para ver novamente, use a mesma senha

</details>

---

## Tecnologias

<div align="center">

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=html" width="48" height="48" alt="HTML" />
<br>HTML5
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=css" width="48" height="48" alt="CSS" />
<br>CSS3
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=js" width="48" height="48" alt="JavaScript" />
<br>JavaScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=firebase" width="48" height="48" alt="Firebase" />
<br>Firebase
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=vercel" width="48" height="48" alt="Vercel" />
<br>Vercel
</td>
</tr>
</table>

</div>

---

## Instalação e Uso

<details>
<summary><b> Rodar Localmente</b></summary>
<br>

```bash
# Clone o repositório
git clone https://github.com/stefhanecosta/Amigo-oculto.git

# Entre na pasta
cd Amigo-oculto

# Inicie um servidor local
python -m http.server 8000
# ou
npx http-server -p 8000

# Acesse no navegador
# http://localhost:8000
```

> **Importante:** É necessário um servidor HTTP devido aos módulos ES6. Não funciona abrindo o arquivo HTML direto.

</details>

<details>
<summary><b> Deploy no Vercel</b></summary>
<br>

1. Faça fork deste repositório
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "New Project"
4. Importe seu fork
5. Deploy! 

Ou use o botão:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/stefhanecosta/amigo-oculto)

</details>

---

##  Estrutura do Projeto

```
Amigo-oculto/
├── index.html           # Página de criação
├── draw.html            # Página de sorteio
├── create.js            # Lógica de criação
├── draw.js              # Lógica de sorteio
├── firebase-config.js   # Config Firebase
├── style.css            # Estilos
└── README.md            # Documentação
```

---

## Segurança

<div align="center">

> **Nota Importante**
> 
> As credenciais do Firebase presentes no código são **públicas por design** para aplicações web frontend.
> 
> A segurança é garantida através das **Regras do Firestore** e do **sistema de senhas individuais**.

</div>


**O que protege seus dados:**
- ✅ Firestore Security Rules
- ✅ Sistema de hash de senhas
- ✅ Restrições de domínio no Firebase

---

## Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:

- Reportar bugs
- Sugerir novas features
- Enviar pull requests

---

## Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.

---

<div align="center">

### Desenvolvido para facilitar o seu Amigo Oculto ❤️


---


</div>
