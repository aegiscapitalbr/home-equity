const BASE_URL = "https://b24-c2d8dr.bitrix24.com.br/rest/1/g63gyfl4a58wnfbn";
const CATEGORY_ID = 29;

async function getDealsByCategory() {
  try {
    const res = await fetch(`${BASE_URL}/crm.deal.list?filter[CATEGORY_ID]=${CATEGORY_ID}&select[]=ID`);
    const data = await res.json();
    return data.result || [];
  } catch (error) {
    console.error("Erro ao buscar os deals:", error.message);
    return [];
  }
}

async function deleteDeal(dealId) {
  try {
    const res = await fetch(`${BASE_URL}/crm.deal.delete?id=${dealId}`);
    const data = await res.json();

    if (data.result === true) {
      console.log(`✅ Deal ${dealId} excluído com sucesso.`);
    } else {
      console.error(`❌ Erro ao excluir o deal ${dealId}:`, data);
    }
  } catch (error) {
    console.error(`❌ Erro ao excluir o deal ${dealId}:`, error.message);
  }
}

async function main() {
  const deals = await getDealsByCategory();
  console.log(`Encontrados ${deals.length} deals na categoria ${CATEGORY_ID}.`);

  for (const deal of deals) {
    await deleteDeal(deal.ID);
  }

  console.log("🏁 Processo concluído.");
}

main();
