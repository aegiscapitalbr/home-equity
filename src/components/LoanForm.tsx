import { useState } from "react";
import Swal from "sweetalert2";
import "@sweetalert2/theme-dark/dark.css";
import { StepIndicator } from "./StepIndicator";
import { FormField } from "./FormFields";
import { Loader2 } from "lucide-react";
import { useApp } from "../contexts/app.context";
import { config, getNextUserId } from "../config/config";
import { v4 as uuid } from "uuid";

interface Field {
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
  minValue?: string;
  min?: number;
  max?: number;
  default?: number;
  description?: string;
  value?: string;
  icon?: string;
  hidden?: boolean;
}

interface Step {
  step: number;
  progress: string;
  fields: Field[];
  summary?: boolean;
}

const buttons = ["Voltar", "Continuar", "Editar dados", "Simular meu Crédito"];
export function LoanForm() {
  const { formData, setFormData } = useApp();
  const [id] = useState(uuid());
  const steps: Step[] = [
    {
      step: 1,
      progress: "20%",
      fields: [
        { label: "Nome", type: "text", placeholder: "Seu nome completo" },
        { label: "Email", type: "email", placeholder: "seu@email.com" },
        { label: "WhatsApp", type: "phone", placeholder: "(00) 00000-0000" },
        { label: "CPF", type: "CPF", placeholder: "000.000.000-00" },
        { label: "Data de Nascimento", type: "date", placeholder: "01/01/2000" },
        { label: "Estado Civil", type: "select", placeholder: "Selecione uma opção", options: ["Solteiro (a)", "Casado (a)", "Divorciado (a)", "Viúvo (a)"] },
        { label: "Nome do Cônjuge", type: "text", placeholder: "Seu nome completo", hidden: formData["Estado Civil"] !== "Casado (a)" },
        { label: "CPF do Cônjuge", type: "CPF", placeholder: "000.000.000-00", hidden: formData["Estado Civil"] !== "Casado (a)" },
        { label: "Data de Nascimento do Cônjuge", type: "date", placeholder: "01/01/2000", hidden: formData["Estado Civil"] !== "Casado (a)" },
        { label: "Profissão do Cônjuge", type: "text", placeholder: "Sua profissão", hidden: formData["Estado Civil"] !== "Casado (a)" },
        { label: "Renda bruta mensal do Cônjuge", type: "currency", placeholder: "R$ 0,00", hidden: formData["Estado Civil"] !== "Casado (a)" },
      ],
    },
    {
      step: 2,
      progress: "40%",
      fields: [
        { label: "Valor do imóvel", type: "currency", placeholder: "R$ 1.000.000,00" },
        { label: "Quanto você precisa?", type: "currency", placeholder: "R$ 300.000,00", minValue: "50.000,00" },
        { label: "Prazo (em meses): {value}", type: "slider", min: 12, max: 240, default: 12 },
      ],
    },
    {
      step: 3,
      progress: "40%",
      fields: [
        {
          label: "Em quanto tempo pretende realizar a operação?",
          type: "radio",
          options: ["Urgente", "Em até 1 mês", "Em até 3 meses", "Acima de 3 meses"],
          description: "Com isso entendemos sua urgência em conseguir o seu crédito",
        },
      ],
    },
    {
      step: 4,
      progress: "60%",
      fields: [
        { label: "CEP do imóvel em garantia", type: "CEP", placeholder: "00000-000" },
        { label: "Profissão", type: "text", placeholder: "Sua profissão" },
        { label: "Renda bruta mensal", type: "currency", placeholder: "R$ 0,00" },
        {
          label: "Possui automóvel?",
          type: "radio",
          placeholder: "Selecione uma opção",
          options: ["Sim", "Não"],
        },
      ],
    },
    {
      step: 5,
      progress: "80%",
      fields: [
        {
          label: "Qual o tipo de Imóvel?",
          type: "select",
          placeholder: "Selecione o tipo de imóvel",
          options: ["Apartamento", "Casa", "Terreno", "Galpão", "Sala comercial", "Chácara/Sítio", "Fazenda", "Hotel"],
        },
        {
          label: "Imóvel próprio, de um familiar ou de terceiros?",
          type: "select",
          placeholder: "Selecione o tipo de propriedade",
          options: ["Próprio", "De terceiros", "Familiar"],
        },
        {
          label: "O imóvel está quitado?",
          type: "select",
          placeholder: "Selecione uma opção",
          options: ["Sim", "Não", "Ainda financiado"],
        },
        {
          label: "Imóvel dentro de condomínio?",
          type: "radio",
          placeholder: "Selecione uma opção",
          options: ["Sim", "Não"],
        },
        {
          label: "Possui matrícula do bem?",
          type: "radio",
          placeholder: "Selecione uma opção",
          options: ["Sim", "Não"],
        },
        {
          label: "É produtivo?",
          type: "radio",
          placeholder: "Selecione o tipo de imóvel",
          options: ["Sim", "Não"],
          hidden: !["Chácara/Sítio", "Fazenda"].includes(formData["Qual o tipo de Imóvel?"]),
        },
      ],
    },
    {
      step: 6,
      progress: "100%",
      summary: true,
      fields: [
        { label: "Valor do imóvel", type: "text", value: formData["Valor do imóvel"], icon: "building" },
        { label: "Valor do empréstimo", type: "text", value: formData["Quanto você precisa?"], icon: "money" },
        { label: "Prazo", type: "text", value: "240 meses", icon: "clock" },
        { label: "CEP", type: "text", value: formData["CEP do imóvel em garantia"], icon: "map" },
        { label: "Nome completo", type: "text", value: formData["Nome"], icon: "user" },
        { label: "CPF", type: "text", value: formData["CPF"], icon: "user" },
        { label: "Data de Nascimento", type: "text", value: formData["Data de Nascimento"], icon: "bake" },
        { label: "WhatsApp", type: "text", value: formData["WhatsApp"], icon: "phone" },
        { label: "Profissão", type: "text", value: formData["Profissão"], icon: "briefcase" },
        { label: "Renda mensal", type: "text", value: `R$ ${formData["Renda bruta mensal"]}`, icon: "credit-card" },
        { label: "Possui automóvel", type: "text", value: `${formData["Possui automóvel?"]}`, icon: "credit-card" },
        { label: "Tipo de imóvel", type: "text", value: formData["Qual o tipo de Imóvel?"], icon: "home" },
        { label: "Propriedade", type: "text", value: formData["Imóvel próprio, de um familiar ou de terceiros?"], icon: "key" },
        { label: "Imóvel dentro de condomínio", type: "text", value: formData["Imóvel dentro de condomínio?"], icon: "check" },
        { label: "Possui matrícula do bem", type: "text", value: formData["Possui matrícula do bem?"], icon: "check" },
        { label: "Imóvel quitado", type: "text", value: formData["O imóvel está quitado?"], icon: "check" },
        { label: "Tempo para operação", type: "text", value: formData["Em quanto tempo pretende realizar a operação?"], icon: "check" },
      ],
    },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (label: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));
    // Limpa o erro do campo quando ele é alterado
    if (formErrors[label]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[label];
        return newErrors;
      });
    }
  };

  const currentStepData = steps.find((s) => s.step === currentStep);

  function validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  }

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData["Nome"]?.trim()) {
        errors["Nome"] = "Nome é obrigatório";
      }
      if (!formData["Email"]?.trim()) {
        errors["Email"] = "Email é obrigatório";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData["Email"])) {
        errors["Email"] = "Email inválido";
      }
      if (!formData["WhatsApp"]?.trim()) {
        errors["WhatsApp"] = "WhatsApp é obrigatório";
      } else if (formData["WhatsApp"].replace(/\D/g, "").length !== 11) {
        errors["WhatsApp"] = "WhatsApp inválido";
      }

      if (!formData["CPF"]?.trim()) {
        errors["CPF"] = "CPF é obrigatório";
      } else if (!validarCPF(formData["CPF"])) {
        errors["CPF"] = "CPF inválido";
      }

      if (!formData["Estado Civil"]?.trim()) {
        errors["Estado Civil"] = "Estado Civil é obrigatório";
      }

      const birthDateStr = formData["Data de Nascimento"];
      if (!birthDateStr?.trim()) {
        errors["Data de Nascimento"] = "Data de Nascimento é obrigatória";
      } else {
        const birthDate = new Date(birthDateStr);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const hasHadBirthdayThisYear = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        const isOver18 = age > 18 || (age === 18 && hasHadBirthdayThisYear);

        if (!isOver18) {
          errors["Data de Nascimento"] = "Você deve ter pelo menos 18 anos";
        }
      }

      if (formData["Estado Civil"] === "Casado (a)") {
        if (!formData["Nome do Cônjuge"]?.trim()) {
          errors["Nome do Cônjuge"] = "Nome do Cônjuge é obrigatório";
        }

        if (!formData["CPF do Cônjuge"]?.trim()) {
          errors["CPF do Cônjuge"] = "CPF do Cônjuge é obrigatório";
        } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData["CPF do Cônjuge"])) {
          errors["CPF do Cônjuge"] = "CPF do Cônjuge inválido";
        }

        const spouseBirth = formData["Data de Nascimento do Cônjuge"];
        if (!spouseBirth?.trim()) {
          errors["Data de Nascimento do Cônjuge"] = "Data de Nascimento do Cônjuge é obrigatória";
        } else {
          const birthDate = new Date(spouseBirth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const hasHadBirthdayThisYear = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

          const isOver18 = age > 18 || (age === 18 && hasHadBirthdayThisYear);

          if (!isOver18) {
            errors["Data de Nascimento do Cônjuge"] = "O cônjuge deve ter pelo menos 18 anos";
          }
        }

        if (formData["Profissão do Cônjuge"] && !formData["Profissão do Cônjuge"].trim()) {
          errors["Profissão do Cônjuge"] = "Profissão do Cônjuge inválida";
        }

        const rendaStr = formData["Renda bruta mensal do Cônjuge"]?.toString().trim();
        if (rendaStr) {
          const renda = parseFloat(rendaStr.replace(/[^\d,]/g, "").replace(",", "."));
          if (isNaN(renda) || renda < 0) {
            errors["Renda bruta mensal do Cônjuge"] = "Renda do Cônjuge inválida";
          }
        }
      }
    }

    if (step === 2) {
      const valorImovel = parseFloat(formData["Valor do imóvel"]?.replace(/[^\d,]/g, "").replace(",", ".") || "0");
      const valorEmprestimo = parseFloat(formData["Quanto você precisa?"]?.replace(/[^\d,]/g, "").replace(",", ".") || "0");

      if (!formData["Valor do imóvel"] || valorImovel === 0) {
        errors["Valor do imóvel"] = "Valor do imóvel é obrigatório";
      }

      if (!formData["Quanto você precisa?"] || valorEmprestimo === 0) {
        errors["Quanto você precisa?"] = "Valor do empréstimo é obrigatório";
      } else if (valorEmprestimo < 50000) {
        errors["Quanto você precisa?"] = "O valor do empréstimo não pode ser menor que R$ 50.000";
      } else if (valorEmprestimo > valorImovel * 0.6) {
        errors["Quanto você precisa?"] = "O valor do empréstimo não pode exceder 60% do valor do imóvel";
      }
    }

    if (step === 3 && !formData["Em quanto tempo pretende realizar a operação?"]?.trim()) {
      errors["Em quanto tempo pretende realizar a operação?"] = "Selecione uma opção";
    }

    if (step === 4) {
      if (!formData["CEP do imóvel em garantia"]?.trim()) {
        errors["CEP do imóvel em garantia"] = "CEP é obrigatório";
      } else if (!/^\d{5}-\d{3}$/.test(formData["CEP do imóvel em garantia"])) {
        errors["CEP do imóvel em garantia"] = "CEP inválido";
      }

      if (!formData["Profissão"]?.trim()) {
        errors["Profissão"] = "Profissão é obrigatória";
      }

      const renda = parseFloat(formData["Renda bruta mensal"]?.replace(/[^\d,]/g, "").replace(",", ".") || "0");
      if (!formData["Renda bruta mensal"] || renda === 0) {
        errors["Renda bruta mensal"] = "Renda bruta mensal é obrigatória";
      }

      if (!formData["Possui automóvel?"]?.trim()) {
        errors["Possui automóvel?"] = "Campo obrigatório";
      }
    }

    if (step === 5) {
      if (!formData["Imóvel dentro de condomínio?"]?.trim()) {
        errors["Imóvel dentro de condomínio?"] = "Campo obrigatório";
      }

      if (!formData["Possui matrícula do bem?"]?.trim()) {
        errors["Possui matrícula do bem?"] = "Campo obrigatório";
      }

      if (!formData["Qual o tipo de Imóvel?"]?.trim()) {
        errors["Qual o tipo de Imóvel?"] = "Campo obrigatório";
      }

      if (!formData["Imóvel próprio, de um familiar ou de terceiros?"]?.trim()) {
        errors["Imóvel próprio, de um familiar ou de terceiros?"] = "Campo obrigatório";
      }

      if (!formData["O imóvel está quitado?"]?.trim()) {
        errors["O imóvel está quitado?"] = "Campo obrigatório";
      }

      if (!formData["É produtivo?"]?.trim() && ["Chácara/Sítio", "Fazenda"].includes(formData["Qual o tipo de Imóvel?"])) {
        errors["É produtivo?"] = "Campo obrigatório";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateProgressForm = (step: number) => {
    fetch("https://hook.us2.make.com/g37sfs23xpca807alcy1tbv9oudflse6", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step, id, formData: { ...formData, "Imóvel próprio, de um familiar ou de terceiros?": formData["Imóvel próprio, de um familiar ou de terceiros?"] } }),
    });
  };

  const handleNavigation = async (action: string) => {
    if (action === buttons[1] && !validateStep(currentStep)) return;

    if (action === buttons[0] && currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else if (action === buttons[1] && currentStep < steps.length) {
      updateProgressForm(currentStep);
      setCurrentStep((prev) => prev + 1);
    } else if (action === buttons[2]) {
      setCurrentStep(1);
    } else if (action === buttons[3]) {
      updateProgressForm(currentStep);
      setIsSubmitting(true);

      const prazoEmMeses = parseInt(formData["Prazo (em meses)"], 10) || 0;
      const dataAtual = new Date();
      dataAtual.setMonth(dataAtual.getMonth() + prazoEmMeses);
      const dataFormatada = dataAtual.toISOString().split("T")[0];

      try {
        let contactId = null;
        const email = formData["Email"];

        const contactSearchResponse = await fetch(`${config.bitrix_webhook_url}/crm.contact.list.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: { EMAIL: email },
            select: ["ID"],
          }),
        });

        const contactSearchData = await contactSearchResponse.json();

        if (contactSearchData.result && contactSearchData.result.length > 0) {
          contactId = contactSearchData.result[0].ID;
        } else {
          const createContactResponse = await fetch(`${config.bitrix_webhook_url}/crm.contact.add.json`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fields: {
                NAME: formData["Nome"],
                EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
                PHONE: [{ VALUE: formData["WhatsApp"].replace(/[^\d]/g, ""), VALUE_TYPE: "WORK" }],
              },
            }),
          });

          const createContactData = await createContactResponse.json();

          if (createContactData.result) {
            contactId = createContactData.result;
          } else {
            throw new Error("Erro ao criar o contato no Bitrix24.");
          }
        }

        const valorImovel = Math.floor(Number(formData["Valor do imóvel"].replace(/[^\d]/g, "")) / 100);

        const possuiMatricula = formData["Possui matrícula do bem?"] === "Não";
        const tiposInvalidos = ["Chácara/Sítio", "Fazenda"];
        const tipoImovelInvalido = tiposInvalidos.includes(formData["Qual o tipo de Imóvel?"]) && formData["É produtivo?"] !== "Sim";
        const pretencao = formData["Em quanto tempo pretende realizar a operação?"] === "Acima de 3 meses";

        let lostReason = "";

        if (valorImovel < 110000) {
          lostReason = `Valor do imóvel abaixo do mínimo`;
        } else if (possuiMatricula) {
          lostReason = "Imóvel não possui matrícula";
        } else if (tipoImovelInvalido) {
          lostReason = `Tipo de imóvel inválido: ${formData["Qual o tipo de Imóvel?"]}`;
        } else if (pretencao) {
          lostReason = `Pretensão do cliente não atende os requisitos: "Acima de 3 meses"`;
        }

        const dealResponse = await fetch(`${config.bitrix_webhook_url}/crm.deal.add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: {
              STAGE_ID: lostReason ? "C29:NEW" : "C29:LOSE",
              CATEGORY_ID: "29",
              OPPORTUNITY: Math.floor(Number(formData["Quanto você precisa?"].replace(/[^\d]/g, "")) / 100) || 0,
              CURRENCY_ID: "BRL",
              ASSIGNED_BY_ID: getNextUserId?.() || 1,
              CONTACT_ID: contactId,
              TITLE: `${formData["Nome"]} - ${formData["Quanto você precisa?"]}`,
              UF_CRM_1746308361024: formData["Valor do imóvel"]?.replace(/[^\d]/g, ""), // Valor do imóvel
              UF_CRM_1746308334521: formData["Nome"], // Nome
              UF_CRM_1746308508986: formData["CPF"], // CPF
              UF_CRM_1746308493315: formData["Possui automóvel?"], // Possui automóvel?
              UF_CRM_1746308486670: formData["Possui matrícula do bem?"], // Possui matrícula do bem?
              UF_CRM_1746308479452: formData["Imóvel dentro de condomínio?"], // Imóvel dentro de condomínio?
              UF_CRM_1746308458687: formData["Estado Civil"], // Estado civil
              UF_CRM_1746308448991: formData["O imóvel está quitado?"], // Imóvel está quitado?
              UF_CRM_1746308442412: formData["Imóvel próprio, de um familiar ou de terceiros?"], // Tipo de propriedade
              UF_CRM_1746308425185: formData["Qual o tipo de Imóvel?"], // Tipo de imóvel
              UF_CRM_1746308403304: formData["Profissão"], // Profissão
              UF_CRM_1746308394572: formData["CEP do imóvel em garantia"], // CEP do imóvel
              UF_CRM_1746308383159: formData["Em quanto tempo pretende realizar a operação?"], // Tempo para operação
              UF_CRM_1746308369420: dataFormatada, // Prazo (em meses)
              UF_CRM_1746388766: lostReason, // Motivo da perda
              UF_CRM_1746308303922: formData["Email"], // Email
              UF_CRM_1746308266058: formData["WhatsApp"], // WhatsApp
              UF_CRM_1746308470019: formData["Renda bruta mensal"]?.replace(/[^\d]/g, ""), // Renda bruta mensal
              UF_CRM_1746461140: formData["Data de Nascimento"], // Data de Nascimento

              UF_CRM_1746461331: formData["Nome do Cônjuge"], // Nome do Cônjuge
              UF_CRM_1746461454: formData["CPF do Cônjuge"], // CPF do Cônjuge
              UF_CRM_1746461525: formData["Data de Nascimento do Cônjuge"], // Data de nascimento do cônjuge
              UF_CRM_1746461571: formData["Profissão do Cônjuge"], // Profissão do cônjuge
              UF_CRM_1746461618: formData["Renda bruta mensal do Cônjuge"]?.replace(/[^\d]/g, ""), // Renda do cônjuge

              UF_CRM_PRODUTIVO: formData["É produtivo?"], // Imóvel é produtivo?
            },
          }),
        });

        const dealData = await dealResponse.json();

        if (!dealData.result) throw new Error("");

        Swal.fire({
          background: "rgba(18, 18, 18, 0.95)",
          backdrop: `
      rgba(15, 15, 15, 0.8)
      left top
      no-repeat
    `,
          customClass: {
            popup: "rounded-2xl border border-[#1a1a1a] shadow-2xl",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
          title: `<span style="color: #ffcf02;">Parabéns! Sua solicitação</span><br><span style="color: #ffcf02;">foi recebida com sucesso.</span>`,
          html: `
      📩 Seu pedido está agora na fila prioritária para análise.<br><br>
      Um de nossos especialistas já começou a trabalhar na melhor proposta para você e entrará em contato em breve.<br><br>
      <strong style="color: #ffcf02;">Fique atento ao seu WhatsApp e e-mail.</strong><br>
      Em alguns instantes te enviaremos uma mensagem para agendarmos uma reunião para conversarmos sobre sua solicitação, ok?
    `,
          icon: "success",
          confirmButtonText: "Fechar",
          confirmButtonColor: "#ffcf02",
          iconColor: "#ffcf02",
        }).then((result) => {
          if (result.isConfirmed) {
            return;
            setCurrentStep(1);
            setFormData({
              Nome: "",
              Email: "",
              WhatsApp: "",
              "Estado Civil": "",
              CPF: "",
              "Valor do imóvel": "",
              "Quanto você precisa?": "",
              "Prazo (em meses): {value}": "12",
              "Em quanto tempo pretende realizar a operação?": "",
              "CEP do imóvel em garantia": "",
              Profissão: "",
              "Renda bruta mensal": "",
              "Possui automóvel?": "",
              "Qual o tipo de Imóvel?": "",
              "Imóvel dentro de condomínio?": "",
              "Possui matrícula do bem?": "",
              "Imóvel próprio, de um familiar ou de terceiros?": "",
              "O imóvel está quitado?": "",
            });
          }
        });
      } catch (error) {
        console.error("Erro:", error);
        Swal.fire({
          background: "rgba(18, 18, 18, 0.95)",
          backdrop: `rgba(15, 15, 15, 0.8) left top no-repeat`,
          customClass: {
            popup: "rounded-2xl border border-[#1a1a1a] shadow-2xl",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
          title: "Ops! Algo deu errado",
          text: "Não foi possível criar o lead. Por favor, tente novamente.",
          icon: "error",
          confirmButtonText: "Tentar novamente",
          confirmButtonColor: "#ffcf02",
          iconColor: "#ffcf02",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <StepIndicator currentStep={currentStep} totalSteps={steps.length} progress={currentStepData?.progress || "0%"} />

      <div className={`${currentStep === 6 ? "grid grid-cols-2 gap-6" : "space-y-6"}`}>
        {currentStepData?.fields.map((field, index) => (
          <FormField key={field.label} {...field} value={currentStep === 6 ? field.value : formData[field.label]} error={formErrors[field.label]} onChange={(value) => handleFieldChange(field.label, value)} />
        ))}
      </div>

      <div className={`${currentStep === 6 ? "mt-12" : "mt-8"} flex justify-between gap-4`}>
        {currentStep > 1 && (
          <button onClick={() => handleNavigation(buttons[0])} className="px-6 py-3 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700">
            {buttons[0]}
          </button>
        )}

        {currentStep < steps.length ? (
          <button onClick={() => handleNavigation(buttons[1])} className="px-6 py-3 text-sm font-medium text-black bg-[#ffcf02] rounded-lg hover:bg-[#ffcf02]/90 focus:outline-none focus:ring-2 focus:ring-[#ffcf02]">
            {buttons[1]}
          </button>
        ) : (
          <div className="flex gap-4">
            <button onClick={() => handleNavigation(buttons[2])} className="px-6 py-3 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700">
              {buttons[2]}
            </button>
            <button onClick={() => handleNavigation(buttons[3])} className="px-6 py-3 text-sm font-medium text-black bg-[#ffcf02] rounded-lg hover:bg-[#ffcf02]/90 focus:outline-none focus:ring-2 focus:ring-[#ffcf02]" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </div>
              ) : (
                buttons[3]
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
