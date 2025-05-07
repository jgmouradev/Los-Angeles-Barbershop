document.addEventListener('DOMContentLoaded', function() {
    const formularioAgendamento = document.querySelector('form');
    const agendamentoInfoContainer = document.getElementById('agendamento-info');
    const agendamentoDataSpan = document.getElementById('agendamento-data');
    const agendamentoHorarioSpan = document.getElementById('agendamento-horario');
    const agendamentoServicoSpan = document.getElementById('agendamento-servico');
    const agendamentoDuracaoSpan = document.getElementById('agendamento-duracao');
    const agendamentoProfissionalSpan = document.getElementById('agendamento-profissional');
    const nomeClienteH2 = agendamentoInfoContainer ? agendamentoInfoContainer.querySelector('h2') : null;
    const botoesHorario = document.querySelectorAll('.hours-list button');
    const dateInput = document.getElementById('date');
    let horarioSelecionado = null;
  
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
  
    if (dateInput) {
      const hojeCarregamento = new Date();
      const anoHojeCarregamento = hojeCarregamento.getFullYear();
      let mesHojeCarregamento = hojeCarregamento.getMonth() + 1;
      let diaHojeCarregamento = hojeCarregamento.getDate();
  
      mesHojeCarregamento = String(mesHojeCarregamento).padStart(2, '0');
      diaHojeCarregamento = String(diaHojeCarregamento).padStart(2, '0');
  
      const dataAtualFormatada = `${anoHojeCarregamento}-${mesHojeCarregamento}-${diaHojeCarregamento}`;
      dateInput.min = dataAtualFormatada;
      dateInput.value = dataAtualFormatada;
  
      atualizarDisponibilidadeHorarios();
      dateInput.addEventListener('change', atualizarDisponibilidadeHorarios);
    }
  
    botoesHorario.forEach(botao => {
      botao.addEventListener('click', function() {
        botoesHorario.forEach(btn => btn.classList.remove('selecionado'));
        this.classList.add('selecionado');
        horarioSelecionado = this.value;
        console.log('Horário Selecionado:', horarioSelecionado);
      });
    });
  
    function exibirInfoAgendamento(agendamento) {
      if (agendamentoInfoContainer && nomeClienteH2 && agendamentoDataSpan && agendamentoHorarioSpan && agendamentoServicoSpan && agendamentoProfissionalSpan && agendamentoDuracaoSpan) {
        nomeClienteH2.textContent = `${agendamento.nome}, será um prazer recebê-lo na Los Angeles Barbershop.`;
        agendamentoDataSpan.textContent = agendamento.data;
        agendamentoHorarioSpan.textContent = agendamento.horario;
        agendamentoServicoSpan.textContent = agendamento.servico;
        agendamentoProfissionalSpan.textContent = agendamento.profissional;
  
        let duracao = '';
        if (agendamento.servico === 'Barba') {
          duracao = '30 minutos';
        } else if (agendamento.servico === 'Cabelo') {
          duracao = '45 minutos';
        } else if (agendamento.servico === 'Barba e Cabelo') {
          duracao = '1 hora';
        }
        agendamentoDuracaoSpan.textContent = duracao;
  
        agendamentoInfoContainer.style.display = 'block';
        formularioAgendamento.style.display = 'none';
      }
    }
  
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
  
        formularioAgendamento.reset();
        horarioSelecionado = null;
        botoesHorario.forEach(btn => btn.classList.remove('selecionado'));
  
        exibirInfoAgendamento(agendamento);
  
        const agendamentosSalvos = localStorage.getItem('agendamentos');
        let listaDeAgendamentos = agendamentosSalvos ? JSON.parse(agendamentosSalvos) : [];
        listaDeAgendamentos.push(agendamento);
        localStorage.setItem('agendamentos', JSON.stringify(listaDeAgendamentos));
  
        if (typeof exibirAgendamentos === 'function') {
          exibirAgendamentos();
        }
  
      } else {
        alert('Por favor, selecione um horário.');
      }
    });
  
    function exibirAgendamentos() {
      const listaAgendamentosElemento = document.getElementById('lista-de-agendamentos');
      if (listaAgendamentosElemento) {
        listaAgendamentosElemento.innerHTML = '';
        const agendamentosSalvos = localStorage.getItem('agendamentos');
        const listaDeAgendamentos = agendamentosSalvos ? JSON.parse(agendamentosSalvos) : [];
  
        if (listaDeAgendamentos.length > 0) {
          listaDeAgendamentos.forEach(agendamento => {
            const novoItemLista = document.createElement('li');
            novoItemLista.textContent = `Nome: ${agendamento.nome}, Telefone: ${agendamento.telefone}, Serviço: ${agendamento.servico}, Barbeiro: ${agendamento.profissional}, Data: ${agendamento.data}, Horário: ${agendamento.horario}`;
            listaAgendamentosElemento.appendChild(novoItemLista);
          });
        } else {
          const mensagemListaVazia = document.createElement('li');
          mensagemListaVazia.textContent = 'Nenhum agendamento realizado ainda.';
          listaAgendamentosElemento.appendChild(mensagemListaVazia);
        }
      }
    }
  
    exibirAgendamentos();
  });