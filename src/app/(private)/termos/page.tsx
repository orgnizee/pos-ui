export default function Proposta() {
  return (
    <main className="p-4 sm:px-10">
      {/* HEADER */}
      <section className="grid grid-cols-1 sm:grid-cols-4">
        {/* TABLE OF CONTENT */}
        <div>
          <div className="sm:fixed flex flex-col mt-7 p-4 h-fit w-ful sm:w-72 rounded-lg shadow-md bg-secondary/15 backdrop-blur-sm">
            <p className="p-1 pt-2 text-sm font-bold">Nesse documento</p>
            <a
              href="#diagnostico-pesquisa"
              className="p-1 pt-1 text-sm rounded-lg hover:bg-primary/5"
            >
              1. diagnóstico & pesquisa
            </a>
            <a
              href="#servico"
              className="p-1 text-sm rounded-lg hover:bg-primary/5"
            >
              2. termos do serviço
            </a>
            <a
              href="#prazo"
              className="p-1 text-sm rounded-lg hover:bg-primary/5"
            >
              3. prazo
            </a>
            <a
              href="#valores"
              className="p-1 text-sm rounded-lg hover:bg-primary/5"
            >
              4. valores
            </a>
          </div>
        </div>

        {/* CONTENT */}
        <div className="col-span-3 mt-4 sm:ml-10 p-2 sm:p-4">
          <p className="text-3xl">PROJETO 2026.03.12</p>
          <p className="text-sm normal-case">
            Atualizado em 14 de março de 2026.
          </p>

          {/* DIGNÓSTICO & PESQUISA */}
          <section>
            <p className="mt-6 text-xl font-bold">■</p>
            <h1
              id="diagnostico-pesquisa"
              className="text-2xl font-bold text-start"
            >
              dignóstico & pesquisa
            </h1>

            <div className="mt-2 sm:mr-40">
              <p className="normal-case">
                Empreendimento no setor automotivo rodoviário especializado nos
                serviços de <span className="code">estacionamento</span>,{" "}
                <span className="code">lavagem</span> e{" "}
                <span className="code">manutenção</span> de veículos. Com base
                de clientes majoritariamente recorrente, composta por usuários
                mensais e quinzenais, havendo poucos atendimentos avulsos.
                <br />
              </p>
            </div>

            <article>
              <p className="mt-6 text-lg font-bold text-start">desafio atual</p>
              <div className="mt-2 sm:mr-40">
                <p className="normal-case">
                  Os processos manuais feitos em papel se tornaram um gargalo na
                  operação, demandando tempo, pessoas e recursos que poderiam
                  estar direcionados a atividades mais estratégicas da empresa.
                  <br />
                  <br />O desafio é modernizar a operação, substituindo a
                  utilização da antiga ordem de serviço em papel por um sistema
                  de gerenciamento, capaz de aumentar a eficiência e agilizar as
                  atividades do dia a dia.
                </p>
              </div>
            </article>

            <article>
              <p className="mt-6 text-lg font-bold text-start">objetivos</p>
              <div className="mt-2 sm:mr-40 normal-case">
                <p className="p-1 ring-1 ring-secondary/50 rounded-md bg-secondary/10">
                  <span className="code">[1]</span> O objetivo principal é
                  eliminar o uso de papel, reduzindo erros humanos e criando uma
                  base de dados unificada com informações relevantes,
                  organizadas e precisas sobre toda a operação.
                </p>
                <p className="p-1 ring-1 ring-secondary/50 rounded-md bg-secondary/10">
                  <span className="code">[2]</span> Automatizar o registro de
                  entrada de veículos por imagem, vinculando automaticamente
                  placa, cliente e motorista*.
                </p>
                <p className="p-1 ring-1 ring-secondary/50 rounded-md bg-secondary/10">
                  <span className="code">[3]</span> Envio automático de
                  notificações por e-mail aos clientes sobre o andamento do
                  serviço.
                </p>
                <p className="p-1 ring-1 ring-secondary/50 rounded-md bg-secondary/10">
                  <span className="code">[4]</span> Relatórios de vendas e
                  financeiros organizados por período.
                </p>
                <p className="p-1 ring-1 ring-secondary/50 rounded-md bg-secondary/10">
                  <span className="code">[5]</span> Disponibilização de
                  agendamento online com lista de serviços, horários disponíveis
                  e valores.
                </p>
              </div>
            </article>
          </section>

          {/* SERVIÇO */}
          <section>
            <p className="mt-24 text-xl font-bold">■</p>
            <h1 id="servico" className="text-2xl font-bold text-start">
              termos do serviço
            </h1>

            <div className="mt-2 sm:mr-40 normal-case">
              <p>
                Esta prestação de serviço tem como objetivo o desenvolvimento e
                a integração de funcionalidades personalizadas na plataforma da
                Nizee, voltadas ao gerenciamento do serviço de{" "}
                <span className="font-bold">lavagem</span> da Center Truck.
              </p>
              <p>
                <br />
                Funcionalidades que visam{" "}
                <span className="font-bold">
                  atingir os objetivos identificados
                </span>{" "}
                na fase de diagnóstico e pesquisa.
              </p>
              <p>
                <br />O sistema tem como base nossa plataforma web, garantindo
                flexibilidade de utilização em{" "}
                <span className="font-bold">celulares</span>,{" "}
                <span className="font-bold">tablets</span> e{" "}
                <span className="font-bold">computadores</span>.
              </p>
            </div>
          </section>

          {/* PRAZO */}
          <section>
            <p className="mt-24 text-xl font-bold">■</p>
            <h1 id="prazo" className="text-2xl font-bold text-start">
              prazo
            </h1>

            <div className="mt-2 sm:mr-40 normal-case">
              <p>
                Passamos por quatro etapas no processo de construção do sistema.
              </p>
              <p>
                <span className="font-bold">1. Diagnóstico e pesquisa</span>
                <br />
                Nesse primeiro momento o negócio é estudado e mapeado com
                detalhe para entender os fluxos e processos. Se necessário
                poderá ser realizado entrevistas com colaboradores e visitas
                técnicas.
              </p>
              <p>
                <span className="font-bold">2. Desenvolvimento</span>
                <br />
                No desenvolvimento priorizamos a entrega de uma versão teste do
                sistema com as principais funcionalidades para o uso diário,
                permitindo identificar padrões de uso, coletar feedbacks e
                mapear novas necessidades ainda não identificadas.
              </p>
              <p>
                <span className="font-bold">3. Implementação</span>
                <br /> Implantação da versão final do sistema, contendo todos os
                módulos e funcionalidades definidos, com suporte durante a
                migração de dados e treinamento dos usuários para utilização da
                plataforma.
              </p>
              <p>
                <span className="font-bold">4. Refinamento</span>
                <br />
                Coletar feedbacks para realizar ajustes. Fazer correções de
                bugs. Melhorar o design das interfaces. Essa etapa final é para
                olhar os detalhes e certificar qualidade máxima na entrega.
              </p>
            </div>

            <article className="sm:mr-40">
              <div className="mt-2 ring-1 ring-secondary/50 rounded-md bg-secondary/10">
                <table className="w-full">
                  <thead className="ring-1 ring-secondary/50 rounded-md">
                    <tr>
                      <th className="p-2 text-left ring-1 ring-secondary/50 rounded-md">
                        prazo estimado
                      </th>
                      <th className="p-2 text-left ring-1 ring-secondary/50 rounded-md">
                        etapa
                      </th>
                    </tr>
                  </thead>
                  <tbody className="normal-case align-text-top">
                    <tr>
                      <td className="p-2 ring-1 ring-secondary/50 rounded-md">
                        10 a 20 dias
                      </td>
                      <td className="p-2 ring-1 ring-secondary/50 rounded-md">
                        Diagnóstico e pesquisa
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 ring-1 ring-secondary/50 rounded-md">
                        30 a 40 dias
                      </td>
                      <td className="p-2 ring-1 ring-secondary/50 rounded-md">
                        Desenvolvimento
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 ring-1 ring-secondary/50 rounded-md">
                        50 a 60 dias
                      </td>
                      <td className="p-2 ring-1 ring-secondary/50 rounded-md">
                        Implementação
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 ring-1 ring-secondary/50 rounded-md">
                        O tempo necessário
                      </td>
                      <td className="p-2 ring-1 ring-secondary/50 rounded-md">
                        Refinamento
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <div className="mt-2 sm:mr-40 normal-case">
              <p>
                O tempo estimado para garantir a máxima qualidade na entrega é
                de <span className="font-bold">3 a 4 meses.</span>
              </p>
              <p className="normal-case">
                <br /> O desenvolvimento seguirá um modelo iterativo. Caso
                surjam novas necessidades ou obstáculos técnicos, o ciclo pode
                ser retomado desde a primeira etapa. Por exemplo, se durante a
                implementação forem identificados problemas técnicos, será
                possível retornar à fase de diagnóstico e pesquisa para definir
                uma solução mais adequada.
              </p>
            </div>
          </section>

          {/* VALORES */}
          <section>
            <p className="mt-24 text-xl font-bold">■</p>
            <h1 id="valores" className="text-2xl font-bold text-start">
              valores
            </h1>

            <div className="mt-2 sm:mr-40">
              <p className="normal-case">
                O valor apresentado abaixo refere-se ao desenvolvimento de
                funcionalidades personalizadas que serão integradas à plataforma
                da Nizee, com o objetivo de atender às necessidades previamente
                identificadas.
              </p>
            </div>

            <div className="mt-8 sm:mr-40">
              <p className="font-bold text-xl">R$ 10.000,00</p>
              <p className="text-sm normal-case">
                Pagamento em 4 parcelas de R$ 2.500,00, distribuídas ao longo do
                período de prestação do serviço, com início no primeiro mês e
                término no quarto mês.
              </p>
            </div>

            <div className="mt-8 sm:mr-40">
              <p className="normal-case">
                Após o desenvolvimento e a entrada em operação, o sistema terá
                uma assinatura mensal de R$ 299,00, que inclui suporte,
                manutenção e atualizações.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
