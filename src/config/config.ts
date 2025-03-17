export let config = {
  ids: [23538825, 23359206],
  currentIndex: 0,
  pipedrive_token: "d621629b52e52c2a7c4585cf46e2a2ce849a9058",
};
export const getNextUserId = () => {
  const userId = config.ids[config.currentIndex % config.ids.length];
  config.currentIndex++; // Atualiza o índice para alternar no próximo uso
  return userId;
};
