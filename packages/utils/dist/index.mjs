// src/utils/formatters.ts
function capitalize(input) {
  if (!input) return "";
  return input[0].toUpperCase() + input.slice(1);
}
export {
  capitalize
};
