package br.ufma.sppg.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufma.sppg.model.Docente;
import br.ufma.sppg.model.Orientacao;
import br.ufma.sppg.model.Producao;
import br.ufma.sppg.model.Tecnica;
import br.ufma.sppg.service.DocenteService;
import br.ufma.sppg.service.OrientacaoService;
import br.ufma.sppg.service.ProducaoService;
import br.ufma.sppg.service.TecnicaService;
import br.ufma.sppg.service.exceptions.ServicoRuntimeException;


@RequestMapping("/api/docente")
@RestController()
public class DocenteController{

    @Autowired
    DocenteService docenteService;
    @Autowired
    TecnicaService tecnicaServivce;

    @Autowired
    ProducaoService producaoServivce;

    @Autowired
    OrientacaoService orientacaoServivce;

    @GetMapping("/{id}")
    public ResponseEntity<?> obterDocente(@PathVariable(value = "id", required = true) Integer idDocente) {
        try {
            var docente = docenteService.obterDocente(idDocente);
            return ResponseEntity.ok().body(docente);
        } catch (ServicoRuntimeException e){
            return ResponseEntity.badRequest().body("O docente informado não existe");
        }
        
    }

    @GetMapping("/obterDocentes")
    public ResponseEntity<?> obterTudo() {
        try {
            List<Docente> docentes = docenteService.obterDocentes();
            
            return ResponseEntity.ok().body(docentes);

        } catch(ServicoRuntimeException e) {
            
            return ResponseEntity.badRequest().body("Erro ao buscar docentes");
        }
    }

    @GetMapping("/obter_producoes/{id}/{anoIni}/{anoFim}")
    public ResponseEntity<?> obterProducoesDeDocente(@PathVariable(value = "id", required = true) Integer idDocente,
    @PathVariable(value = "anoIni", required = true)  Integer anoIni,
    @PathVariable(value = "anoFim", required = true)  Integer anoFim){

        try{

            // Lista de todas as produções do docente no período
            List<Producao> producaoDocente = producaoServivce.obterProducoesDocente(idDocente, anoIni, anoFim);
            return ResponseEntity.ok(producaoDocente);
        }catch (ServicoRuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/obter_orientacoes/{id}")
    public ResponseEntity<?> obterOrientacoesDeDocente(@PathVariable(value = "id", required = true) Integer idDocente,
    @PathVariable(value = "anoIni", required = true)  Integer anoIni,
    @PathVariable(value = "anoFim", required = true)  Integer anoFim){

        try{
            List<Orientacao> orientacaoDocente = orientacaoServivce.obterOrientacaoDocente(idDocente, anoIni, anoFim);
            return ResponseEntity.ok(orientacaoDocente);
        }catch (ServicoRuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/obter_tecnicas/{id}")
    public ResponseEntity<?> obterTecnicasDeDocente(@PathVariable(value = "id", required = true) Integer idDocente){

        try{
            List<Tecnica> tecnicaDocente = tecnicaServivce.obterTecnicasDocente(idDocente); 
            return ResponseEntity.ok(tecnicaDocente);
        }catch (ServicoRuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}