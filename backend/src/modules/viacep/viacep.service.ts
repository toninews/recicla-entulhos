import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

@Injectable()
export class ViacepService {
  async findAddress(zipCode: string) {
    const normalizedZipCode = zipCode.replace(/\D/g, '');

    if (normalizedZipCode.length !== 8) {
      throw new BadRequestException('CEP inválido. Informe 8 dígitos.');
    }

    let response: Response;

    try {
      response = await fetch(`https://viacep.com.br/ws/${normalizedZipCode}/json/`);
    } catch {
      throw new ServiceUnavailableException(
        'Serviço de CEP indisponível no momento.',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException('Falha ao consultar o ViaCEP.');
    }

    const data = (await response.json()) as ViaCepResponse;

    if (data.erro) {
      throw new NotFoundException('CEP não encontrado.');
    }

    return {
      zipCode: data.cep ?? normalizedZipCode,
      street: data.logradouro ?? '',
      complement: data.complemento ?? '',
      district: data.bairro ?? '',
      city: data.localidade ?? '',
      state: data.uf ?? '',
    };
  }
}
