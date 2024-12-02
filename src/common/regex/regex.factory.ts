import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OnlyLowerCaseLetterRegex } from './only-lowercase-letter.regex';
import { RemoveSpacesRegex } from './remove-spaces.regex';
import { RegexProtocol } from './regex.protocol';
export type ClassNames = 'OnlyLowercaseLettersRegex' | 'RemoveSpacesRegex';
@Injectable()
export class RegexFactory {
  create(className: ClassNames): RegexProtocol {
    // Meu código/lógica
    switch (className) {
      case 'OnlyLowercaseLettersRegex':
        return new OnlyLowerCaseLetterRegex();
      case 'RemoveSpacesRegex':
        return new RemoveSpacesRegex();
      default:
        throw new InternalServerErrorException(
          `No class found for ${className}`,
        );
    }
  }
}
