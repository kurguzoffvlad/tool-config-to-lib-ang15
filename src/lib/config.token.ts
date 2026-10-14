// lib/config.token.ts
import { InjectionToken } from '@angular/core';

export interface IConfigToLib {
  apiUrl: string;
  log(msg: string): void;
}

export const LIB_CONFIG = new InjectionToken<IConfigToLib>('LIB_CONFIG');
