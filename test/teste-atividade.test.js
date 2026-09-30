import { describe, it, expect } from 'vitest'

const api = 'https://serverest.dev'

describe('Teste de estoque e carrinho', () => {
  let token
  let produtoId

  const email = `teste_${Date.now()}@email.com`
  const senha = 'teste'

  // 1. Criar uma conta de administrador
  it('deve criar um usuário administrador', async () => {
    const resposta = await fetch(`${api}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: 'Usuário de Teste',
        email,
        password: senha,
        administrador: 'true'
      })
    })

    expect(resposta.status).toBe(201)
  })

  // 2. Fazer login e guardar o token
  it('deve fazer login e obter o token', async () => {
    const resposta = await fetch(`${api}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password: senha
      })
    })

    const dados = await resposta.json()

    token = dados.authorization

    expect(resposta.status).toBe(200)
    expect(token).toBeTruthy()
  })

  // 3. Cadastrar um produto com 10 unidades
  it('deve cadastrar um produto com 10 unidades', async () => {
    const resposta = await fetch(`${api}/produtos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        nome: `Teclado ${Date.now()}`,
        preco: 120,
        descricao: 'Teclado mecânico',
        quantidade: 10
      })
    })

    const dados = await resposta.json()

    produtoId = dados._id

    expect(resposta.status).toBe(201)
    expect(produtoId).toBeDefined()
  })

  // 4. Colocar 1 unidade no carrinho
  it('deve adicionar uma unidade do produto ao carrinho', async () => {
    const resposta = await fetch(`${api}/carrinhos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        produtos: [
          {
            idProduto: produtoId,
            quantidade: 1
          }
        ]
      })
    })

    expect(resposta.status).toBe(201)
  })

  // 5. Consultar o produto e conferir se o estoque é 9
  it('deve diminuir o estoque para 9 unidades', async () => {
    const resposta = await fetch(`${api}/produtos/${produtoId}`)
    const produto = await resposta.json()

    expect(resposta.status).toBe(200)
    expect(produto.quantidade).toBe(9)
  })
})
