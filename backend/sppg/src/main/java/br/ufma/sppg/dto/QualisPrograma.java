package br.ufma.sppg.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class QualisPrograma {
  List<QualisDocenteDTO> qualisDocenteObject;
}