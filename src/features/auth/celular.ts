const MAX_DIGITOS = 11;

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, "").slice(0, MAX_DIGITOS);
}

export function formatarCelular(valor: string): string {
  const digitos = apenasDigitos(valor);
  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return `(${digitos}`;

  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);
  const corte = resto.length > 4 ? resto.length - 4 : resto.length;

  if (resto.length <= 4) return `(${ddd}) ${resto}`;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}

export function celularValido(valor: string): boolean {
  const digitos = apenasDigitos(valor);
  return digitos.length >= 10 && digitos.length <= MAX_DIGITOS;
}
