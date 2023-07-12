package br.ufma.sppg.dto;

import java.util.Optional;

import br.ufma.sppg.model.Docente;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class QualisDocenteDTO {
  Docente docente;

  // List<Producao> producoes;
  int[] qualis;
}