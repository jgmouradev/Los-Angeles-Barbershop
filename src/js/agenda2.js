// Variável para armazenar o horário selecionado (escopo global)
let horarioSelecionado = null;

document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('date');
  const formularioAgendamento = document.querySelector('form');
  const agendamentoInfoContainer = document.getElementById('agendamento-info');
  const agendamentoDataSpan = document.getElementById('agendamento-data');
  const agendamentoHorarioSpan = document.getElementById('agendamento-horario');
  const agendamentoServicoSpan = document.getElementById('agendamento-servico');
  const agendamentoDuracaoSpan = document.getElementById('agendamento-duracao');
  const agendamentoProfissionalSpan = document.getElementById('agendamento-profissional');
  const nomeClienteH2 = agendamentoInfoContainer ? agendamentoInfoContainer.querySelector('h2') : null;
  const botoesHorario = document.querySelectorAll('.hours-list button');
  const dataAgendamentoExtensoSpan = document.getElementById('dataAgendamentoExtenso');
  const hoje = new Date();

  // Carrega a data atual no input da data e define o atributo min
  if (dateInput) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    let mes = hoje.getMonth() + 1;
    let dia = hoje.getDate();

    mes = String(mes).padStart(2, '0');
    dia = String(dia).padStart(2, '0');

    const dataAtualFormatada = `${ano}-${mes}-${dia}`;
    dateInput.min = dataAtualFormatada;
  }


  // Adiciona event listener para cada botão de horário
  botoesHorario.forEach(botao => {
    botao.addEventListener('click', function() {
      botoesHorario.forEach(btn => btn.classList.remove('selecionado'));
      this.classList.add('selecionado');
      horarioSelecionado = this.value;
      console.log('Horário Selecionado:', horarioSelecionado); // Para verificar no console
    });
  });

  // Função para atualizar a disponibilidade dos horários
  function atualizarDisponibilidadeHorarios() {
    if (!dateInput) return;
    const dataSelecionada = dateInput.value;
    const hoje = new Date();
    const anoHoje = hoje.getFullYear();
    const mesHoje = hoje.getMonth() + 1;
    const diaHoje = hoje.getDate();
    const horaAgora = hoje.getHours();
    const minutoAgora = hoje.getMinutes();

    botoesHorario.forEach(botao => {
      botao.disabled = false;
      const horaBotao = parseInt(botao.value.split(':')[0]);
      const minutoBotao = parseInt(botao.value.split(':')[1]);

      if (dataSelecionada === `${anoHoje}-${String(mesHoje).padStart(2, '0')}-${String(diaHoje).padStart(2, '0')}`) {
        if (horaBotao < horaAgora || (horaBotao === horaAgora && minutoBotao <= minutoAgora)) {
          botao.disabled = true;
        }
      } else if (new Date(dataSelecionada) < new Date(`${anoHoje}-${String(mesHoje).padStart(2, '0')}-${String(diaHoje).padStart(2, '0')}`)) {
        botao.disabled = true;
      }
    });
  }

  // Chama a função de atualização na carga da página e quando a data muda
  if (dateInput) {
    atualizarDisponibilidadeHorarios();
    dateInput.addEventListener('change', atualizarDisponibilidadeHorarios);
  }

  // Função para exibir as informações do agendamento (após o agendamento ser feito)
  function exibirInfoAgendamento(agendamento) {
    if (agendamentoInfoContainer && nomeClienteH2 && agendamentoDataSpan && agendamentoHorarioSpan && agendamentoServicoSpan && agendamentoProfissionalSpan && agendamentoDuracaoSpan) {
      nomeClienteH2.textContent = `${agendamento.nome}, será um prazer recebê-lo na Los Angeles Barbershop.`;
      agendamentoDataSpan.textContent = agendamento.data;
      agendamentoHorarioSpan.textContent = agendamento.horario;
      agendamentoServicoSpan.textContent = agendamento.servico;
      agendamentoProfissionalSpan.textContent = agendamento.profissional;

      let duracao = '';
      if (agendamento.servico === 'Barba') {
        duracao = `30 minutos`;
      } else if (agendamento.servico === 'Cabelo') {
        duracao = `30 minutos`;
      } else if (agendamento.servico === 'Barba e Cabelo') {
        duracao = `1 hora`;
      }
      agendamentoDuracaoSpan.textContent = duracao;

      agendamentoInfoContainer.style.display = 'block';
      formularioAgendamento.style.display = 'none';
    }
  }

  // Função para exibir os agendamentos salvos
  function exibirAgendamentosSalvos() {
    const listaAgendamentos = document.querySelector('.agenda-cliente ul'); // Ajuste o seletor se necessário
    if (listaAgendamentos) {
      listaAgendamentos.innerHTML = ''; // Limpa a lista

      const agendamentosSalvos = localStorage.getItem('agendamentos');
      if (agendamentosSalvos) {
        const agendamentos = JSON.parse(agendamentosSalvos);
        agendamentos.forEach(agendamento => {
          const dataOriginal = agendamento.data;
          const partesData = dataOriginal.split('-');
          const ano = partesData[0];
          const mes = partesData[1];
          const dia = partesData[2];
          const dataFormatada = `${dia}/${mes}/${ano}`;

          const listItem = document.createElement('li');
          listItem.innerHTML = `<i class="fa-regular fa-calendar"></i>Data : ${dataFormatada} <br>
                                <i class="fa-regular fa-clock"></i>Horário : ${agendamento.horario} <br>
                                <i class="fa-regular fa-square-check"></i>Serviço Escolhido : ${agendamento.servico} <br>
                                <i class="fa-regular fa-id-badge"></i>Profissional Escolhido : ${agendamento.profissional}
                                `;

          listaAgendamentos.appendChild(listItem);
        });
      } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'Nenhum agendamento salvo ainda.';
        listaAgendamentos.appendChild(listItem);
      }
    }
  }

  // Chama a função para exibir os agendamentos na carga da página
  exibirAgendamentosSalvos();

  // Event listener para o submit do formulário
  formularioAgendamento.addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('name').value;
    const telefone = document.getElementById('phone').value;
    const servico = document.querySelector('input[name="servico"]:checked').value;
    const profissional = document.getElementById('prof-select').value;
    const data = document.getElementById('date').value;

    if (horarioSelecionado) {
      const agendamento = {
        nome: nome,
        telefone: telefone,
        servico: servico,
        profissional: profissional,
        data: data,
        horario: horarioSelecionado
      };

      // Salva o agendamento no localStorage
      const agendamentos = localStorage.getItem('agendamentos') ? JSON.parse(localStorage.getItem('agendamentos')) : [];
      agendamentos.push(agendamento);
      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

      formularioAgendamento.reset();
      horarioSelecionado = null;
      botoesHorario.forEach(btn => btn.classList.remove('selecionado'));

      exibirInfoAgendamento(agendamento);
      exibirAgendamentosSalvos(); // Atualiza a lista de agendamentos exibida
    } else {
      alert('Por favor, selecione um horário.');
    }
  });
});