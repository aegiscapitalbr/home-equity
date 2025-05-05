const config = {
  pipedrive_token: "d621629b52e52c2a7c4585cf46e2a2ce849a9058",
};

async function getAllDeals() {
  const allDeals = [];
  let start = 0;
  const limit = 100;

  try {
    while (true) {
      const res = await fetch(`https://api.pipedrive.com/v1/deals?start=${start}&limit=${limit}&api_token=${config.pipedrive_token}`);
      const json = await res.json();

      if (!json.success) break;

      const deals = json.data;
      if (!deals || deals.length === 0) break;

      allDeals.push(...deals);

      const hasMore = json.additional_data?.pagination?.more_items_in_collection;
      if (!hasMore) break;

      start += limit;
    }

    return allDeals;
  } catch (err) {
    console.error("Erro ao buscar deals:", err);
    return [];
  }
}
const ids = {
  23538825: { id: 43 },
  23359206: { id: 41 },
  23381283: { id: 45 },
  23358304: { id: 1 },
};

const stages = {
  12: { id: "C29:NEW" },
  13: { id: "C29:UC_YRVRKH" },
  14: { id: "C29:UC_JFI05B" },
  15: { id: "C29:UC_3WKJGE" },
  37: { id: "C29:PREPAYMENT_INVOIC" },
  20: { id: "C29:EXECUTING" },
  21: { id: "C29:UC_LP7PZ7" },
  38: { id: "C29:UC_ZSWQX5" },
  16: { id: "C29:UC_LOCZTY" },
  17: { id: "C29:FINAL_INVOICE" },
  18: { id: "C29:WON" },
  35: { id: "C29:LOSE" },
};

const statusDeal = {
  "Leed frio": { id: 1363 },
  "Produto não atende o cliente": { id: 1365 },
  "Sem perfil": { id: 1367 },
  "Sem recurso": { id: 1369 },
  "Fora do timing": { id: 1371 },
  "Motivo não informado": { id: 1373 },
};

function extractName(deal) {
  const raw = deal.person_name?.trim() || deal.f24f1418e6dfb7deb9fb6baca597e4deeaef1b85?.trim() || deal.title?.trim();

  if (!raw) return "";

  return raw.split(/(Acima|Abaixo) de/i)[0].trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

getAllDeals().then(async (deals) => {
  const filteredDeals = deals.filter((deal) => deal.pipeline_id === 3);

  for (const deal of filteredDeals) {
    try {
      const email = deal.person_id?.email?.[0]?.value ?? deal["23f0e229627766e3337cd79b9cf5b1cfe942d916"];
      const phone = `+55${deal.b65bbab60b30afb1847d15f7ce8633244c52b1a3?.replace(/[^0-9]+/g, "") ?? ""}`;

      const extractedName = extractName(deal);
      const nameParts = extractedName.split(" ");

      let contactId = null;

      const searchRes = await fetch("https://b24-c2d8dr.bitrix24.com.br/rest/1/g63gyfl4a58wnfbn/crm.contact.list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter: { EMAIL: email },
          select: ["ID"],
        }),
      });

      const searchData = await searchRes.json();
      if (searchData.result?.length > 0) {
        contactId = searchData.result[0].ID;
      } else {
        const contactRes = await fetch("https://b24-c2d8dr.bitrix24.com.br/rest/1/g63gyfl4a58wnfbn/crm.contact.add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: {
              NAME: nameParts[0],
              LAST_NAME: nameParts[nameParts.length - 1] || "",
              HAS_PHONE: "Y",
              HAS_EMAIL: "Y",
              PHONE: [{ VALUE: phone, VALUE_TYPE: "MOBILE" }],
              EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
            },
          }),
        });
        const contactData = await contactRes.json();
        contactId = contactData.result;
      }

      const stage = stages[deal.stage_id]?.id;

      if (!stage) throw new Error(`Stage ID não encontrado para deal.stage_id=${deal.stage_id}`);
      const lostReason = deal.status === "lost" && (deal.lost_reason || "Motivo não informado");

      const response = await fetch("https://b24-c2d8dr.bitrix24.com.br/rest/1/g63gyfl4a58wnfbn/crm.deal.add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            TITLE: `${deal.person_name?.trim()} - ${deal.formatted_value}`,
            STAGE_ID: lostReason ? "C29:LOSE" : stage,
            CATEGORY_ID: "29",
            OPPORTUNITY: deal.value || 0,
            CURRENCY_ID: "BRL",
            ASSIGNED_BY_ID: ids[deal.user_id.id]?.id || 1,
            CONTACT_ID: contactId,
            COMMENTS: `Importado do Pipedrive - ID: ${deal.id}`,
            UF_CRM_1746308361024: deal["58042a4bdb39042817b04f77e050d691d7bc8b72"] /* Valor do Imovel */,
            UF_CRM_1746308252842: deal["cd9dc1dd7b8c1e60d4b16ba25ad7ecdea41a0d1f"] /* Tag */,
            UF_CRM_1746308334521: deal["f24f1418e6dfb7deb9fb6baca597e4deeaef1b85"] /* Nome */,
            UF_CRM_1746308502157: deal["3508876a05d1243a2ea164209a7f6d8db9e5c81c"] /* BrevoMail*/,
            UF_CRM_1746308508986: deal["750aad2adf5476746e148c944264251893370e5f"] /* CPF*/,
            UF_CRM_1746308493315: deal["7fc0134ddd798b44ded72270ada70b0a14d3f532"] /* Possui automovel? */,
            UF_CRM_1746308486670: deal["275b2d937b84a2fd4aa52cb48b3a38d505601364"] /* Possui Matricula do bem? */,
            UF_CRM_1746308479452: deal["f3ff35d4accc677cf3a5aa0c0344962262caccc1"] /* Imovel dentro de condominio? */,
            UF_CRM_1746308458687: deal["89a256c9584e7de24f782d7d8db3cf74f08b1592"] /* Estado Civil*/,
            UF_CRM_1746308448991: deal["995e8ee3943f3fa0e97deffa299732acc5eee63c"] /* Imovel esta quitado? */,
            UF_CRM_1746308442412: deal["6a2483ff832b3e391cbcea435d34a993110cd12a"] /* Imovel proprio... */,
            UF_CRM_1746308425185: deal["3700c165d0ef33d1455a460531332e955a2a0d7d"] /* Qual tipo de imovel? */,
            UF_CRM_1746308403304: deal["922629a6a36fdab948fcd17ae6d915d636a5b23f"] /* Profissao? */,
            UF_CRM_1746308394572: deal["79bf1a965f730ee789724aecf49bebc9bd1b8c58"] /* CEP do imovel em garantia */,
            UF_CRM_1746308383159: deal["ef706a49485679faccd081a80ee6e50c71a22988"] /* Em quanto tempo pretende realizar a operacao?*/,
            UF_CRM_1746308369420: deal["69045690e3ccfde9c40cbfd73ababb85f62af758"] /* Prazo em Meses */,
            UF_CRM_1746308502157: deal["f3ff35d4accc677cf3a5aa0c0344962262caccc1"] /* Imovel dentro de condominio? */,
            UF_CRM_1746388766: lostReason,
          },
        }),
      });

      const result = await response.json();
      console.log(`✔ Deal criado: ${result.result}`);
    } catch (err) {
      console.log(err);

      console.error(`❌ Erro ao processar deal ${deal.id}:`, err.message);
    }

    await sleep(400); // delay de 0.4s entre cada deal
  }
});
