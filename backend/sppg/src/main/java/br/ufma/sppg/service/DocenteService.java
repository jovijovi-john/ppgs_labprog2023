package br.ufma.sppg.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import br.ufma.sppg.dto.Indice;
import br.ufma.sppg.dto.QualisDocenteDTO;
import br.ufma.sppg.model.*;
import br.ufma.sppg.repo.DocenteRepository;
import br.ufma.sppg.service.exceptions.ServicoRuntimeException;
import jakarta.transaction.Transactional;

@Service
public class DocenteService {

    @Autowired
    DocenteRepository repository;

    @Autowired
    ProducaoService producaoService;

    public List<Docente> obterDocentes() {
        Sort sort = Sort.by(Sort.Direction.ASC, "nome");
        return repository.findAll(sort);
    }

    // Retorna o Docente e a quantidade de producao de cada qualis.
    public QualisDocenteDTO obterQualisDocente(Integer idDocente, Integer anoIni, Integer anoFim) {

        Optional<Docente> docenteObj = obterDocente(idDocente);

        if (docenteObj.isPresent()) {
            List<Producao> producaoDocente = producaoService.obterProducoesDocente(idDocente, anoIni, anoFim);

            int[] qualis = new int[9];

            for (Producao producao : producaoDocente) {

                String qualisValue = producao.getQualis();

                if (qualisValue != null) {
                    switch (qualisValue) {
                        case "A1":
                            qualis[0]++;
                            break;
                        case "A2":
                            qualis[1]++;
                            break;
                        case "A3":
                            qualis[2]++;
                            break;
                        case "A4":
                            qualis[3]++;
                            break;
                        case "B1":
                            qualis[4]++;
                            break;
                        case "B2":
                            qualis[5]++;
                            break;
                        case "B3":
                            qualis[6]++;
                            break;
                        case "B4":
                            qualis[7]++;
                            break;
                        case "C":
                            qualis[8]++;
                            break;
                    }
                }
            }

            QualisDocenteDTO qualisDocente = new QualisDocenteDTO(docenteObj.get(), qualis);
            return qualisDocente;
        }

        throw new ServicoRuntimeException("A técnica informada não existe!");
    }

    public Indice obterIndice(Integer idDocente, Integer anoIni, Integer anoFin) {
        verificarId(idDocente);
        verificarData(anoIni, anoFin);
        Double iRestrito = 0.0;
        Double iNRestrito = 0.0;
        Double iGeral = 0.0;
        List<Producao> producoes = new ArrayList<>();

        producoes = repository.obterProducoes(idDocente, anoIni, anoFin);

        for (Producao producao : producoes) {

            switch (producao.getQualis()) {
                case "A1":
                    iRestrito += 1.0f;
                    break;

                case "A2":
                    iRestrito += 0.85;
                    break;

                case "A3":
                    iRestrito += 0.725;
                    break;

                case "A4":
                    iRestrito += 0.625;
                    break;

                case "B1":
                    iNRestrito += 0.5;
                    break;

                case "B2":
                    iNRestrito += 0.25;
                    break;

                case "B3":
                    iNRestrito += 0.1;
                    break;

                case "B4":
                    iNRestrito += 0.05;
                    break;

                default:
                    throw new ServicoRuntimeException("Uma das produções possui o Qualis inválido");
            }
        }

        iGeral = iRestrito + iNRestrito;

        return new Indice(iRestrito, iNRestrito, iGeral);
    }

    public List<Producao> obterProducoes(Integer idDocente, Integer anoIni, Integer anoFin) {
        verificarId(idDocente);
        verificarData(anoIni, anoFin);

        return repository.obterProducoes(idDocente, anoIni, anoFin);

    }

    public List<Orientacao> obterOrientacoes(Integer idDocente, Integer anoIni, Integer anoFin) {
        verificarId(idDocente);
        verificarData(anoIni, anoFin);

        return repository.obterOrientacoes(idDocente, anoIni, anoFin);

    }

    public List<Tecnica> obterTecnicas(Integer idDocente, Integer anoIni, Integer anoFin) {
        verificarId(idDocente);
        verificarData(anoIni, anoFin);

        return repository.obterTecnicas(idDocente, anoIni, anoFin);

    }

    @Transactional
    public Docente salvarDocente(Docente doc) {
        verificarDocente(doc);

        return repository.save(doc);
    }

    public Optional<Docente> obterDocente(Integer idDocente) {
        verificarId(idDocente);

        return repository.findById(idDocente);
    }

    public List<Docente> obterDocentesNome(String nome) {
        verificarPalavra(nome, "Nome inválido");

        return repository.findByNome(nome);
    }

    private void verificarPalavra(String nome, String mensagem) {
        if (nome == null) {
            throw new ServicoRuntimeException(mensagem);
        }
        if (nome.trim().equals("")) {
            throw new ServicoRuntimeException(mensagem);
        }
    }

    private void verificarId(Integer idDocente) {
        verificarNumero(idDocente, "Id Inválido");
        if (!repository.existsById(idDocente)) {
            throw new ServicoRuntimeException("Id do Docente não está registrado");
        }
    }

    private void verificarData(Integer data1, Integer data2) {
        verificarNumero(data1, "Data Inválida");
        verificarNumero(data2, "Data Inválida");
        if (data1 > data2) {
            throw new ServicoRuntimeException("Data inical maior que a data final");
        }
    }

    private void verificarNumero(Integer numero, String mensagem) {
        if (numero == null) {
            throw new ServicoRuntimeException(mensagem);
        }

    }

    private void verificarDocente(Docente docente) {
        verificarPalavra(docente.getNome(), "Nome inválido");
        verificarPalavra(docente.getLattes(), "Lattes inválido");
        verificarNumero(docente.getId(), "Id inválido");
        if (repository.existsById(docente.getId())) {
            throw new ServicoRuntimeException("Id já registrado");
        }
        /*
         * if(docente.getOrientacoes() == null){
         * throw new ServicoRuntimeException("Lista de orientações inexistente");
         * }
         * if(docente.getTecnicas() == null){
         * throw new ServicoRuntimeException("Lista de tecnicas inexistente");
         * }
         * if(docente.getProducoes() == null){
         * throw new ServicoRuntimeException("Lista de produções inexistente");
         * }
         * if(docente.getProgramas() == null){
         * throw new ServicoRuntimeException("Lista de programas inexistente");
         * }
         */
    }
}