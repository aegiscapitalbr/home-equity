export let config = {
  ids: [41, 43],
  currentIndex: 0,
  pipedrive_token: "d621629b52e52c2a7c4585cf46e2a2ce849a9058",
  bitrix_webhook_url: "https://b24-c2d8dr.bitrix24.com.br/rest/1/g63gyfl4a58wnfbn",
};
export const getNextUserId = () => {
  const userId = config.ids[config.currentIndex % config.ids.length];
  config.currentIndex++;
  return userId;
};
