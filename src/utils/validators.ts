// src/utils/validators.ts

import { ContractFormData } from "../types/contracts";

export function validateStep0Partes(f: ContractFormData) {
  const errs: string[] = [];
  if (!f.prestadorNome?.trim()) errs.push("Nome do prestador é obrigatório.");
  if (!f.prestadorCpf?.trim()) errs.push("CPF do prestador é obrigatório.");
  if (!f.prestadorEmail?.trim()) errs.push("E-mail do prestador é obrigatório.");
  if (!f.prestadorEndereco?.trim()) errs.push("Endereço do prestador é obrigatório.");
  return errs;
}

export function validateStep1Parametros(f: ContractFormData) {
  const errs: string[] = [];
  if (!f.dataInicio?.trim()) errs.push("Data de início é obrigatória.");
  if (!f.valorTotal?.toString()?.trim()) errs.push("Valor total é obrigatório.");
  if (!f.foroCidade?.trim()) errs.push("Foro (cidade) é obrigatório.");
  if (!f.foroUf?.trim()) errs.push("Foro (UF) é obrigatório.");
  return errs;
}

export function validateStep2Servico(f: ContractFormData) {
  const errs: string[] = [];
  if (f.tipoDocumento === "contrato") {
    if (!f.servicoChave) errs.push("Selecione um serviço ou 'Custom'.");
    if (f.servicoChave === "custom") {
      if (!f.servicoCustomTitulo?.trim()) errs.push("Título do serviço (custom) é obrigatório.");
      if (!f.servicoCustomEscopo?.trim()) errs.push("Escopo do serviço (custom) é obrigatório.");
    }
  } else {
    if (!f.dataDistrato?.trim()) errs.push("Data do distrato é obrigatória.");
  }
  return errs;
}
