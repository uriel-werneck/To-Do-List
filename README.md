# 📝 To-Do-List

Este é um projeto full stack de lista de tarefas, desenvolvido com **Flask** no backend e **HTML, CSS e JavaScript** no frontend. O objetivo é fornecer um sistema simples e funcional para gerenciar tarefas, com autenticação de usuários e persistência em banco de dados.

## ✅ Funcionalidades

- Registro de usuários com validação de dados
- Login de usuários com autenticação JWT
- CRUD de tarefas (criar, visualizar, editar, excluir)
- Persistência de dados em banco SQLite
- Interface web responsiva em JavaScript, HTML e CSS

## ⚙️ Configurando Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/uriel-werneck/To-Do-List.git
    cd To-Do-List
    ```

2.  **Instale um ambiente virtual (Recomendado)**
    ```bash
    python -m venv .venv
    ```

3.  **Ative o ambiente virtual (Windows)**
    ```bash
    .venv\Scripts\activate
    ```
    
4.  **Crie um arquivo .env com sua SECRET_KEY**
    ```bash
    echo "SECRET_KEY = my_secret_key" > .env
    ```

5.  **Instale as dependências**
    ```bash
    pip install -r backend/requirements.txt
    ```

# 🚀 Inicie a aplicação

1.  **Backend**
    ```bash
    python backend/run.py
    ```

2.  **Frontend**
    ```bash
    python -m http.server 5500
    ```

## 💻 Abra o navegador e digite
```
http://127.0.0.1:5500/frontend/public/login.html
```

## 📊 Demonstração
https://github.com/user-attachments/assets/3e0e876a-55a0-4c5e-82b9-43c8983333cb
