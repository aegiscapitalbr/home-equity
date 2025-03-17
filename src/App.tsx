import React from "react";
import { LoanForm } from "./components/LoanForm";
import { AppProvider } from "./contexts/app.context";

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-8 sm:pb-16">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-8">
              <div className="space-y-8 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#ffcf02] backdrop-blur-sm bg-opacity-90 border border-[#ffcf02]/20 shadow-lg">
                    <span className="text-sm font-medium text-black">A melhor solução do mercado</span>
                  </div>
                </div>
                <h2 className="text-[2.5rem] leading-[1.1] sm:text-5xl font-bold">
                  Caixa rápido
                  <br />
                  <span className="text-[#ffcf02]">garantia de imóvel.</span>
                </h2>
                <p className="text-xl sm:text-2xl text-gray-400 mt-8 space-y-6 max-w-2xl mx-auto lg:mx-0">
                  <span className="block font-medium">Libere opções de crédito de até R$20 milhões.</span>
                  <span className="block text-2xl sm:text-3xl text-white font-medium">Faça uma simulação abaixo para marcar sua reunião com um de nossos especialistas.</span>
                </p>
              </div>

              {/* Form below text */}
              <div className="bg-[#121212] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-[#1a1a1a]">
                <LoanForm />
              </div>

              {/* CTA Section */}
              <div className="bg-[#121212] rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#1a1a1a] shadow-2xl">
                <div className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Garanta um empréstimo seguro
                    <br />
                    <span className="text-[#ffcf02]">para resolver seus problemas.</span>
                  </h2>

                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                    Não perca mais tempo. Nós podemos te ajudar a conseguir seu crédito com as melhores condições e com o melhor prazo para você. Deixa que a gente te ajuda, com a <span className="text-[#ffcf02] font-medium">AÉGIS</span>, tudo é mais fácil.
                  </p>

                  <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-black font-medium bg-[#ffcf02] rounded-lg sm:rounded-xl hover:bg-[#ffcf02]/90 transition-colors duration-200 shadow-lg hover:shadow-[#ffcf02]/20 flex items-center justify-center gap-2 group">
                    Quero liberar meu crédito!
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Tech Image */}
            <div className="block lg:w-[500px] space-y-6 sm:space-y-8 mt-8 lg:mt-0">
              {/* Credit Uses Block */}
              <div className="bg-[#121212] rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#1a1a1a] mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 space-y-2">
                  <div>Levamos a solução até você.</div>
                  <div className="text-[#ffcf02]">Use o crédito para:</div>
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="group p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#ffcf02]/5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#ffcf02] rounded-full group-hover:scale-125 transition-transform" />
                      <p className="text-gray-300 group-hover:text-white transition-colors">Capital de giro para seu negócio</p>
                    </div>
                  </div>

                  <div className="group p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#ffcf02]/5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#ffcf02] rounded-full group-hover:scale-125 transition-transform" />
                      <p className="text-gray-300 group-hover:text-white transition-colors">Investimento estratégico</p>
                    </div>
                  </div>

                  <div className="group p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#ffcf02]/5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#ffcf02] rounded-full group-hover:scale-125 transition-transform" />
                      <p className="text-gray-300 group-hover:text-white transition-colors">Aquisição de bens</p>
                    </div>
                  </div>

                  <div className="group p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#ffcf02]/5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#ffcf02] rounded-full group-hover:scale-125 transition-transform" />
                      <p className="text-gray-300 group-hover:text-white transition-colors">Organizar os benefícios trabalhistas dos funcionários</p>
                    </div>
                  </div>

                  <div className="group p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#ffcf02]/5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#ffcf02] rounded-full group-hover:scale-125 transition-transform" />
                      <p className="text-gray-300 group-hover:text-white transition-colors">Reforma ou construção</p>
                    </div>
                  </div>

                  <div className="group p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#ffcf02]/5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#ffcf02] rounded-full group-hover:scale-125 transition-transform" />
                      <p className="text-gray-300 group-hover:text-white transition-colors">Consolidação de dívidas</p>
                    </div>
                  </div>

                  <div className="group p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#ffcf02]/5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#ffcf02] rounded-full group-hover:scale-125 transition-transform" />
                      <p className="text-gray-300 group-hover:text-white transition-colors">Reestruturação financeira</p>
                    </div>
                  </div>

                  <div className="group p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#ffcf02]/5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#ffcf02] rounded-full group-hover:scale-125 transition-transform" />
                      <p className="text-gray-300 group-hover:text-white transition-colors">Emergências médicas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Text Block */}
              <div className="bg-[#121212] rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#1a1a1a]">
                <h3 className="text-lg sm:text-xl font-medium text-gray-300 mb-4">
                  Na <span className="text-[#ffcf02] font-semibold">AÉGIS</span>, simplificamos suas operações com soluções inteligentes e práticas. Confira:
                </h3>

                {/* Benefits List */}
                <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                  <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl">
                    <div className="w-2 h-2 bg-[#ffcf02] rounded-full" />
                    <p className="text-gray-300">Crédito de R$30 mil a R$25 milhões de reais</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl">
                    <div className="w-2 h-2 bg-[#ffcf02] rounded-full" />
                    <p className="text-gray-300">Para pessoa Física ou jurídica</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl">
                    <div className="w-2 h-2 bg-[#ffcf02] rounded-full" />
                    <p className="text-gray-300">Carência de até 3 meses</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl">
                    <div className="w-2 h-2 bg-[#ffcf02] rounded-full" />
                    <p className="text-gray-300">Flexibilidade na composição de renda e garantia</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl">
                    <div className="w-2 h-2 bg-[#ffcf02] rounded-full" />
                    <p className="text-gray-300">Prazo de até 240 meses para pagar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
