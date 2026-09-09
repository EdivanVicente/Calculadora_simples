const combustivel = 15
const distancia = 100
const kmPorLitro = 10

const litrosNecessarios = distancia / kmPorLitro
const custoTotal = litrosNecessarios * combustivel
console.log(`O custo total da viagem é: R$ ${custoTotal.toFixed(2)}`)