package br.ufma.sppg.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.ufma.sppg.dto.QualisDocenteDTO;
import br.ufma.sppg.model.Docente;
import br.ufma.sppg.model.Orientacao;
import br.ufma.sppg.model.Producao;
import br.ufma.sppg.model.Programa;
import br.ufma.sppg.model.Tecnica;
import br.ufma.sppg.service.DocenteService;
import br.ufma.sppg.service.ProgramaService;
import br.ufma.sppg.service.exceptions.ServicoRuntimeException;

@RestController
@RequestMapping("/api/programa")
public class ProgramaController {

    @Autowired
    ProgramaService programaService;
    @Autowired
    DocenteService docenteService;

    @GetMapping("/obterQualisPrograma/{id}/{anoIni}/{anoFim}")
    public ResponseEntity obterQualisPrograma(
            @PathVariable("id") Integer idPrograma,
            @PathVariable("anoIni") Integer anoIni,
            @PathVariable("anoFim") Integer anoFim) {
        try {
            // Obtendo todos os docentes do programa
            List<Docente> docentesPrograma = programaService.obterDocentesPrograma(idPrograma);

            List<QualisDocenteDTO> qualisDocentesDTO = new ArrayList<QualisDocenteDTO>();

            for (Docente docente : docentesPrograma) {
                QualisDocenteDTO qualisDocenteAtual = docenteService.obterQualisDocente(docente.getId(), anoIni,
                        anoFim);

                qualisDocentesDTO.add(qualisDocenteAtual);
            }

            return ResponseEntity.ok().body(qualisDocentesDTO);
        } catch (ServicoRuntimeException e) {
            return ResponseEntity.badRequest().body(e);
        }
    }

    @GetMapping("/obterTodosProgramas")
    public ResponseEntity obterPrograma() {
        try {
            List<Programa> programas = programaService.obterTodosProgramas();
            return ResponseEntity.ok().body(programas);
        } catch (ServicoRuntimeException e) {
            return ResponseEntity.badRequest().body("Erro ao buscar programas");
        }
    }

    @GetMapping("/obterDocentesPrograma/{id}")
    public ResponseEntity obterDocentesPrograma(
            @PathVariable("id") Integer idPrograma) {
        try {
            List<Docente> docentes = programaService.obterDocentesPrograma(idPrograma);
            return new ResponseEntity(docentes, HttpStatus.OK);
        } catch (ServicoRuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/obterProducoesPrograma/{id}/{anoIni}/{anoFim}")
    public ResponseEntity obterProducoesPrograma(
            @PathVariable("id") Integer idPrograma,
            @PathVariable("anoIni") Integer anoIni,
            @PathVariable("anoFim") Integer anoFim) {
        try {
            List<Producao> producoes = programaService.obterProducoes(idPrograma, anoIni, anoFim);
            return new ResponseEntity(producoes, HttpStatus.OK);
        } catch (ServicoRuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/obterOrientacoesPrograma")
    public ResponseEntity obterOrientacoesPorgrama(
            @RequestParam("programa") Integer idPrograma, Integer anoIni, Integer anoFim) {
        try {
            List<Orientacao> orientacoes = programaService.obterOrientacoes(idPrograma, anoIni, anoFim);
            return new ResponseEntity(orientacoes, HttpStatus.OK);
        } catch (ServicoRuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/obterTecnicasPrograma")
    public ResponseEntity obterTecnicasPrograma(
            @RequestParam("programa") Integer idPrograma, Integer anoIni, Integer anoFim) {
        try {
            List<Tecnica> tecnicas = programaService.obterTecnicas(idPrograma, anoIni, anoFim);
            return new ResponseEntity(tecnicas, HttpStatus.OK);
        } catch (ServicoRuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/qtv_orientacoes_producao") // QTV = quantitativo
    public ResponseEntity<?> ObterQuantitativoOrientacaoProducao(
            @RequestParam("idPrograma") Integer idPrograma,
            @RequestParam("anoInicial") Integer anoIni,
            @RequestParam("anoFimal") Integer aniFin) {

        try {
            Integer quantitativo = programaService.quantitativoOrientacaoProducao(idPrograma, anoIni, aniFin);
            return new ResponseEntity<Integer>(quantitativo, HttpStatus.OK);

        } catch (ServicoRuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/qtv_orientacoes_tecnica") // QTV = quantitativo
    public ResponseEntity<?> ObterQuantitativoOrientacaoTecnica(
            @RequestParam("idPrograma") Integer idPrograma,
            @RequestParam("anoInicial") Integer anoIni,
            @RequestParam("anoFimal") Integer aniFin) {

        try {
            Integer quantitativo = programaService.quantitativoOrientacaoTecnica(idPrograma, anoIni, aniFin);
            return new ResponseEntity<Integer>(quantitativo, HttpStatus.OK);

        } catch (ServicoRuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
