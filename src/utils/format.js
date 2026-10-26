export function formatPrice(amount) {
  return `Rs ${Number(amount).toLocaleString('en-US')}`
}
