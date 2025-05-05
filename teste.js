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
  31: { id: "C27:NEW" },
  32: { id: "C27:PREPARATION" },
  33: { id: "C27:PREPAYMENT_INVOIC" },
  34: { id: "C27:EXECUTING" },
  6: { id: "C27:FINAL_INVOICE" },
  7: { id: "C27:UC_A9K83R" },
  8: { id: "C27:UC_MBQLE7" },
  10: { id: "C27:UC_7F8U4H" },
  11: { id: "C27:UC_S3IT7X" },
  19: { id: "C27:UC_DECXEQ" },
  36: { id: "C27:UC_NIIBCS" },
};

const statusDeal = {
  "Leed frio": { id: 1363 },
  "Produto não atende o cliente": { id: 1365 },
  "Sem perfil": { id: 1367 },
  "Sem recurso": { id: 1369 },
  "Fora do timing": { id: 1371 },
  "Motivo não informado": { id: 1373 },
  Outros: { id: 1375 },
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
  const filteredDeals = deals.filter((deal) => deal.pipeline_id === 2);

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
            TITLE: `${extractedName} - ${deal.formatted_value}`,
            STAGE_ID: lostReason ? "C27:UC_NIIBCS" : stage,
            CATEGORY_ID: "27",
            OPPORTUNITY: deal.value || 0,
            CURRENCY_ID: "BRL",
            ASSIGNED_BY_ID: ids[deal.user_id.id]?.id || 1,
            CONTACT_ID: contactId,
            COMMENTS: `Importado do Pipedrive - ID: ${deal.id}`,
            UF_CRM_1746308347955: deal["45fafea7c64dc6f53ee474083d3fb032dd175c12"],
            UF_CRM_1746308289182: deal["40866939ecd2ccb0e6143746563cbf441317dc0c"],
            UF_CRM_1746308266058: deal["b65bbab60b30afb1847d15f7ce8633244c52b1a3"],
            UF_CRM_1746308303922: deal["23f0e229627766e3337cd79b9cf5b1cfe942d916"],
            UF_CRM_1746308252842: deal["cd9dc1dd7b8c1e60d4b16ba25ad7ecdea41a0d1f"],
            UF_CRM_1746308327201: deal["14d9ca354ee1a191a21ab3619f1fa6555fcdf637"],
            UF_CRM_1746308334521: deal["f24f1418e6dfb7deb9fb6baca597e4deeaef1b85"],
            UF_CRM_1746308502157: deal["3508876a05d1243a2ea164209a7f6d8db9e5c81c"],
            UF_CRM_1746325512: lostReason && +statusDeal[lostReason].id,
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
